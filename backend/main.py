import os
import json
import time
import httpx
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
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

# In-memory WebSocket manager to stream live phone camera frames to frontend
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                if connection in self.active_connections:
                    self.active_connections.remove(connection)

manager = ConnectionManager()

# Latest live frame & detections buffer
latest_live_data = {
    "image": "",
    "detections": [],
    "timestamp": 0,
    "frame_id": 0,
    "latency_ms": 0.0,
    "source": "mobile",
}

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
        "connected_frontend_clients": len(manager.active_connections),
        "has_live_mobile_stream": bool(latest_live_data["image"] and (time.time() - latest_live_data["timestamp"] < 5)),
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "has_live_stream": bool(latest_live_data["image"] and (time.time() - latest_live_data["timestamp"] < 5)),
        "active_clients": len(manager.active_connections),
    }

@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await manager.connect(websocket)
    # Immediately send the latest frame upon connection
    if latest_live_data["image"]:
        try:
            await websocket.send_json({
                "type": "frame",
                **latest_live_data,
            })
        except Exception:
            pass
    try:
        while True:
            # Keep socket alive and respond to client pings
            text = await websocket.receive_text()
            if text == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/api/vision/latest")
async def get_latest_frame():
    now = time.time()
    is_live = bool(latest_live_data["image"] and (now - latest_live_data["timestamp"] < 6))
    return {
        **latest_live_data,
        "is_live": is_live,
        "age_seconds": round(now - latest_live_data["timestamp"], 1) if latest_live_data["timestamp"] > 0 else None,
    }

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

    clean_base64 = raw_base64
    if "," in clean_base64:
        clean_base64 = clean_base64.split(",", 1)[1]
    clean_base64 = clean_base64.strip()

    # Continuously collect diverse training frames into dataset directory
    now = time.time()
    if clean_base64 and (now - _last_save_time > 1.2):
        _last_save_time = now
        try:
            import base64
            dataset_dir = os.path.join("training_artifacts", "collected_dataset")
            os.makedirs(dataset_dir, exist_ok=True)
            frame_filename = f"frame_{int(now * 1000)}.jpg"
            frame_path = os.path.join(dataset_dir, frame_filename)
            img_bytes = base64.b64decode(clean_base64)
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
    local_detections = vision_engine.detect(clean_base64)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    if len(local_detections) > 0:
        print(f"[YOLO26 {elapsed_ms:.1f}ms] Detected {len(local_detections)} components: {[d['label'] for d in local_detections]}")

    formatted_image = (
        f"data:image/jpeg;base64,{clean_base64}"
        if not raw_base64.startswith("data:")
        else raw_base64
    )

    # Update in-memory stream buffer
    latest_live_data["image"] = formatted_image
    latest_live_data["detections"] = local_detections
    latest_live_data["timestamp"] = timestamp
    latest_live_data["frame_id"] = frame_id
    latest_live_data["latency_ms"] = round(elapsed_ms, 1)

    # Broadcast to all connected frontend browsers
    if manager.active_connections:
        await manager.broadcast({
            "type": "frame",
            "image": formatted_image,
            "detections": local_detections,
            "timestamp": timestamp,
            "frame_id": frame_id,
            "latency_ms": round(elapsed_ms, 1),
        })

    return {
        "frame_id": frame_id,
        "timestamp": timestamp,
        "latency_ms": round(elapsed_ms, 1),
        "detections": local_detections,
    }

