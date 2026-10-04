import { FrameDetectionResponse, DetectionItem } from '../types/detection';
import { DEMO_PRESETS, COMPONENT_COLORS } from './demoPresets';

let frameCounter = 1000;

// Dual backend URLs: localhost (USB adb reverse) and LAN Wi-Fi IP
export const BACKEND_URL = 'http://localhost:8000';
export const FALLBACK_BACKEND_URL = 'http://192.168.1.11:8000';

async function postFrame(url: string, bodyJson: string, timeoutMs: number = 3500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const resp = await fetch(`${url}/api/vision/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: bodyJson,
  });
  clearTimeout(timeoutId);
  return resp;
}

export async function detectComponentsFromFrame(
  base64Image: string | null,
  backendUrl: string = BACKEND_URL,
  isDemoMode: boolean = false,
  presetIndex: number = 0
): Promise<FrameDetectionResponse> {
  frameCounter++;

  if (isDemoMode) {
    const selectedPreset = DEMO_PRESETS[presetIndex % DEMO_PRESETS.length];
    return {
      frame_id: frameCounter,
      timestamp: Math.floor(Date.now() / 1000),
      detections: selectedPreset.components,
    };
  }

  if (!base64Image) {
    return {
      frame_id: frameCounter,
      timestamp: Math.floor(Date.now() / 1000),
      detections: [],
    };
  }

  const bodyJson = JSON.stringify({
    image: `data:image/jpeg;base64,${base64Image}`,
    frame_id: frameCounter,
  });

  try {
    let response: any = null;
    try {
      response = await postFrame(backendUrl, bodyJson, 3000);
    } catch {
      // Fallback to Wi-Fi LAN IP if localhost/USB fails
      if (backendUrl !== FALLBACK_BACKEND_URL) {
        response = await postFrame(FALLBACK_BACKEND_URL, bodyJson, 3000);
      }
    }

    if (response && response.ok) {
      const data = await response.json();
      if (Array.isArray(data.detections)) {
        return {
          frame_id: data.frame_id || frameCounter,
          timestamp: data.timestamp || Math.floor(Date.now() / 1000),
          detections: data.detections.map((d: any) => ({
            ...d,
            color: d.color || COMPONENT_COLORS[d.type] || '#10b981',
          })),
        };
      }
    }
  } catch {
    // Backend offline or error
  }

  return {
    frame_id: frameCounter,
    timestamp: Math.floor(Date.now() / 1000),
    detections: [],
  };
}
