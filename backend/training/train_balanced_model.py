import os
import shutil
import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO

def build_and_train():
    print("[Trainer] Preparing perfectly balanced multiscale dataset for ESP32 & LED...")
    
    base_dir = Path("training_artifacts/balanced_dataset").resolve()
    if base_dir.exists():
        shutil.rmtree(base_dir)
        
    (base_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)

    # Base anchor image with both ESP32 and LED
    live_frame_path = "training_artifacts/latest_live_frame.jpg"
    if not os.path.exists(live_frame_path):
        print(f"Error: {live_frame_path} not found!")
        return

    live_img = cv2.imread(live_frame_path)
    h_live, w_live = live_img.shape[:2]

    # Ground truth normalized coordinates in latest_live_frame.jpg:
    # 0: ESP32 (xc, yc, w, h)
    # 1: LED (xc, yc, w, h)
    base_boxes = [
        (0, 0.650, 0.540, 0.130, 0.160),
        (1, 0.305, 0.547, 0.100, 0.085)
    ]

    # Also extract pure LED and ESP32 cutouts to composite multiscale variations
    led_x1, led_y1, led_x2, led_y2 = int(w_live * 0.255), int(h_live * 0.505), int(w_live * 0.355), int(h_live * 0.590)
    esp_x1, esp_y1, esp_x2, esp_y2 = int(w_live * 0.585), int(h_live * 0.460), int(w_live * 0.715), int(h_live * 0.620)

    led_crop = live_img[led_y1:led_y2, led_x1:led_x2].copy()
    esp_crop = live_img[esp_y1:esp_y2, esp_x1:esp_x2].copy()

    # White table background patch
    table_patch = live_img[int(h_live*0.7):int(h_live*0.9), int(w_live*0.2):int(w_live*0.8)].copy()

    sample_idx = 0

    # 1. Augment the full live frame (variations in brightness, flip, rotation, scale)
    target_size = (640, 640)
    resized_base = cv2.resize(live_img, target_size)

    for flip in [False, True]:
        for brightness in [0.70, 0.85, 1.0, 1.15, 1.30]:
            for angle in [-15, -8, 0, 8, 15]:
                aug = resized_base.copy()
                if flip:
                    aug = cv2.flip(aug, 1)
                aug = cv2.convertScaleAbs(aug, alpha=brightness, beta=0)

                if angle != 0:
                    M = cv2.getRotationMatrix2D((320, 320), angle, 1.0)
                    aug = cv2.warpAffine(aug, M, target_size, borderMode=cv2.BORDER_REFLECT)

                aug_boxes = []
                for cls_id, xc, yc, bw, bh in base_boxes:
                    cur_xc = (1.0 - xc) if flip else xc
                    cur_yc = yc
                    if angle != 0:
                        rad = np.radians(-angle)
                        ox = cur_xc - 0.5
                        oy = cur_yc - 0.5
                        rx = ox * np.cos(rad) - oy * np.sin(rad)
                        ry = ox * np.sin(rad) + oy * np.cos(rad)
                        cur_xc = np.clip(rx + 0.5, 0.05, 0.95)
                        cur_yc = np.clip(ry + 0.5, 0.05, 0.95)
                    aug_boxes.append((cls_id, cur_xc, cur_yc, bw, bh))

                split = "val" if (sample_idx % 6 == 0) else "train"
                img_name = f"full_aug_{sample_idx:04d}.jpg"
                lbl_name = f"full_aug_{sample_idx:04d}.txt"

                cv2.imwrite(str(base_dir / "images" / split / img_name), aug)
                with open(base_dir / "labels" / split / lbl_name, "w") as f:
                    for cls_id, xc, yc, bw, bh in aug_boxes:
                        f.write(f"{cls_id} {xc:.4f} {yc:.4f} {bw:.4f} {bh:.4f}\n")

                sample_idx += 1

    # 2. Synthetic composited samples placing LED and ESP32 at different positions & scales
    # to guarantee high recall for LED across the entire frame
    np.random.seed(42)
    for i in range(80):
        # Create background by resizing table patch
        bg = cv2.resize(table_patch, target_size)
        bg = cv2.convertScaleAbs(bg, alpha=np.random.uniform(0.85, 1.15), beta=np.random.randint(-15, 15))

        comp_boxes = []

        # Random placement of ESP32
        esp_scale = np.random.uniform(0.7, 1.3)
        ew = int(esp_crop.shape[1] * (target_size[0] / w_live) * esp_scale * 3.0)
        eh = int(esp_crop.shape[0] * (target_size[1] / h_live) * esp_scale * 3.0)
        ew = max(40, min(ew, 250))
        eh = max(60, min(eh, 320))
        ex = np.random.randint(20, target_size[0] - ew - 20)
        ey = np.random.randint(20, target_size[1] - eh - 20)

        resized_esp = cv2.resize(esp_crop, (ew, eh))
        bg[ey:ey+eh, ex:ex+ew] = resized_esp
        comp_boxes.append((0, (ex + ew/2)/target_size[0], (ey + eh/2)/target_size[1], ew/target_size[0], eh/target_size[1]))

        # Random placement of LED (non-overlapping with ESP32)
        led_scale = np.random.uniform(0.7, 1.4)
        lw = int(led_crop.shape[1] * (target_size[0] / w_live) * led_scale * 3.0)
        lh = int(led_crop.shape[0] * (target_size[1] / h_live) * led_scale * 3.0)
        lw = max(35, min(lw, 200))
        lh = max(35, min(lh, 200))

        # Try placing LED away from ESP32
        for _ in range(10):
            lx = np.random.randint(20, target_size[0] - lw - 20)
            ly = np.random.randint(20, target_size[1] - lh - 20)
            if abs(lx - ex) > ew or abs(ly - ey) > eh:
                break

        resized_led = cv2.resize(led_crop, (lw, lh))
        bg[ly:ly+lh, lx:lx+lw] = resized_led
        comp_boxes.append((1, (lx + lw/2)/target_size[0], (ly + lh/2)/target_size[1], lw/target_size[0], lh/target_size[1]))

        split = "val" if (sample_idx % 6 == 0) else "train"
        img_name = f"comp_{sample_idx:04d}.jpg"
        lbl_name = f"comp_{sample_idx:04d}.txt"

        cv2.imwrite(str(base_dir / "images" / split / img_name), bg)
        with open(base_dir / "labels" / split / lbl_name, "w") as f:
            for cls_id, xc, yc, bw, bh in comp_boxes:
                f.write(f"{cls_id} {xc:.4f} {yc:.4f} {bw:.4f} {bh:.4f}\n")

        sample_idx += 1

    print(f"[Trainer] Total training & validation samples created: {sample_idx}")

    yaml_path = base_dir / "dataset.yaml"
    with open(yaml_path, "w") as f:
        f.write(f"""path: {base_dir.as_posix()}
train: images/train
val: images/val
names:
  0: ESP32
  1: LED
""")

    print("[Trainer] Starting YOLO11 transfer learning (20 epochs)...")
    # Using official YOLO11n for guaranteed stability, sharp feature heads, and high recall
    model = YOLO("yolo11n.pt")
    model.train(
        data=str(yaml_path),
        epochs=20,
        imgsz=512,
        batch=16,
        workers=0,
        verbose=True
    )

    best_weights = Path(model.trainer.best)
    target_weights = Path("backend/esp32_yolo.pt").resolve()
    if best_weights.exists():
        shutil.copy(best_weights, target_weights)
        print(f"\n[Trainer] SUCCESS! Trained model saved to: {target_weights}")
    else:
        last_weights = Path(model.trainer.last)
        shutil.copy(last_weights, target_weights)
        print(f"\n[Trainer] Saved last.pt to: {target_weights}")

if __name__ == "__main__":
    build_and_train()
