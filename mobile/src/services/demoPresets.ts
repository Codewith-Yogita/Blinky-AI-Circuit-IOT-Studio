import { HardwarePreset } from '../types/detection';

export const COMPONENT_COLORS: Record<string, string> = {
  microcontroller: '#10b981', // Emerald green
  sensor: '#06b6d4',          // Cyber Cyan
  led: '#ef4444',             // Bright Red
  actuator: '#f59e0b',        // Amber / Orange
  resistor: '#eab308',        // Yellow
  infrastructure: '#64748b',  // Slate / Gray
  display: '#3b82f6',         // Electric Blue
  input: '#8b5cf6',           // Purple
};

export const DEMO_PRESETS: HardwarePreset[] = [
  {
    id: 'weather_station',
    name: 'Smart Weather IoT Node',
    subtitle: 'ESP32 + DHT11 + LED',
    description: 'Real-time temperature and humidity monitor with alert indicator LED.',
    suggestedPrompt: 'Build an IoT temperature and humidity monitor using ESP32, DHT11 sensor, and an LED alert on GPIO 2.',
    components: [
      {
        id: 'esp32_1',
        type: 'microcontroller',
        label: 'ESP32',
        confidence: 0.98,
        bbox: { x: 0.12, y: 0.24, width: 0.36, height: 0.52 },
        color: '#10b981',
        pins: ['3V3', 'GND', 'GPIO4 (DHT)', 'GPIO2 (LED)'],
        description: 'ESP32 DevKit V1 with built-in Wi-Fi & Bluetooth BLE',
      },
      {
        id: 'sensor_dht11',
        type: 'sensor',
        label: 'DHT11',
        confidence: 0.95,
        bbox: { x: 0.56, y: 0.22, width: 0.26, height: 0.30 },
        color: '#06b6d4',
        pins: ['VCC (3.3V)', 'DATA (GPIO4)', 'GND'],
        description: 'Digital Temperature & Relative Humidity Sensor',
      },
      {
        id: 'led_alert',
        type: 'led',
        label: 'LED (Red)',
        confidence: 0.97,
        bbox: { x: 0.60, y: 0.60, width: 0.18, height: 0.22 },
        color: '#ef4444',
        pins: ['Anode (GPIO2)', 'Cathode (GND via 220Ω)'],
        description: '5mm Red Diffused High-Brightness Status LED',
      },
      {
        id: 'resistor_1',
        type: 'resistor',
        label: '220Ω Resistor',
        confidence: 0.92,
        bbox: { x: 0.44, y: 0.68, width: 0.14, height: 0.12 },
        color: '#eab308',
        pins: ['Terminal 1', 'Terminal 2'],
        description: 'Current limiting resistor for LED',
      },
    ],
  },
  {
    id: 'distance_alarm',
    name: 'Smart Distance & Water Level',
    subtitle: 'ESP32 + HC-SR04 + Buzzer',
    description: 'Proximity detection with ultrasonic sonar and audio alert buzzer.',
    suggestedPrompt: 'Create a distance warning alarm with ESP32, HC-SR04 ultrasonic sensor, and piezo buzzer.',
    components: [
      {
        id: 'esp32_sonar',
        type: 'microcontroller',
        label: 'ESP32',
        confidence: 0.97,
        bbox: { x: 0.15, y: 0.26, width: 0.34, height: 0.50 },
        color: '#10b981',
        pins: ['5V', 'GND', 'GPIO5 (TRIG)', 'GPIO18 (ECHO)', 'GPIO16 (BUZZ)'],
        description: 'ESP32 DevKit V1 Microcontroller',
      },
      {
        id: 'sensor_sonar',
        type: 'sensor',
        label: 'HC-SR04',
        confidence: 0.96,
        bbox: { x: 0.54, y: 0.18, width: 0.38, height: 0.28 },
        color: '#06b6d4',
        pins: ['VCC', 'TRIG', 'ECHO', 'GND'],
        description: 'Ultrasonic Sonar Distance Measuring Transducer',
      },
      {
        id: 'buzzer_piezo',
        type: 'actuator',
        label: 'Piezo Buzzer',
        confidence: 0.94,
        bbox: { x: 0.58, y: 0.55, width: 0.22, height: 0.24 },
        color: '#f59e0b',
        pins: ['VCC (GPIO16)', 'GND'],
        description: 'Audible frequency alarm transducer',
      },
    ],
  },
];