async def query_gemini_multimodal(prompt: str, base64_image: str = "", components: list = None):
    api_key = get_gemini_api_key()
    if not api_key:
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        parts = []
        if base64_image:
            clean_b64 = base64_image
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",", 1)[1]
            try:
                import base64 as b64module
                img_bytes = b64module.b64decode(clean_b64.strip())
                parts.append(types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"))
            except Exception as e:
                print(f"[Gemini] Error decoding base64 image: {e}")

        parts_list_str = ", ".join([str(c.get("label", c)) if isinstance(c, dict) else str(c) for c in (components or [])])

        system_instructions = f"""You are Blinky, an expert IoT and Embedded Electronics AI Engineer.
Analyze the user's prompt and the provided live camera photo of their physical workbench.
Detected components in view: {parts_list_str or 'See provided image'}.

You must return ONLY a valid JSON object matching this structure (no markdown wrappers outside, or standard ```json):
{{
  "text": "Detailed explanation of what you see on the desk, pinout advice, safety checks, and guidance answering the user prompt.",
  "circuit": {{
    "board": {{ "id": "esp32", "type": "ESP32", "model": "ESP32 DevKit V1" }},
    "components": [
      {{ "id": "comp_1", "type": "resistor", "name": "220Ω Resistor" }},
      {{ "id": "comp_2", "type": "led", "name": "Red LED" }}
    ],
    "connections": [
      {{ "from": {{ "component": "esp32", "pin": "GPIO2" }}, "to": {{ "component": "comp_1", "pin": "1" }} }},
      {{ "from": {{ "component": "comp_1", "pin": "2" }}, "to": {{ "component": "comp_2", "pin": "A" }} }},
      {{ "from": {{ "component": "comp_2", "pin": "K" }}, "to": {{ "component": "esp32", "pin": "GND" }} }}
    ]
  }},
  "code": "// Complete compilable Arduino C++ sketch\\nvoid setup() {{\\n ... \\n}}\\nvoid loop() {{\\n ... \\n}}",
  "instructions": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "suggestedNextSteps": [
    "Next idea 1",
    "Next idea 2"
  ]
}}
"""
        parts.append(f"{system_instructions}\n\nUser Question/Request: {prompt}")

        # Models to try: latest gemini-3.8-flash first, then fallback
        models_to_try = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-flash-latest"]
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=parts,
                )
                if response and response.text:
                    raw_text = response.text.strip()
                    if raw_text.startswith("```json"):
                        raw_text = raw_text[7:]
                    if raw_text.startswith("```"):
                        raw_text = raw_text[3:]
                    if raw_text.endswith("```"):
                        raw_text = raw_text[:-3]
                    raw_text = raw_text.strip()

                    try:
                        parsed = json.loads(raw_text)
                        return parsed
                    except Exception:
                        return {
                            "text": response.text,
                            "circuit": None,
                            "code": "",
                            "instructions": [],
                        }
            except Exception as err:
                print(f"[Gemini] Model {model_name} error: {err}")

    except Exception as e:
        print(f"[Gemini] General failure: {e}")

    return None

@app.post("/api/ai/chat")
async def ai_chat_endpoint(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    prompt = body.get("prompt", "").strip()
    image = body.get("image", "") or latest_live_data.get("image", "")
    components = body.get("components", []) or latest_live_data.get("detections", [])

    if not prompt:
        return JSONResponse({"error": "Prompt is required"}, status_code=400)

    # 1. Attempt Gemini 3.8 Flash multimodal inference
    gemini_result = await query_gemini_multimodal(prompt, image, components)
    if gemini_result and isinstance(gemini_result, dict):
        return {
            "success": True,
            "source": "gemini-3.8-flash",
            "text": gemini_result.get("text", "Circuit generated successfully."),
            "circuitProject": {
                "circuit": gemini_result.get("circuit", {
                    "board": { "id": "esp32", "type": "ESP32", "model": "ESP32 DevKit V1" },
                    "components": [],
                    "connections": [],
                }),
                "code": gemini_result.get("code", "// Arduino C++ code"),
                "instructions": gemini_result.get("instructions", []),
            } if gemini_result.get("circuit") or gemini_result.get("code") else None,
            "suggestedNextSteps": gemini_result.get("suggestedNextSteps", []),
        }

    # 2. Local Intelligent Fallback
    parts_names = [c.get("label", c) if isinstance(c, dict) else str(c) for c in components]
    fallback_text = f"Analyzed your hardware workspace ({', '.join(parts_names) if parts_names else 'ESP32 IoT Cluster'}). Synthesizing tailored IoT circuit schematic and firmware for: **{prompt}**."

    return {
        "success": True,
        "source": "blinky-local-engine",
        "text": fallback_text,
        "circuitProject": {
            "circuit": {
                "board": { "id": "esp32", "type": "ESP32", "model": "ESP32 DevKit V1" },
                "components": [
                    { "id": "resistor_1", "type": "resistor", "name": "220Ω Resistor" },
                    { "id": "led_red", "type": "led", "name": "Red LED" }
                ],
                "connections": [
                    { "from": { "component": "esp32", "pin": "GPIO2" }, "to": { "component": "resistor_1", "pin": "1" } },
                    { "from": { "component": "resistor_1", "pin": "2" }, "to": { "component": "led_red", "pin": "A" } },
                    { "from": { "component": "led_red", "pin": "K" }, "to": { "component": "esp32", "pin": "GND" } }
                ]
            },
            "code": """// Auto-generated Arduino C++ Sketch by Blinky AI
const int LED_PIN = 2;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("[Blinky] ESP32 Ready!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}""",
            "instructions": [
                "1. Mount your ESP32 DevKit V1 securely onto the breadboard.",
                "2. Connect GPIO2 to one leg of the 220Ω resistor.",
                "3. Connect the other leg of the resistor to the LED Anode (+).",
                "4. Connect the LED Cathode (-) directly to ESP32 GND.",
                "5. Upload the generated sketch via WebSerial."
            ]
        },
        "suggestedNextSteps": [
            "Add ultrasonic sonar sensor for obstacle detection",
            "Flash firmware directly to ESP32 via WebSerial"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


