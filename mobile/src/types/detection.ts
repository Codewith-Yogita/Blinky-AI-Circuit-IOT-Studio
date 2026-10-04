export interface BoundingBox {
  x: number;      // 0.0 to 1.0 (normalized horizontal offset from left)
  y: number;      // 0.0 to 1.0 (normalized vertical offset from top)
  width: number;  // 0.0 to 1.0 (normalized width)
  height: number; // 0.0 to 1.0 (normalized height)
}

export type ComponentType = 
  | 'microcontroller'
  | 'sensor'
  | 'actuator'
  | 'led'
  | 'resistor'
  | 'infrastructure'
  | 'display'
  | 'input';

export interface DetectionItem {
  id: string;
  type: ComponentType | string;
  label: string; // 'ESP32', 'DHT11', 'LED', 'HC-SR04', 'Breadboard', etc.
  confidence: number; // 0.0 to 1.0 (e.g. 0.97)
  bbox: BoundingBox;
  pins?: string[];
  description?: string;
  color?: string;
}

export interface FrameDetectionResponse {
  frame_id: number;
  timestamp: number;
  detections: DetectionItem[];
}

export interface HardwarePreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  components: DetectionItem[];
  suggestedPrompt: string;
}
