import os
import shutil
import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO

def train_multiscale_esp32():
    print("[Trainer] Starting Multi-Scale ESP32 & IoT YOLO Model Training...")
    
    base_dir = Path("backend/esp32_data_v2").resolve()
    if base_dir.exists():
        shutil.rmtree(base_dir)
        
    (base_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)
    
    # 4 Real Anchor Images
    anchors = [
        # (filepath, [ (class_id, xc, yc, w, h) ])
        (
            r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.user_uploaded\media_1791086601357.jpg",
            [(0, 0.4850, 0.4975, 0.5980, 0.8150)]
        ),
        (
            r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.user_uploaded\media_1791086598066.jpg",
            [(0, 0.5465, 0.5340, 0.7090, 0.9160)]
        ),
        (
            r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.user_uploaded\media_1791093850176.jpg",
            [(0, 0.5466, 0.4580, 0.2542, 0.1973)]
        ),
        (
            r"C:\Projects\Blinky-AI-Circuit-IOT-Studio\backend\latest_live_frame.jpg",
            [
                (0, 0.5097, 0.5432, 0.1797, 0.1869),
                (1, 0.0898, 0.6015, 0.1062, 0.0735)
            ]
        )
    ]
    
    sample_count = 0
    
    for img_path, boxes in anchors:
        if not os.path.exists(img_path):
            print(f"Skipping missing: {img_path}")
            continue
            
        src = cv2.imread(img_path)
        if src is None:
            continue
            
        h, w = src.shape[:2]
        # Standardize size for consistent training
        target_size = (640, 640)
        
        # Base image
        resized_base = cv2.resize(src, target_size)
        
        # Generate variations across scale, brightness, flip, rotation
        for flip in [False, True]:
            for brightness in [0.75, 0.95, 1.15, 1.30]:
                for angle in [-12, -6, 0, 6, 12]:
                    # Create augmented image
                    aug = resized_base.copy()
                    
                    # 1. Flip
                    if flip:
                        aug = cv2.flip(aug, 1)
                        
                    # 2. Brightness
                    aug = cv2.convertScaleAbs(aug, alpha=brightness, beta=0)
                    
                    # 3. Rotation
                    if angle != 0:
                        M = cv2.getRotationMatrix2D((320, 320), angle, 1.0)
                        aug = cv2.warpAffine(aug, M, target_size, borderMode=cv2.BORDER_REFLECT)
                        
                    # Compute adjusted boxes
                    aug_boxes = []
                    for cls_id, xc, yc, bw, bh in boxes:
                        cur_xc = (1.0 - xc) if flip else xc
                        cur_yc = yc
                        
                        # Small rotation approx for center
                        if angle != 0:
                            rad = np.radians(-angle)
                            # center offset from (0.5, 0.5)
                            ox = cur_xc - 0.5
                            oy = cur_yc - 0.5
                            rx = ox * np.cos(rad) - oy * np.sin(rad)
                            ry = ox * np.sin(rad) + oy * np.cos(rad)
                            cur_xc = np.clip(rx + 0.5, 0.05, 0.95)
                            cur_yc = np.clip(ry + 0.5, 0.05, 0.95)
                            
                        aug_boxes.append((cls_id, cur_xc, cur_yc, bw, bh))
                        
                    # Split 85% train, 15% val
                    split = "val" if (sample_count % 7 == 0) else "train"
                    
                    img_name = f"sample_{sample_count:04d}.jpg"
                    lbl_name = f"sample_{sample_count:04d}.txt"
                    
                    cv2.imwrite(str(base_dir / "images" / split / img_name), aug)
                    
                    with open(base_dir / "labels" / split / lbl_name, "w") as f:
                        for cls_id, xc, yc, bw, bh in aug_boxes:
                            f.write(f"{cls_id} {xc:.4f} {yc:.4f} {bw:.4f} {bh:.4f}\n")
                            
                    sample_count += 1

    print(f"[Trainer] Generated {sample_count} augmented multiscale training samples!")
    
    yaml_path = base_dir / "dataset.yaml"
    with open(yaml_path, "w") as f:
        f.write(f"""path: {base_dir.as_posix()}
train: images/train
val: images/val
names:
  0: ESP32
  1: LED
""")

    print("[Trainer] Starting YOLOv8 transfer learning (15 epochs)...")
    model = YOLO("yolov8n.pt")
    model.train(
        data=str(yaml_path),
        epochs=15,
        imgsz=512,
        batch=8,
        workers=0,
        verbose=True
    )
    
    best_weights = Path(model.trainer.best)
    target_weights = Path("backend/esp32_yolo.pt").resolve()
    if best_weights.exists():
        shutil.copy(best_weights, target_weights)
        print(f"\n[Trainer] SUCCESS! Trained multiscale model saved to: {target_weights}")
    else:
        print("[Trainer] Warning: best.pt not found, trying last.pt...")
        last_weights = Path(model.trainer.last)
        if last_weights.exists():
            shutil.copy(last_weights, target_weights)
            print(f"\n[Trainer] Saved last.pt to: {target_weights}")

if __name__ == "__main__":
    train_multiscale_esp32()
