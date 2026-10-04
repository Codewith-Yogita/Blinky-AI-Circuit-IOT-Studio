# Model Training & Dataset Pipeline

## Overview

This guide details the dataset collection, annotation, augmentation, and model training workflow for the Blinky AI component vision detection engine.

---

## 1. Dataset Structure

Blinky follows the standard Ultralytics YOLO dataset layout:

```text
training_artifacts/
├── collected_dataset/           # Raw high-resolution frames captured from mobile cameras
│   ├── frame_1791105951960.jpg
│   └── ...
├── balanced_dataset/            # Augmented, balanced dataset ready for training
│   ├── images/
│   │   ├── train/               # Training images (640x640)
│   │   └── val/                 # Validation images (640x640)
│   └── labels/
│       ├── train/               # YOLO format labels (.txt)
│       └── val/                 # YOLO format labels (.txt)
└── esp32_data.yaml              # Dataset configuration file
```

---

## 2. YOLO Label Format

Each image has an associated `.txt` file with one row per detected component:

```text
<class_id> <x_center> <y_center> <width> <height>
```

All coordinates are normalized between `0.0` and `1.0` relative to the image dimensions:
- `x_center`: Center X coordinate divided by image width.
- `y_center`: Center Y coordinate divided by image height.
- `width`: Bounding box width divided by image width.
- `height`: Bounding box height divided by image height.

### Class Mapping

| Class ID | Label | Description |
| :--- | :--- | :--- |
| `0` | `ESP32` | ESP32-WROOM-32 / ESP32 DevKit V1 Microcontroller |
| `1` | `LED` | 5mm / 3mm Discrete LED or 3-pin LED Breakout Module |
| `2` | `Sensor` | DHT11/DHT22 Temperature & Humidity or HC-SR04 Ultrasonic Sonar |

---

## 3. Live Frame Collector

The FastAPI backend automatically logs and stores high-clarity frames captured by the mobile camera when running in live mode:

- **Location**: `training_artifacts/collected_dataset/`
- **Rate Limit**: 1 frame every 1.2 seconds (prevents redundant duplicates while preserving motion diversity)
- **Image Specs**: 1080p Full HD (`1080×1440` or `1920×1080`), 0.85 JPEG quality

---

## 4. Synthetic Augmentation & Composition

To prevent class imbalance (e.g., ESP32 dominating over smaller LED components), the training script (`backend/training/train_balanced_model.py`) applies:

1. **Affine Geometric Transforms**:
   - Random rotations between $-15^\circ$ and $+15^\circ$
   - Horizontal flipping
   - Random scale variations between $0.8\times$ and $1.3\times$
2. **Photometric Distortions**:
   - Contrast adjustment (alpha $0.70$ to $1.30$)
   - Brightness shifts (beta $-15$ to $+15$)
3. **Cut-and-Paste Background Composition**:
   - Extracts isolated component cutouts (LED modules, microcontrollers)
   - Blends them onto diverse desk and table background patches with random position offsets

---

## 5. Running Model Training

Execute the training script from the project root:

```bash
# Activate your Python virtual environment if applicable
python backend/training/train_balanced_model.py
```

### Key Training Hyperparameters:
- **Base Architecture**: YOLO Nano (`yolo11n.pt` / `yolo26n.pt`)
- **Image Size (`imgsz`)**: `640`
- **Epochs**: `30 - 50`
- **Batch Size**: `16`
- **Optimizer**: AdamW / Auto
- **Device**: CUDA GPU if available, CPU fallback automatically detected

---

## 6. Model Evaluation & Deployment

After training completes, metrics are logged in the `runs/detect/train/` directory:

1. **Validation Metrics**:
   - **mAP50**: Mean Average Precision at IoU threshold 0.50 (target: $> 0.90$)
   - **mAP50-95**: Mean Average Precision across IoU range 0.50–0.95 (target: $> 0.70$)
   - **Precision & Recall Curves**: Verified for both small LEDs and microcontrollers

2. **Model Weights Deployment**:
   The best checkpoint is automatically copied to:
   ```text
   backend/esp32_yolo.pt
   ```
   The FastAPI backend loads this checkpoint dynamically on startup, serving instant predictions at `/api/vision/detect`.
