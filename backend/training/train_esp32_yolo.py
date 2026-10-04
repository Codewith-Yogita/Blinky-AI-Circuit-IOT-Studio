import os
import shutil
import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO

def setup_and_train():
    print("[Trainer] Preparing dataset from your actual ESP32 hardware photos...")
    
    base_dir = Path("backend/esp32_data").resolve()
    if base_dir.exists():
        shutil.rmtree(base_dir)
        
    (base_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)
    
    img1_path = r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.user_uploaded\media_1791086601357.jpg"
    img2_path = r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.user_uploaded\media_1791086598066.jpg"
    
    # Ground truth bounding boxes for the 2 photos in YOLO format: class x_center y_center width height
    # Photo 1 (Front view):
    box1 = (0, 0.48, 0.50, 0.58, 0.82)
    # Photo 2 (Back view with wires):
    box2 = (0, 0.55, 0.55, 0.65, 0.85)
    
    samples = [
        (img1_path, box1),
        (img2_path, box2),
    ]
    
    sample_idx = 0
    
    for src_path, (cls, xc, yc, bw, bh) in samples:
        src = cv2.imread(src_path)
        if src is None:
            continue
            
        h, w = src.shape[:2]
        
        # Augmentations: brightness, rotations, flips
        for angle in [0, -10, 10]:
            for flip in [False, True]:
                for brightness in [0.8, 1.0, 1.2]:
                    # 1. Flip
                    aug_img = cv2.flip(src, 1) if flip else src.copy()
                    cur_xc = (1.0 - xc) if flip else xc
                    cur_yc = yc
                    
                    # 2. Brightness
                    aug_img = cv2.convertScaleAbs(aug_img, alpha=brightness, beta=0)
                    
                    # 3. Rotation (if angle != 0)
                    if angle != 0:
                        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
                        aug_img = cv2.warpAffine(aug_img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
                    
                    # Target split: 85% train, 15% val
                    split = "val" if (sample_idx % 6 == 0) else "train"
                    
                    img_name = f"esp32_{sample_idx:03d}.jpg"
                    lbl_name = f"esp32_{sample_idx:03d}.txt"
                    
                    cv2.imwrite(str(base_dir / "images" / split / img_name), aug_img)
                    
                    with open(base_dir / "labels" / split / lbl_name, "w") as f:
                        f.write(f"{cls} {cur_xc:.4f} {cur_yc:.4f} {bw:.4f} {bh:.4f}\n")
                        
                    sample_idx += 1
                    
    print(f"[Trainer] Generated {sample_idx} annotated training samples!")
    
    # Write dataset yaml
    yaml_path = base_dir / "dataset.yaml"
    with open(yaml_path, "w") as f:
        f.write(f"""path: {base_dir.as_posix()}
train: images/train
val: images/val
names:
  0: ESP32
""")

    print("[Trainer] Starting Ultralytics YOLO26 transfer learning (12 epochs)...")
    model = YOLO("yolo26n.pt")
    results = model.train(
        data=str(yaml_path),
        epochs=12,
        imgsz=416,
        batch=4,
        workers=0,
        verbose=True
    )
    
    # Find best.pt and copy to backend/esp32_yolo.pt
    best_weights = Path(model.trainer.best)
    target_weights = Path("backend/esp32_yolo.pt").resolve()
    if best_weights.exists():
        shutil.copy(best_weights, target_weights)
        print(f"\n[Trainer] SUCCESS! Trained custom YOLO model saved to: {target_weights}")
    else:
        print("[Trainer] Could not locate best.pt!")

if __name__ == "__main__":
    setup_and_train()
