import type { TfliteModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';
import { DetectionItem } from '../types/detection';
import { COMPONENT_COLORS } from './demoPresets';

let fastTfliteModule: any = null;
let nitroImageModule: any = null;

try {
  fastTfliteModule = require('react-native-fast-tflite');
} catch (e) {
  // Expected in Expo Go which lacks native C++ TurboModules
  console.log('[OnDeviceVision] Fast-TFLite not available in this runtime');
}

try {
  nitroImageModule = require('react-native-nitro-image');
} catch (e) {
  // Expected in Expo Go which lacks native C++ TurboModules
  console.log('[OnDeviceVision] Nitro-Image not available in this runtime');
}

export const isNativeOnDeviceSupported = !!(
  fastTfliteModule?.loadTensorflowModel && nitroImageModule?.loadImage
);

let cachedModel: TfliteModel | null = null;
let isLoadingModel = false;

const MODEL_INPUT_SIZE = 320;
const NUM_CLASSES = 2; // 0: ESP32, 1: LED
const NUM_ANCHORS = 2100;
const CONFIDENCE_THRESHOLD = 0.38;
const IOU_THRESHOLD = 0.45;

/**
 * Initializes and caches the offline on-device YOLO TFLite model.
 */
export async function getOnDeviceModel(): Promise<TfliteModel | null> {
  if (!isNativeOnDeviceSupported) {
    return null;
  }
  if (cachedModel) return cachedModel;
  if (isLoadingModel) return null;

  const { loadTensorflowModel } = fastTfliteModule;

  try {
    isLoadingModel = true;
    console.log('[OnDeviceVision] Loading on-device esp32_yolo.tflite model...');

    // Try 1: Resolve asset via expo-asset to ensure a valid local file URI
    try {
      const asset = Asset.fromModule(require('../../assets/models/esp32_yolo.tflite'));
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      const modelUri = asset.localUri || asset.uri;
      if (modelUri) {
        console.log('[OnDeviceVision] Resolved model URI via expo-asset:', modelUri);
        cachedModel = await loadTensorflowModel({ url: modelUri }, []);
        console.log('[OnDeviceVision] Loaded model via expo-asset!');
        return cachedModel;
      }
    } catch (e1) {
      console.log('[OnDeviceVision] expo-asset attempt failed:', e1);
    }

    // Try 2: Direct require fallback
    try {
      cachedModel = await loadTensorflowModel(
        require('../../assets/models/esp32_yolo.tflite'),
        []
      );
      console.log('[OnDeviceVision] Loaded model via direct require!');
      return cachedModel;
    } catch (e2) {
      console.log('[OnDeviceVision] Direct require failed:', e2);
    }

    // Try 3: Direct Android bundled asset
    try {
      cachedModel = await loadTensorflowModel({ url: 'file:///android_asset/esp32_yolo.tflite' }, []);
      console.log('[OnDeviceVision] Loaded model via android_asset!');
      return cachedModel;
    } catch (e3) {
      console.log('[OnDeviceVision] android_asset attempt failed:', e3);
    }

    return null;
  } finally {
    isLoadingModel = false;
  }
}

interface CandidateBox {
  clsId: number;
  label: string;
  conf: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function calculateIoU(a: CandidateBox, b: CandidateBox): number {
  const xx1 = Math.max(a.x1, b.x1);
  const yy1 = Math.max(a.y1, b.y1);
  const xx2 = Math.min(a.x2, b.x2);
  const yy2 = Math.min(a.y2, b.y2);

  const w = Math.max(0, xx2 - xx1);
  const h = Math.max(0, yy2 - yy1);
  const inter = w * h;

  const areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
  const union = areaA + areaB - inter;

  return union <= 0 ? 0 : inter / union;
}

function applyNMS(candidates: CandidateBox[], iouThreshold = IOU_THRESHOLD): CandidateBox[] {
  // Sort descending by confidence
  const sorted = [...candidates].sort((a, b) => b.conf - a.conf);
  const selected: CandidateBox[] = [];

  for (const cand of sorted) {
    let shouldKeep = true;
    for (const sel of selected) {
      if (sel.clsId === cand.clsId && calculateIoU(cand, sel) > iouThreshold) {
        shouldKeep = false;
        break;
      }
    }
    if (shouldKeep) {
      selected.push(cand);
    }
  }

  return selected;
}

/**
 * 100% Offline On-Device Detection using native C++ Nitro Image and Fast TFLite.
 */
export async function detectComponentsOnDevice(imageUri: string): Promise<DetectionItem[]> {
  try {
    const model = await getOnDeviceModel();
    if (!model || !nitroImageModule?.loadImage) return [];

    const { loadImage } = nitroImageModule;
    // Load native image from local file path and resize to 320x320 using native C++ Nitro engine
    const image = await loadImage({ filePath: imageUri });
    const resized = image.resize(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
    const rawPixels = resized.toRawPixelData();
    const pixelBytes = new Uint8Array(rawPixels.buffer);

    // Prepare Float32Array RGB normalized tensor [1, 320, 320, 3]
    const numPixels = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
    const inputBuffer = new Float32Array(numPixels * 3);
    const isRGBA = rawPixels.pixelFormat === 'RGBA' || rawPixels.pixelFormat === 'unknown';

    let outIdx = 0;
    for (let i = 0; i < pixelBytes.length && outIdx < inputBuffer.length; i += 4) {
      if (isRGBA) {
        inputBuffer[outIdx++] = pixelBytes[i] / 255.0;     // R
        inputBuffer[outIdx++] = pixelBytes[i + 1] / 255.0; // G
        inputBuffer[outIdx++] = pixelBytes[i + 2] / 255.0; // B
      } else {
        // BGRA fallback
        inputBuffer[outIdx++] = pixelBytes[i + 2] / 255.0; // R
        inputBuffer[outIdx++] = pixelBytes[i + 1] / 255.0; // G
        inputBuffer[outIdx++] = pixelBytes[i] / 255.0;     // B
      }
    }

    // Run synchronous on-device TFLite inference
    const outputBuffers = await model.run([inputBuffer.buffer]);
    if (!outputBuffers || outputBuffers.length === 0) return [];

    const output = new Float32Array(outputBuffers[0]);
    // Shape is [6, 2100]: row 0 = cx, row 1 = cy, row 2 = w, row 3 = h, row 4 = conf_esp32, row 5 = conf_led
    const candidates: CandidateBox[] = [];

    for (let col = 0; col < NUM_ANCHORS; col++) {
      const c0 = output[4 * NUM_ANCHORS + col]; // ESP32
      const c1 = output[5 * NUM_ANCHORS + col]; // LED
      const maxConf = Math.max(c0, c1);

      if (maxConf >= CONFIDENCE_THRESHOLD) {
        const cx = output[0 * NUM_ANCHORS + col] / MODEL_INPUT_SIZE;
        const cy = output[1 * NUM_ANCHORS + col] / MODEL_INPUT_SIZE;
        const w = output[2 * NUM_ANCHORS + col] / MODEL_INPUT_SIZE;
        const h = output[3 * NUM_ANCHORS + col] / MODEL_INPUT_SIZE;

        const x1 = Math.max(0, cx - w / 2);
        const y1 = Math.max(0, cy - h / 2);
        const x2 = Math.min(1, cx + w / 2);
        const y2 = Math.min(1, cy + h / 2);

        const isEsp32 = c0 >= c1;
        candidates.push({
          clsId: isEsp32 ? 0 : 1,
          label: isEsp32 ? 'ESP32' : 'LED',
          conf: maxConf,
          x1,
          y1,
          x2,
          y2,
        });
      }
    }

    // Filter overlapping detections
    const filtered = applyNMS(candidates, IOU_THRESHOLD);

    return filtered.map((box, index) => {
      const bw = Math.max(0.04, box.x2 - box.x1);
      const bh = Math.max(0.04, box.y2 - box.y1);
      const bx = Math.max(0, Math.min(1 - bw, box.x1));
      const by = Math.max(0, Math.min(1 - bh, box.y1));
      const compType = box.label === 'ESP32' ? 'microcontroller' : 'led';

      return {
        id: `${box.label.toLowerCase()}_${index + 1}`,
        type: compType,
        label: box.label,
        confidence: Math.round(box.conf * 100) / 100,
        color: COMPONENT_COLORS[compType] || '#10b981',
        bbox: {
          x: Math.round(bx * 1000) / 1000,
          y: Math.round(by * 1000) / 1000,
          width: Math.round(bw * 1000) / 1000,
          height: Math.round(bh * 1000) / 1000,
        },
      };
    });
  } catch (err) {
    console.log('[OnDeviceVision] Inference error:', err);
    return [];
  }
}
