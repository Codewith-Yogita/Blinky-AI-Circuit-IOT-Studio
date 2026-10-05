import { FrameDetectionResponse, DetectionItem } from '../types/detection';
import { DEMO_PRESETS, COMPONENT_COLORS } from './demoPresets';

let frameCounter = 1000;

// Default PC Wi-Fi LAN IP address and USB adb reverse localhost
export const DEFAULT_LAN_URL = 'http://192.168.1.11:8000';
export const DEFAULT_USB_URL = 'http://localhost:8000';

let configuredBackendUrl: string = DEFAULT_LAN_URL;
let activeWorkingUrl: string = DEFAULT_LAN_URL;
let isConnectedToPC: boolean = false;

export function setCustomBackendUrl(url: string) {
  let clean = url.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `http://${clean}`;
  }
  if (!clean.includes(':')) {
    clean = `${clean}:8000`;
  }
  configuredBackendUrl = clean;
  activeWorkingUrl = clean;
}

export function getActiveBackendUrl(): string {
  return activeWorkingUrl;
}

export function getIsConnectedToPC(): boolean {
  return isConnectedToPC;
}

async function postFrame(url: string, bodyJson: string, timeoutMs: number = 2000) {
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
  customUrl?: string,
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

  // Candidate URLs in priority order: active working url -> configured url -> USB localhost
  const candidates = Array.from(
    new Set([customUrl || activeWorkingUrl, configuredBackendUrl, DEFAULT_LAN_URL, DEFAULT_USB_URL])
  ).filter(Boolean) as string[];

  for (const url of candidates) {
    try {
      const response = await postFrame(url, bodyJson, 1500);
      if (response && response.ok) {
        activeWorkingUrl = url;
        isConnectedToPC = true;
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
      // Try next candidate
    }
  }

  isConnectedToPC = false;
  return {
    frame_id: frameCounter,
    timestamp: Math.floor(Date.now() / 1000),
    detections: [],
  };
}
