import os
import base64
import cv2
import numpy as np
import time
from typing import List, Dict, Any

try:
    from ultralytics import YOLO
    HAS_YOLO = True
except ImportError:
    HAS_YOLO = False

class OpenSourceVisionEngine:
    def __init__(self):
        self.model = None
        weights_path = os.path.join(os.path.dirname(__file__), "esp32_yolo.pt")
        if HAS_YOLO and os.path.exists(weights_path):
            try:
                self.model = YOLO(weights_path)
                print(f"[VisionEngine] Successfully loaded custom trained YOLOv8 model from: {weights_path}")
            except Exception as e:
                print(f"[VisionEngine] Error loading YOLO model: {e}")
        else:
            print(f"[VisionEngine] YOLO model not found at {weights_path}")

    def detect(self, base64_image: str) -> List[Dict[str, Any]]:
        if not base64_image:
            return []

        if "," in base64_image:
            base64_image = base64_image.split(",", 1)[1]
        
        try:
            img_bytes = base64.b64decode(base64_image.strip())
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return []
        except Exception as e:
            print(f"[VisionEngine] Decode error: {e}")
            return []

        h_orig, w_orig = img.shape[:2]
        if h_orig == 0 or w_orig == 0:
            return []

        detections = []

        # PRIMARY DETECTOR: Custom Trained Multiscale YOLO Model
        if self.model is not None:
            try:
                # Pass image directly with YOLO native letterboxing at 640px
                results = self.model(img, imgsz=640, conf=0.35, iou=0.45, verbose=False)
                for r in results:
                    for i, box in enumerate(r.boxes):
                        x1, y1, x2, y2 = box.xyxyn[0].tolist()
                        cls_id = int(box.cls[0])
                        label = self.model.names.get(cls_id, "ESP32")
                        raw_conf = float(box.conf[0])

                        bw = max(0.04, x2 - x1)
                        bh = max(0.04, y2 - y1)
                        bx = max(0.0, min(1.0 - bw, x1))
                        by = max(0.0, min(1.0 - bh, y1))

                        comp_type = "microcontroller"
                        if "LED" in label.upper():
                            comp_type = "led"
                        elif "DHT" in label.upper() or "SENSOR" in label.upper():
                            comp_type = "sensor"

                        detections.append({
                            "id": f"{label.lower()}_{i+1}",
                            "type": comp_type,
                            "label": label,
                            "confidence": round(raw_conf, 2),
                            "bbox": {
                                "x": round(bx, 3),
                                "y": round(by, 3),
                                "width": round(bw, 3),
                                "height": round(bh, 3),
                            }
                        })
            except Exception as e:
                print(f"[VisionEngine] YOLO inference error: {e}")

        return detections

vision_engine = OpenSourceVisionEngine()
