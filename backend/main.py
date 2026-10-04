import os
import json
import time
import httpx
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Automatically load .env from backend directory or project root
backend_env = Path(__file__).resolve().parent / ".env"
root_env = Path(__file__).resolve().parent.parent / ".env"

if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)
if root_env.exists():
    load_dotenv(dotenv_path=root_env, override=False)

app = FastAPI(title="Blinky AI Vision Backend", version="1.0.0")

# Enable CORS for Mobile App and Desktop Web App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if (key.startswith('"') and key.endswith('"')) or (key.startswith("'") and key.endswith("'")):
        key = key[1:-1]
    return key

try:
    from backend.vision_engine import vision_engine
except ImportError:
    from vision_engine import vision_engine

_last_save_time = 0.0

@app.get("/")
def read_root():
    api_key = get_gemini_api_key()
    return {
        "status": "online",
        "service": "Blinky AI Vision Backend (YOLO26 Instant)",
        "gemini_configured": bool(api_key),
        "key_preview": f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else None,
        "timestamp": int(time.time()),
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/vision/detect")
async def detect_components(request: Request):
    global _last_save_time
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    frame_id = body.get("frame_id", int(time.time() * 1000) % 100000)
    raw_base64 = body.get("image", "")
    timestamp = int(time.time())

    if "," in raw_base64:
        raw_base64 = raw_base64.split(",", 1)[1]
    raw_base64 = raw_base64.strip()

    # Continuously collect diverse training frames into dataset directory
    now = time.time()
    if raw_base64 and (now - _last_save_time > 1.2):
        _last_save_time = now
        try:
            import base64
            dataset_dir = os.path.join("training_artifacts", "collected_dataset")
            os.makedirs(dataset_dir, exist_ok=True)
            frame_filename = f"frame_{int(now * 1000)}.jpg"
            frame_path = os.path.join(dataset_dir, frame_filename)
            img_bytes = base64.b64decode(raw_base64)
            with open(frame_path, "wb") as f:
                f.write(img_bytes)
            # Also keep latest_live_frame.jpg updated
            with open(os.path.join("training_artifacts", "latest_live_frame.jpg"), "wb") as f:
                f.write(img_bytes)
            print(f"[Collector] Saved live training frame: {frame_filename} ({len(img_bytes)} bytes)")
        except Exception as e:
            print(f"[Collector] Save error: {e}")
            pass

    # Instant YOLO26 Engine Detection
    local_detections = vision_engine.detect(raw_base64)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    if len(local_detections) > 0:
        print(f"[YOLO26 {elapsed_ms:.1f}ms] Detected {len(local_detections)} components: {[d['label'] for d in local_detections]}")

    return {
        "frame_id": frame_id,
        "timestamp": timestamp,
        "latency_ms": round(elapsed_ms, 1),
        "detections": local_detections,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
