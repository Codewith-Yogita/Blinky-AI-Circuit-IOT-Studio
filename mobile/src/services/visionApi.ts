import { FrameDetectionResponse, DetectionItem } from '../types/detection';
import { DEMO_PRESETS, COMPONENT_COLORS } from './demoPresets';

let frameCounter = 1000;

// Configurable backend URL pointing to PC's active LAN IP
export const BACKEND_URL = 'http://192.168.1.11:8000';

export async function detectComponentsFromFrame(
  base64Image: string | null,
  backendUrl: string = BACKEND_URL,
  isDemoMode: boolean = false,
  presetIndex: number = 0
): Promise<FrameDetectionResponse> {
  frameCounter++;

  // DEMO MODE: Explicitly enabled only when requested
  if (isDemoMode) {
    const selectedPreset = DEMO_PRESETS[presetIndex % DEMO_PRESETS.length];
    return {
      frame_id: frameCounter,
      timestamp: Math.floor(Date.now() / 1000),
      detections: selectedPreset.components,
    };
  }

  // LIVE MODE: Must have an actual captured camera frame
  if (!base64Image) {
    return {
      frame_id: frameCounter,
      timestamp: Math.floor(Date.now() / 1000),
      detections: [],
    };
  }

  // Send real image to FastAPI / Gemini Vision backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${backendUrl}/api/vision/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64Image}`,
        frame_id: frameCounter,
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
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
    // Backend offline or error - do NOT fake components!
  }

  // When no components are visible or backend has no detections, return strictly EMPTY
  return {
    frame_id: frameCounter,
    timestamp: Math.floor(Date.now() / 1000),
    detections: [],
  };
}
