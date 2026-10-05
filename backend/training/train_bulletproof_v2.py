import os
import shutil
import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO

def rotate_image_and_get_box(image, angle):
    h, w = image.shape[:2]
    if angle == 0:
        return image.copy(), w, h

    M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])
    new_w = int((h * sin) + (w * cos))
    new_h = int((h * cos) + (w * sin))
    M[0, 2] += (new_w / 2) - (w / 2)
    M[1, 2] += (new_h / 2) - (h / 2)
    rotated = cv2.warpAffine(image, M, (new_w, new_h), borderMode=cv2.BORDER_REFLECT)
    return rotated, new_w, new_h

def train_bulletproof_v2():
    print("[Trainer] Preparing Bulletproof V2 dataset (Dual ESP32 Front + Tilted Pin-Side & Clear LED)...")

    base_dir = Path("training_artifacts/bulletproof_v2_dataset").resolve()
    if base_dir.exists():
        shutil.rmtree(base_dir)

    (base_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
    (base_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)

    crops_dir = Path("training_artifacts/accurate_crops")
    esp_front = cv2.imread(str(crops_dir / "esp32_front.jpg"))
    esp_tilt1 = cv2.imread(str(crops_dir / "esp32_tilt_pins1.jpg"))
    esp_tilt2 = cv2.imread(str(crops_dir / "esp32_tilt_pins2.jpg"))
    
    led_clear1 = cv2.imread(str(crops_dir / "led_clear_1.jpg"))
    led_clear2 = cv2.imread(str(crops_dir / "led_clear_2.jpg"))
    led_bulb = cv2.imread(str(crops_dir / "led_pure_bulb.jpg"))

    neg_candy = cv2.imread(str(crops_dir / "neg_candy.jpg"))
    neg_tablet = cv2.imread(str(crops_dir / "neg_tablet.jpg"))

    # Real frames
    f_real1 = r"C:\Users\sahil\.gemini\antigravity-ide\brain\280f0aeb-740e-4b38-b1fc-ada722e3fff7\.tempmediaStorage\media_1791198199220.jpg"
    f_real2 = "training_artifacts/collected_dataset/frame_1791202601826.jpg"
    f_real3 = "training_artifacts/collected_dataset/frame_1791202606018.jpg"
    f_real4 = "training_artifacts/collected_dataset/frame_1791202611950.jpg"
    f_real5 = "training_artifacts/collected_dataset/frame_1791202613731.jpg"

    img_real1 = cv2.imread(f_real1)
    img_real2 = cv2.imread(f_real2)
    img_real3 = cv2.imread(f_real3)
    img_real4 = cv2.imread(f_real4)
    img_real5 = cv2.imread(f_real5)

    target_size = (320, 320)
    sample_idx = 0

    # Table background patch from real1
    table_patch = img_real1[int(img_real1.shape[0] * 0.7):int(img_real1.shape[0] * 0.95), int(img_real1.shape[1] * 0.2):int(img_real1.shape[1] * 0.8)].copy()

    # Blue box crop
    blue_box_crop = img_real1[0:int(img_real1.shape[0] * 0.28), 0:int(img_real1.shape[1] * 0.45)].copy()

    # --- PART 1: Real Annotated Ground Truth Scenes with Augmentations ---
    # Real scene 1: Upright Front ESP32 + Clear LED
    # (cls_id, xc, yc, bw, bh)
    real_scenes = [
        (img_real1, [
            (0, 735 / 1080, 750 / 1440, 130 / 1080, 260 / 1440), # ESP32
            (1, 300 / 1080, 765 / 1440, 120 / 1080, 150 / 1440), # LED
        ]),
        (img_real2, [
            (0, 715 / 1080, 800 / 1440, 270 / 1080, 240 / 1440), # Tilted ESP32
            (1, 347.5 / 1080, 675 / 1440, 125 / 1080, 150 / 1440), # LED
        ]),
        (img_real3, [
            (0, 730 / 1080, 575 / 1440, 250 / 1080, 222 / 1440), # Tilted ESP32
        ]),
        (img_real4, [
            (0, 884 / 1080, 320 / 1440, 392 / 1080, 622 / 1440), # Tilted ESP32
        ]),
        (img_real5, [
            (0, 735 / 1080, 678 / 1440, 220 / 1080, 180 / 1440), # Tilted ESP32
        ]),
    ]

    for img_src, gt_boxes in real_scenes:
        base_resized = cv2.resize(img_src, target_size)
        for flip in [False, True]:
            for brightness in [0.80, 1.0, 1.20]:
                for angle in [-15, 0, 15]:
                    aug = base_resized.copy()
                    if flip:
                        aug = cv2.flip(aug, 1)
                    aug = cv2.convertScaleAbs(aug, alpha=brightness, beta=0)

                    if angle != 0:
                        M = cv2.getRotationMatrix2D((160, 160), angle, 1.0)
                        aug = cv2.warpAffine(aug, M, target_size, borderMode=cv2.BORDER_REFLECT)

                    aug_boxes = []
                    for cls_id, xc, yc, bw, bh in gt_boxes:
                        cur_xc = (1.0 - xc) if flip else xc
                        cur_yc = yc
                        if angle != 0:
                            rad = np.radians(-angle)
                            ox = cur_xc - 0.5
                            oy = cur_yc - 0.5
                            rx = ox * np.cos(rad) - oy * np.sin(rad)
                            ry = ox * np.sin(rad) + oy * np.cos(rad)
                            cur_xc = float(np.clip(rx + 0.5, 0.05, 0.95))
                            cur_yc = float(np.clip(ry + 0.5, 0.05, 0.95))
                        aug_boxes.append((cls_id, cur_xc, cur_yc, bw, bh))

                    split = "val" if (sample_idx % 5 == 0) else "train"
                    cv2.imwrite(str(base_dir / "images" / split / f"scene_{sample_idx:04d}.jpg"), aug)
                    with open(base_dir / "labels" / split / f"scene_{sample_idx:04d}.txt", "w") as f:
                        for cls_id, xc, yc, bw, bh in aug_boxes:
                            f.write(f"{cls_id} {xc:.4f} {yc:.4f} {bw:.4f} {bh:.4f}\n")
                    sample_idx += 1

    # --- PART 2: Hard Negative Samples (Empty Labels) ---
    print("[Trainer] Adding hard negative samples (candy, box, table, door)...")
    # Candy wrapper negative samples
    for sub_i in range(12):
        bg = cv2.resize(table_patch, target_size)
        candy_scaled = cv2.resize(neg_candy, (np.random.randint(50, 100), np.random.randint(60, 120)))
        ch, cw = candy_scaled.shape[:2]
        cpx = np.random.randint(10, target_size[0] - cw - 10)
        cpy = np.random.randint(10, target_size[1] - ch - 10)
        bg[cpy:cpy+ch, cpx:cpx+cw] = candy_scaled
        split = "val" if (sub_i % 3 == 0) else "train"
        cv2.imwrite(str(base_dir / "images" / split / f"neg_candy_{sample_idx:04d}.jpg"), bg)
        with open(base_dir / "labels" / split / f"neg_candy_{sample_idx:04d}.txt", "w") as f:
            pass
        sample_idx += 1

    # Blue box negative samples
    for sub_i in range(12):
        bg = cv2.resize(table_patch, target_size)
        box_scaled = cv2.resize(blue_box_crop, (np.random.randint(100, 180), np.random.randint(70, 120)))
        bh, bw = box_scaled.shape[:2]
        bg[0:bh, 0:bw] = box_scaled
        split = "val" if (sub_i % 3 == 0) else "train"
        cv2.imwrite(str(base_dir / "images" / split / f"neg_box_{sample_idx:04d}.jpg"), bg)
        with open(base_dir / "labels" / split / f"neg_box_{sample_idx:04d}.txt", "w") as f:
            pass
        sample_idx += 1

    # Pure background frames (room, empty desk, doorway)
    neg_frames = [
        "training_artifacts/collected_dataset/frame_1791202571137.jpg",
        "training_artifacts/collected_dataset/frame_1791202572339.jpg",
        "training_artifacts/collected_dataset/frame_1791202573546.jpg",
    ]
    for neg_idx, nf in enumerate(neg_frames):
        if os.path.exists(nf):
            neg_img = cv2.imread(nf)
            for sub_i in range(4):
                n_res = cv2.resize(neg_img, target_size)
                n_res = cv2.convertScaleAbs(n_res, alpha=np.random.uniform(0.85, 1.15), beta=np.random.randint(-10, 10))
                split = "val" if (neg_idx == 0 and sub_i == 0) else "train"
                cv2.imwrite(str(base_dir / "images" / split / f"neg_desk_{sample_idx:04d}.jpg"), n_res)
                with open(base_dir / "labels" / split / f"neg_desk_{sample_idx:04d}.txt", "w") as f:
                    pass
                sample_idx += 1

    # --- PART 3: Comprehensive Composites (ESP32 Front + Tilted Pin-Side & Clear LED) ---
    print("[Trainer] Generating diverse composite scenes with all ESP32 and LED variants...")
    esp_variants = [esp_front, esp_tilt1, esp_tilt2]
    led_variants = [led_clear1, led_clear2, led_bulb]
    angles = [0, 15, 30, 45, 60, 75, 90, 120, 150, 180, 210, 240, 270, 315]

    np.random.seed(42)
    for i in range(160):
        bg = cv2.resize(table_patch, target_size)
        bg = cv2.convertScaleAbs(bg, alpha=np.random.uniform(0.80, 1.20), beta=np.random.randint(-15, 15))
        comp_boxes = []

        # Optional: Add negative distractor (candy or box) to composite
        if np.random.rand() > 0.6:
            distractor = neg_candy if np.random.rand() > 0.5 else blue_box_crop
            dw = np.random.randint(40, 90)
            dh = np.random.randint(40, 90)
            d_fit = cv2.resize(distractor, (dw, dh))
            dx = np.random.randint(5, target_size[0] - dw - 5)
            dy = np.random.randint(5, target_size[1] - dh - 5)
            bg[dy:dy+dh, dx:dx+dw] = d_fit

        # 1. Place ESP32 (Randomly Front, Tilt-1, or Tilt-2 at random angle)
        chosen_esp = esp_variants[np.random.randint(len(esp_variants))]
        chosen_angle = angles[i % len(angles)]
        rot_esp, rot_w, rot_h = rotate_image_and_get_box(chosen_esp, chosen_angle)
        scale_e = np.random.uniform(0.35, 0.65)
        final_ew = max(24, int(rot_w * scale_e))
        final_eh = max(24, int(rot_h * scale_e))
        esp_fit = cv2.resize(rot_esp, (final_ew, final_eh))

        max_ex = target_size[0] - final_ew - 10
        max_ey = target_size[1] - final_eh - 10
        if max_ex > 10 and max_ey > 10:
            epx = np.random.randint(10, max_ex)
            epy = np.random.randint(10, max_ey)
            bg[epy:epy+final_eh, epx:epx+final_ew] = esp_fit

            exc = (epx + final_ew / 2.0) / target_size[0]
            eyc = (epy + final_eh / 2.0) / target_size[1]
            comp_boxes.append((0, exc, eyc, final_ew / target_size[0], final_eh / target_size[1]))

        # 2. Place LED (Randomly Clear Module 1, Clear Module 2, or Pure Bulb)
        chosen_led = led_variants[np.random.randint(len(led_variants))]
        led_angle = np.random.choice([0, 45, 90, 180, 270])
        rot_led, rot_lw, rot_lh = rotate_image_and_get_box(chosen_led, led_angle)
        scale_l = np.random.uniform(0.40, 0.70)
        final_lw = max(18, int(rot_lw * scale_l))
        final_lh = max(18, int(rot_lh * scale_l))
        led_fit = cv2.resize(rot_led, (final_lw, final_lh))

        # Try to place LED without overlapping ESP32
        for _ in range(15):
            max_lx = target_size[0] - final_lw - 10
            max_ly = target_size[1] - final_lh - 10
            if max_lx <= 10 or max_ly <= 10:
                break
            lpx = np.random.randint(10, max_lx)
            lpy = np.random.randint(10, max_ly)

            # Check overlap with ESP32
            if len(comp_boxes) > 0:
                _, exc, eyc, ew_norm, eh_norm = comp_boxes[0]
                epx_c = exc * target_size[0]
                epy_c = eyc * target_size[1]
                if abs(lpx + final_lw/2 - epx_c) < (final_ew/2 + final_lw/2 + 8) and \
                   abs(lpy + final_lh/2 - epy_c) < (final_eh/2 + final_lh/2 + 8):
                    continue

            bg[lpy:lpy+final_lh, lpx:lpx+final_lw] = led_fit
            lxc = (lpx + final_lw / 2.0) / target_size[0]
            lyc = (lpy + final_lh / 2.0) / target_size[1]
            comp_boxes.append((1, lxc, lyc, final_lw / target_size[0], final_lh / target_size[1]))
            break

        split = "val" if (sample_idx % 5 == 0) else "train"
        cv2.imwrite(str(base_dir / "images" / split / f"comp_{sample_idx:04d}.jpg"), bg)
        with open(base_dir / "labels" / split / f"comp_{sample_idx:04d}.txt", "w") as f:
            for cls_id, xc, yc, bw, bh in comp_boxes:
                f.write(f"{cls_id} {xc:.4f} {yc:.4f} {bw:.4f} {bh:.4f}\n")
        sample_idx += 1

    print(f"[Trainer] Dataset ready! Total samples: {sample_idx}")

    # Create dataset.yaml
    yaml_content = f"""path: {base_dir.as_posix()}
train: images/train
val: images/val

names:
  0: ESP32
  1: LED
"""
    yaml_path = base_dir / "dataset.yaml"
    with open(yaml_path, "w") as f:
        f.write(yaml_content)

    print("[Trainer] Initializing YOLOv8n and starting training...")
    model = YOLO("yolov8n.pt")
    results = model.train(
        data=str(yaml_path),
        epochs=14,
        imgsz=320,
        batch=16,
        workers=0,
        device="cpu",
        project="training_artifacts/runs_bulletproof_v2",
        name="esp32_led_v2",
        exist_ok=True,
        hsv_h=0.015,
        hsv_s=0.5,
        hsv_v=0.4,
        degrees=15.0,
        scale=0.3,
        flipud=0.0,
        fliplr=0.5,
        mosaic=0.5
    )

    best_weights = Path("training_artifacts/runs_bulletproof_v2/esp32_led_v2/weights/best.pt")
    if best_weights.exists():
        target_pt = Path("esp32_yolo.pt").resolve()
        shutil.copy(best_weights, target_pt)
        print(f"[Trainer] Successfully trained and saved new bulletproof weights to {target_pt}")

        print("[Trainer] Exporting to ONNX...")
        best_model = YOLO(str(target_pt))
        best_model.export(format="onnx", imgsz=320, opset=12)

        print("[Trainer] ONNX export complete.")
    else:
        print("[Trainer] Error: best.pt was not found.")

if __name__ == "__main__":
    train_bulletproof_v2()
