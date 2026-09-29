import { useState, useEffect } from "react";
import {
  Zap,
  Sparkles,
  ArrowRight,
  CircuitBoard,
  Code2,
  Cpu,
  Bot,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Radio,
  Play,
  Pause,
  Layers,
  ShieldCheck,
  Flame,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Check,
  Waves,
  X,
  ExternalLink,
  Gauge,
  Volume2,
  Sliders,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import Interactive3DHeadline from "./Interactive3DHeadline";

export default function LandingPage({
  onLaunchStudio,
  onSelectPreset,
  onGeneratePrompt,
  isLoading,
}) {
  const [heroPrompt, setHeroPrompt] = useState("");
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPausedOnHover, setIsPausedOnHover] = useState(false);
  const [activeSignalMode, setActiveSignalMode] = useState("sonar");
  const [inspectedModule, setInspectedModule] = useState(null);

  const handleHeroSubmit = (e) => {
    e?.preventDefault();
    if (heroPrompt.trim() && !isLoading) {
      onGeneratePrompt(heroPrompt.trim());
    } else {
      onLaunchStudio();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleHeroSubmit();
    }
  };

  useEffect(() => {
    const handleGlobalEsc = (e) => {
      if (e.key === "Escape") {
        setInspectedModule(null);
      }
    };
    window.addEventListener("keydown", handleGlobalEsc);
    return () => window.removeEventListener("keydown", handleGlobalEsc);
  }, []);

  const examplePrompts = [
    {
      title: "Water level alarm with buzzer & ultrasonic",
      category: "Environmental",
      presetKey: "flagship",
    },
    {
      title: "ESP32 dual LED with push button debounce",
      category: "Input / Logic",
      presetKey: "preset2",
    },
    {
      title: "Diagnostic pulse beacon with serial telemetry",
      category: "Bringup",
      presetKey: "preset1",
    },
    {
      title: "PIR motion security alert with piezo siren",
      category: "Security",
      presetKey: null,
    },
  ];

  const waveSignalModes = {
    sonar: {
      id: "sonar",
      name: "HC-SR04 Ultrasonic Distance Sensor",
      shortLabel: "Ultrasonic Echo Wave",
      color: "amber",
      textColor: "text-amber-400",
      activeTabStyle: "border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.45)]",
      inactiveTabStyle: "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-amber-500/40",
      gradId: "waveGradAmber",
      pathPrimary: "M0,40 Q75,10 150,40 T300,40 T450,40 T600,40 T750,40 T900,40 T1050,40 T1200,40",
      pathSecondary: "M0,40 Q75,70 150,40 T300,40 T450,40 T600,40 T750,40 T900,40 T1050,40 T1200,40",
      animClassPrimary: "wavy-signal-path-1",
      animClassSecondary: "wavy-signal-path-2",
      metrics: {
        pin: "GPIO 18 (Echo In)",
        frequency: "40.0 kHz Acoustic",
        reading: "14.2 cm Distance",
        status: "Wokwi Live Simulation",
      },
      tagline: "Emits 40kHz sonic burst into water/air. Echo timing calculates millimeter-accurate tank liquid levels in real time.",
    },
    buzzer: {
      id: "buzzer",
      name: "Piezo Acoustic Warning Siren",
      shortLabel: "Piezo Alarm Wave",
      color: "red",
      textColor: "text-red-400",
      activeTabStyle: "border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.45)]",
      inactiveTabStyle: "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-red-500/40",
      gradId: "waveGradRed",
      pathPrimary: "M0,48 L40,48 L40,16 L80,16 L80,48 L180,48 L180,16 L220,16 L220,48 L320,48 L320,16 L380,16 L380,48 L480,48 L480,16 L540,16 L540,48 L640,48 L640,16 L680,16 L680,48 L780,48 L780,16 L820,16 L820,48 L920,48 L920,16 L980,16 L980,48 L1080,48 L1080,16 L1120,16 L1120,48 L1200,48",
      pathSecondary: "M0,40 Q150,65 300,40 T600,40 T900,40 T1200,40",
      animClassPrimary: "wavy-signal-path-2",
      animClassSecondary: "wavy-signal-path-1",
      metrics: {
        pin: "GPIO 13 (PWM Alert)",
        frequency: "2.40 kHz Siren Tone",
        reading: "Overfill Alarm: ACTIVE",
        status: "Audible in Browser & Hardware",
      },
      tagline: "Autonomous safety trigger sounding a resonant 2.4kHz acoustic alarm when sensor thresholds are breached.",
    },
    led: {
      id: "led",
      name: "Status LED Indicator with 220Ω Limiter",
      shortLabel: "Status LED Pulse",
      color: "orange",
      textColor: "text-orange-400",
      activeTabStyle: "border-orange-400 bg-orange-500/20 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.45)]",
      inactiveTabStyle: "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-orange-500/40",
      gradId: "waveGradOrange",
      pathPrimary: "M0,55 L80,55 L80,20 L160,20 L160,55 L240,55 L240,20 L320,20 L320,55 L400,55 L400,20 L480,20 L480,55 L560,55 L560,20 L640,20 L640,55 L720,55 L720,20 L800,20 L800,55 L880,55 L880,20 L960,20 L960,55 L1040,55 L1040,20 L1120,20 L1120,55 L1200,55",
      pathSecondary: "M0,40 Q150,18 300,40 T600,40 T900,40 T1200,40",
      animClassPrimary: "wavy-signal-fast",
      animClassSecondary: "wavy-signal-path-1",
      metrics: {
        pin: "GPIO 2 (Anode w/ 220Ω)",
        frequency: "1.0 Hz Heartbeat Blink",
        reading: "Current: 15 mA (Protected)",
        status: "Burnout-Proof AI Wiring",
      },
      tagline: "Square pulse driving visual status LEDs. AI auto-inserts 220Ω resistors to safeguard ESP32 GPIO pins from burnout.",
    },
    telemetry: {
      id: "telemetry",
      name: "WebSerial Live Sensor Telemetry",
      shortLabel: "WebSerial Telemetry",
      color: "amberRed",
      textColor: "text-amber-300",
      activeTabStyle: "border-amber-400 bg-gradient-to-r from-amber-500/25 to-red-500/25 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.45)]",
      inactiveTabStyle: "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-amber-500/40",
      gradId: "waveGradAmberRed",
      pathPrimary: "M0,20 L30,20 L30,55 L50,55 L50,20 L80,20 L80,55 L120,55 L120,20 L160,20 L160,55 L180,55 L180,20 L220,20 L220,55 L250,55 L250,20 L300,20 L300,55 L330,55 L330,20 L380,20 L380,55 L420,55 L420,20 L480,20 L480,55 L520,55 L520,20 L560,20 L560,55 L600,55 L600,20 L650,20 L650,55 L680,55 L680,20 L730,20 L730,55 L770,55 L770,20 L830,20 L830,55 L870,55 L870,20 L920,20 L920,55 L950,55 L950,20 L1000,20 L1000,55 L1040,55 L1040,20 L1100,20 L1100,55 L1140,55 L1140,20 L1200,20",
      pathSecondary: "M0,40 Q150,15 300,40 T600,40 T900,40 T1200,40",
      animClassPrimary: "wavy-signal-fast",
      animClassSecondary: "wavy-clock-track",
      metrics: {
        pin: "USB UART (CP2102/CH340)",
        frequency: "115,200 Baud Direct",
        reading: "JSON Telemetry Stream",
        status: "Driverless Chrome/Edge",
      },
      tagline: "Live bi-directional JSON telemetry frames streamed from physical ESP32 directly into browser dashboard gauges.",
    },
  };

  const hardwareCatalogDetails = {
    "ESP32 DevKit V1": {
      name: "ESP32 DevKit V1 (30-pin & 38-pin)",
      category: "Core Microcontroller",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "Xtensa Dual-Core 32-bit LX6 @ 240MHz",
      voltage: "3.3V Logic (5V MicroUSB Input)",
      wokwiId: "wokwi-esp32-devkit-v1",
      memory: "4MB Flash / 520KB SRAM",
      pinout: [
        { pin: "GPIO 5", role: "Ultrasonic TRIG (Output)" },
        { pin: "GPIO 18", role: "Ultrasonic ECHO (Input Safe)" },
        { pin: "GPIO 13", role: "Piezo Buzzer PWM (LEDC)" },
        { pin: "GPIO 2", role: "Status LED (Anode w/ 220Ω)" },
        { pin: "3V3 / GND", role: "Regulated Power Rails" },
      ],
      features: "Integrated Wi-Fi 802.11 b/g/n, Bluetooth BLE, 16-ch PWM controller, dual DAC, and hardware capacitive touch.",
      codeSnippet: `// ESP32 DevKit V1 Pin Configuration
#define TRIG_PIN 5
#define ECHO_PIN 18
#define BUZZER_PIN 13
#define STATUS_LED 2

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(STATUS_LED, OUTPUT);
}`,
    },
    "ESP32-S3": {
      name: "ESP32-S3 Dual-Core LX7",
      category: "Core Microcontroller",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      chip: "Xtensa LX7 Dual-Core @ 240MHz with AI Vector Ops",
      voltage: "3.3V Logic (Native USB-OTG)",
      wokwiId: "wokwi-esp32-s3-devkitc-1",
      memory: "8MB Octal Flash / 512KB SRAM",
      pinout: [
        { pin: "GPIO 19/20", role: "Native USB D+/D- High-Speed" },
        { pin: "GPIO 1-14", role: "High-Speed SAR ADC1 Channels" },
        { pin: "GPIO 38-42", role: "I2S Audio & WS2812 Matrix" },
      ],
      features: "Hardware vector acceleration instructions for on-device machine learning & edge acoustic wake-word classification.",
      codeSnippet: `// ESP32-S3 Native USB Serial
void setup() {
  USBSerial.begin();
  while(!USBSerial && millis() < 3000);
  USBSerial.println("ESP32-S3 Vector AI Ready");
}`,
    },
    "ESP32-C3": {
      name: "ESP32-C3 RISC-V Microcontroller",
      category: "Core Microcontroller",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "32-bit Single-Core RISC-V @ 160MHz",
      voltage: "3.3V Logic (Ultra-Low Power)",
      wokwiId: "wokwi-esp32-c3-devkitm-1",
      memory: "4MB Flash / 400KB SRAM",
      pinout: [
        { pin: "GPIO 8", role: "Onboard Addressable RGB LED" },
        { pin: "GPIO 2/3", role: "UART0 Programming Bus" },
        { pin: "GPIO 4-7", role: "Low Noise 12-bit SAR ADC" },
      ],
      features: "Open-source RISC-V compute architecture optimized for compact smart home nodes and low-power battery telemetry.",
      codeSnippet: `// ESP32-C3 RISC-V Architecture
void setup() {
  Serial.begin(115200);
  esp_sleep_enable_timer_wakeup(5000000); // 5s deep sleep
}`,
    },
    "Arduino Uno / Nano": {
      name: "Arduino Uno R3 / Nano",
      category: "Core Microcontroller",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      chip: "ATmega328P 8-bit AVR @ 16MHz",
      voltage: "5.0V TTL Logic Level",
      wokwiId: "wokwi-arduino-uno",
      memory: "32KB Flash / 2KB SRAM",
      pinout: [
        { pin: "D0 / D1", role: "Hardware UART RX/TX" },
        { pin: "D9 ~ D11", role: "8-bit Timer PWM Output" },
        { pin: "A0 ~ A5", role: "10-bit ADC Analog In" },
      ],
      features: "Industrial 5V tolerant I/O logic, classic education and embedded prototyping platform.",
      codeSnippet: `void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}`,
    },
    "HC-SR04 Ultrasonic": {
      name: "HC-SR04 Ultrasonic Range Sensor",
      category: "Sensors & Inputs",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      chip: "40kHz Piezo Sonic Transducer Pair",
      voltage: "5.0V VCC (3.3V Echo divider safe)",
      wokwiId: "wokwi-hc-sr04",
      memory: "Range: 2cm to 400cm (±3mm accuracy)",
      pinout: [
        { pin: "VCC", role: "5V Power Supply Rail" },
        { pin: "TRIG", role: "10µs High Trigger Pulse (GPIO 5)" },
        { pin: "ECHO", role: "Echo High Time (GPIO 18 via divider)" },
        { pin: "GND", role: "System Ground" },
      ],
      features: "Sonic echolocation with 3mm precision. Ideal for water storage level monitoring, smart trash bins, and obstacle avoidance.",
      codeSnippet: `digitalWrite(TRIG_PIN, HIGH);
delayMicroseconds(10);
digitalWrite(TRIG_PIN, LOW);
long duration = pulseIn(ECHO_PIN, HIGH);
float distanceCm = duration * 0.034 / 2.0;`,
    },
    "PIR Motion HC-SR501": {
      name: "HC-SR501 Pyroelectric Motion Detector",
      category: "Sensors & Inputs",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "BISS0001 Dual-Element Pyroelectric IC",
      voltage: "4.5V - 12V VCC (3.3V Logic Output)",
      wokwiId: "wokwi-pir-motion-sensor",
      memory: "120° Angle Cone | Up to 7m Range",
      pinout: [
        { pin: "VCC", role: "5V Input Power" },
        { pin: "OUT", role: "Digital HIGH on Intrusion (GPIO 4)" },
        { pin: "GND", role: "Common Ground" },
      ],
      features: "Infrared human body temperature detection with onboard potentiometers for sensitivity and hold-time tuning.",
      codeSnippet: `int motion = digitalRead(PIR_PIN);
if (motion == HIGH) {
  Serial.println("PIR: INTRUSION_DETECTED");
}`,
    },
    "DHT11 / DHT22 Temp": {
      name: "DHT22 / AM2302 Temp & Humidity Sensor",
      category: "Sensors & Inputs",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      chip: "Capacitive Humidity & NTC Thermistor",
      voltage: "3.3V - 5.5V DC Single-Wire Bus",
      wokwiId: "wokwi-dht22",
      memory: "-40°C to 80°C (±0.5°C) | 0-100% RH (±2%)",
      pinout: [
        { pin: "Pin 1 (VCC)", role: "3.3V - 5V Power" },
        { pin: "Pin 2 (DATA)", role: "Bidirectional Single-Wire Bus" },
        { pin: "Pin 4 (GND)", role: "System Ground" },
      ],
      features: "Calibrated 16-bit digital temperature and relative humidity readings with hardware parity check.",
      codeSnippet: `float h = dht.readHumidity();
float t = dht.readTemperature();
Serial.printf("Temp: %.1f C, Hum: %.1f %%\n", t, h);`,
    },
    "Tactile Push Buttons": {
      name: "Tactile Momentary Push Button",
      category: "Sensors & Inputs",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      chip: "Normally Open SPST Microswitch",
      voltage: "0V - 5V DC (Pullup / Pulldown)",
      wokwiId: "wokwi-pushbutton",
      memory: "100,000 Mechanical Click Cycles",
      pinout: [
        { pin: "Pin 1", role: "GPIO Input (with INPUT_PULLUP)" },
        { pin: "Pin 2", role: "Ground (Active Low)" },
      ],
      features: "Snap-action microswitch with automatic AI software debounce timing to eliminate mechanical contact chatter.",
      codeSnippet: `pinMode(BTN_PIN, INPUT_PULLUP);
bool pressed = (digitalRead(BTN_PIN) == LOW);`,
    },
    "LDR Photocell": {
      name: "GL5528 Light Dependent Resistor (LDR)",
      category: "Sensors & Inputs",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "Cadmium Sulfide (CdS) Photoresistor",
      voltage: "0 - 3.3V (with 10kΩ Voltage Divider)",
      wokwiId: "wokwi-photoresistor-sensor",
      memory: "Dark: ~1MΩ | Ambient Light: ~10kΩ",
      pinout: [
        { pin: "Leg 1", role: "3.3V Rail" },
        { pin: "Leg 2 / Center", role: "ESP32 ADC (GPIO 34) & 10k to GND" },
      ],
      features: "Continuous ambient lux sensing for automatic street lighting and day/night state estimation.",
      codeSnippet: `int rawAdc = analogRead(LDR_PIN);
float lux = map(rawAdc, 0, 4095, 1000, 0);`,
    },
    "Active Piezo Buzzer": {
      name: "Active 5V Piezoelectric Buzzer",
      category: "Outputs & Actuators",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      chip: "Integrated 2.4kHz Transistor Oscillator",
      voltage: "3.3V - 5V DC (< 25mA)",
      wokwiId: "wokwi-buzzer",
      memory: "Sound Output: > 85dB at 10cm",
      pinout: [
        { pin: "VCC (+)", role: "Driven by GPIO 13 via LEDC PWM" },
        { pin: "GND (-)", role: "Common Ground Rail" },
      ],
      features: "High-decibel acoustic alert triggered by logic HIGH or frequency-swept tones via ESP32 LEDC PWM.",
      codeSnippet: `ledcAttachPin(BUZZER_PIN, 0);
ledcWriteTone(0, 2400); // 2.4kHz warning chirp
delay(150);
ledcWriteTone(0, 0);`,
    },
    "Diffused LEDs (R/A/G)": {
      name: "Diffused 5mm Status LEDs (Red/Amber/Green)",
      category: "Outputs & Actuators",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      chip: "AlGaInP High-Efficiency Diode",
      voltage: "Forward: 1.8V - 2.2V @ 20mA Max",
      wokwiId: "wokwi-led",
      memory: "Luminosity: 500 mcd Diffused Angle",
      pinout: [
        { pin: "Anode (+)", role: "GPIO Output via 220Ω Limiting Resistor" },
        { pin: "Cathode (-)", role: "Direct Ground Return" },
      ],
      features: "Tricolor status signaling for Standby (Amber), Alert Trigger (Red), and Normal Safe (Green).",
      codeSnippet: `digitalWrite(LED_RED, HIGH);
digitalWrite(LED_GREEN, LOW);`,
    },
    "220Ω & 10kΩ Resistors": {
      name: "Metal Film Current-Limiting Resistors",
      category: "Outputs & Actuators",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "1/4 Watt ±1% Precision Tolerance",
      voltage: "Up to 250V Dielectric Breakdown",
      wokwiId: "wokwi-resistor",
      memory: "Burnout Safe for ESP32 GPIO Pins",
      pinout: [
        { pin: "220Ω", role: "Limits LED forward current to safe 15mA" },
        { pin: "10kΩ", role: "Pullup on button lines & ADC voltage divider" },
      ],
      features: "Automatic AI schematic insertion prevents GPIO overcurrent burnout and floating logic lines.",
      codeSnippet: `// Netlist connection syntax:
["esp:2", "r1:1", "red", []],
["r1:2", "led1:A", "red", []]`,
    },
    "SG90 Micro Servo": {
      name: "TowerPro SG90 9g Micro Servo",
      category: "Outputs & Actuators",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      chip: "Coreless Motor + Nylon Gear Reduction",
      voltage: "4.8V - 6.0V DC (50Hz PWM)",
      wokwiId: "wokwi-servo",
      memory: "180° Sweep Angle | 1.8 kg·cm Torque",
      pinout: [
        { pin: "Orange / PWM", role: "50Hz Pulse Width (500µs - 2400µs)" },
        { pin: "Red / VCC", role: "5V Power Supply" },
        { pin: "Brown / GND", role: "Ground Return" },
      ],
      features: "Proportional angular position control for mechanical valves, automated dampers, and physical gauges.",
      codeSnippet: `#include <ESP32Servo.h>
Servo myServo;
myServo.attach(SERVO_PIN);
myServo.write(90); // 90° center position`,
    },
    "WebSerial CP2102/CH340": {
      name: "WebSerial Direct Browser USB Bridge",
      category: "Communication & Protocols",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "Silicon Labs CP2102 / WCH CH340 USB-UART",
      voltage: "Direct Chromium Navigator Serial API",
      wokwiId: "webserial-native",
      memory: "Baud Rates: 115,200 to 921,600",
      pinout: [
        { pin: "DTR / RTS", role: "Auto-reset ESP32 into ROM bootloader" },
        { pin: "TXD / RXD", role: "Full duplex telemetry streaming" },
      ],
      features: "Driverless browser-to-silicon firmware flashing directly from Chrome/Edge with zero command line dependencies.",
      codeSnippet: `const port = await navigator.serial.requestPort();
await port.open({ baudRate: 115200 });
const writer = port.writable.getWriter();`,
    },
    "115200 Baud Telemetry": {
      name: "High-Speed Real-Time Telemetry Stream",
      category: "Communication & Protocols",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      chip: "ESP32 Hardware UART0 FIFO Buffer",
      voltage: "3.3V Logic Level Serial",
      wokwiId: "telemetry-stream",
      memory: "115,200 Baud | 10Hz JSON Polling",
      pinout: [
        { pin: "Packet Format", role: "JSON formatted key-value telemetry" },
        { pin: "Latency", role: "< 15ms Round-trip Telemetry" },
      ],
      features: "Non-blocking serial streaming emitting structured JSON telemetry packets straight into studio visual charts.",
      codeSnippet: `Serial.printf("{\\"distance\\":%.1f,\\"alert\\":%s}\\n",
  distCm, isAlarm ? "true" : "false");`,
    },
    "Wokwi diagram.json": {
      name: "Wokwi diagram.json Netlist Standard",
      category: "Communication & Protocols",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      chip: "Open Hardware JSON Schematic Standard",
      voltage: "Real-time electrical simulation engine",
      wokwiId: "wokwi-netlist-engine",
      memory: "2D/3D Interactive Browser Breadboard",
      pinout: [
        { pin: "parts", role: "Virtual microcontrollers, sensors & actuators" },
        { pin: "connections", role: "Color-coded point-to-point wire netlist" },
      ],
      features: "Standardized open JSON format allowing instant live 2D/3D breadboard simulation directly inside the browser.",
      codeSnippet: `{
  "version": 1,
  "parts": [{ "type": "wokwi-esp32-devkit-v1", "id": "esp" }],
  "connections": [["esp:5", "sensor:trig", "amber", []]]
}`,
    },
    "Arduino C++ Framework": {
      name: "Hardened Arduino C++ Firmware Engine",
      category: "Communication & Protocols",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      chip: "GCC Xtensa Toolchain with FreeRTOS",
      voltage: "Bare-metal high efficiency execution",
      wokwiId: "arduino-core-esp32",
      memory: "Zero dynamic allocation overhead",
      pinout: [
        { pin: "Core 0", role: "Background Wi-Fi & Bluetooth Stack" },
        { pin: "Core 1", role: "Real-time sensor polling loop & PWM" },
      ],
      features: "Synthesized C++ code with non-blocking millis() timers, hardware watchdog recovery, and strict type safety.",
      codeSnippet: `void loop() {
  unsigned long now = millis();
  if (now - lastTick >= 100) {
    pollSensors();
    lastTick = now;
  }
}`,
    },
  };

  const coveredUniverse = [
    {
      category: "Core Microcontrollers",
      heroMetric: "4 Cores",
      heroSub: "Xtensa & RISC-V",
      subtitle: "Silicon compute cores & flash memory",
      icon: Cpu,
      themeColor: "amber",
      borderColor: "border-amber-500/25 hover:border-amber-400/60",
      accentGlow: "hover:shadow-amber-500/20",
      headerColor: "text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      dotColor: "bg-amber-400",
      gradientAura: "from-amber-500/15 via-transparent to-transparent",
      badgeText: "240 MHz Dual-Core",
      items: [
        { name: "ESP32 DevKit V1", tag: "Flagship", chip: "Xtensa 32-bit", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
        { name: "ESP32-S3", tag: "AI Vector", chip: "Native USB", tagStyle: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
        { name: "ESP32-C3", tag: "RISC-V", chip: "Low-Power", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
        { name: "Arduino Uno / Nano", tag: "Legacy", chip: "ATmega328P", tagStyle: "bg-red-500/10 text-red-300 border-red-500/30" },
      ],
    },
    {
      category: "Sensors & Inputs",
      heroMetric: "5 Sensors",
      heroSub: "Analog & Digital",
      subtitle: "Analog & digital telemetry inputs",
      icon: Activity,
      themeColor: "orange",
      borderColor: "border-orange-500/25 hover:border-orange-400/60",
      accentGlow: "hover:shadow-orange-500/20",
      headerColor: "text-orange-400",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      dotColor: "bg-orange-400",
      gradientAura: "from-orange-500/15 via-transparent to-transparent",
      badgeText: "Real-Time Polling",
      items: [
        { name: "HC-SR04 Ultrasonic", tag: "Echo Ping", chip: "2cm - 400cm", tagStyle: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
        { name: "PIR Motion HC-SR501", tag: "Infrared", chip: "120° Angle", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
        { name: "DHT11 / DHT22 Temp", tag: "Digital Bus", chip: "±0.5°C Acc", tagStyle: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
        { name: "Tactile Push Buttons", tag: "Debounced", chip: "Input Pullup", tagStyle: "bg-red-500/10 text-red-300 border-red-500/30" },
        { name: "LDR Photocell", tag: "ADC Sensor", chip: "Lux Sensing", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
      ],
    },
    {
      category: "Outputs & Actuators",
      heroMetric: "4 Drivers",
      heroSub: "PWM & Acoustic",
      subtitle: "PWM audio, servos & LED illumination",
      icon: Zap,
      themeColor: "red",
      borderColor: "border-red-500/25 hover:border-red-400/60",
      accentGlow: "hover:shadow-red-500/20",
      headerColor: "text-red-400",
      badgeColor: "bg-red-500/10 text-red-300 border-red-500/30",
      dotColor: "bg-red-500",
      gradientAura: "from-red-500/15 via-transparent to-transparent",
      badgeText: "Current Protected",
      items: [
        { name: "Active Piezo Buzzer", tag: "Audio Tone", chip: "2.4 kHz PWM", tagStyle: "bg-red-500/10 text-red-300 border-red-500/30" },
        { name: "Diffused LEDs (R/A/G)", tag: "Visual Alert", chip: "20mA Limit", tagStyle: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
        { name: "220Ω & 10kΩ Resistors", tag: "Limiter", chip: "Burnout Safe", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
        { name: "SG90 Micro Servo", tag: "180° Angle", chip: "PWM Timed", tagStyle: "bg-red-500/10 text-red-300 border-red-500/30" },
      ],
    },
    {
      category: "Communication & Protocols",
      heroMetric: "4 Bridges",
      heroSub: "WebSerial & Wokwi",
      subtitle: "WebSerial, Wokwi & telemetry",
      icon: Radio,
      themeColor: "amber-red",
      borderColor: "border-amber-500/25 hover:border-red-400/60",
      accentGlow: "hover:shadow-amber-500/20",
      headerColor: "text-amber-300",
      badgeColor: "bg-gradient-to-r from-amber-500/15 to-red-500/15 text-amber-200 border-amber-500/30",
      dotColor: "bg-amber-400",
      gradientAura: "from-red-600/15 via-amber-500/10 to-transparent",
      badgeText: "115.2k Baud Direct",
      items: [
        { name: "WebSerial CP2102/CH340", tag: "Driverless", chip: "Chrome Native", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
        { name: "115200 Baud Telemetry", tag: "Real-Time", chip: "Continuous", tagStyle: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
        { name: "Wokwi diagram.json", tag: "Netlist Spec", chip: "3D Visuals", tagStyle: "bg-red-500/10 text-red-300 border-red-500/30" },
        { name: "Arduino C++ Framework", tag: "Optimized", chip: "Zero-Latency", tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
      ],
    },
  ];

  const liveMetrics = [
    {
      label: "Wokwi Pin Accuracy",
      display: "100%",
      sub: "Auto Netlist Validation",
      tag: "Verified",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      detail: "Exact diagram.json wiring specs preventing pin conflicts and short circuits.",
    },
    {
      label: "WebSerial Flashing Speed",
      display: "115.2k",
      sub: "Baud Direct Protocol",
      tag: "Native API",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      detail: "Direct browser-to-silicon bootloader flashing with zero external driver installs.",
    },
    {
      label: "AI Self-Healing Latency",
      display: "<1.2s",
      sub: "Closed-Loop Patching",
      tag: "Autonomous",
      tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
      detail: "Catches hardware compile warnings & runtime faults to auto-apply source patches.",
    },
    {
      label: "Telemetry Pipeline",
      display: "Real-Time",
      sub: "Continuous Serial Stream",
      tag: "Streaming",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      detail: "Instant visual gauges and logging charts for connected sensors and alerts.",
    },
  ];

  const pipelineStages = [
    {
      num: "01",
      title: "Natural Language to Netlist",
      desc: "Specify requirements in plain text. The AI resolves hardware pins, adds protective 220Ω current limiters, and builds a strict electrical netlist.",
      icon: CircuitBoard,
      badge: "Schematic Engine",
      previewType: "netlist",
      highlights: [
        "Resolves GPIO pin assignments without electrical collisions",
        "Inserts 220Ω current-limiting resistors on all LED anodes",
        "Exports strict Wokwi diagram.json connection netlist",
      ],
      terminalLines: [
        "[AI Netlist] Synthesizing: 'Ultrasonic water level with buzzer'",
        "[PinAllocator] Trig -> GPIO5, Echo -> GPIO18 (Input Safe)",
        "[SafetyRule] 220Ω Limiter inserted between GPIO2 & LED+",
        "[Netlist] JSON schematic topology compiled with 0 errors",
      ],
    },
    {
      num: "02",
      title: "Wokwi Browser Simulator",
      desc: "Instant live interactive simulation powered by Wokwi's open diagram.json standard with virtual LEDs, sensors, and buzzers.",
      icon: Layers,
      badge: "Simulation",
      previewType: "simulation",
      highlights: [
        "Zero-install virtual breadboard environment in browser",
        "Real-time ultrasonic ping distance wave simulation",
        "Live interactive LEDs, push buttons, and buzzer audio",
      ],
      simulationData: {
        device: "ESP32 DevKit V1",
        status: "Running Simulation (240MHz)",
        frequency: "40 kHz Sonic Ping Wave",
        distance: "14.2 cm (Trigger Threshold)",
        alert: "BUZZER_ACTIVE (2.4 kHz)",
      },
    },
    {
      num: "03",
      title: "Hardened Arduino C++ Code",
      desc: "Generates clean, production-ready sketches with explicit pin definitions, non-blocking timers, and formatted serial telemetry output.",
      icon: Code2,
      badge: "Firmware",
      previewType: "code",
      highlights: [
        "Non-blocking millis() timing architecture without delay()",
        "Explicit macros for pin declarations and trigger thresholds",
        "Structured JSON serial telemetry emitted at 115,200 baud",
      ],
      codeSnippet: `// Auto-Synthesized by Blinky AI Studio
#define TRIG_PIN 5
#define ECHO_PIN 18
#define BUZZER_PIN 4

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  long d = readDistanceCM();
  Serial.printf("{\\"dist\\":%ld,\\"lvl\\":\\"WARN\\"}\\n", d);
}`,
    },
    {
      num: "04",
      title: "WebSerial ESP32 Hardware Flashing",
      desc: "Connect your real ESP32 DevKit over USB and flash right inside Google Chrome without downloading Arduino IDE or toolchains.",
      icon: Cpu,
      badge: "Hardware Flasher",
      previewType: "flasher",
      highlights: [
        "Native Google Chrome WebSerial API integration",
        "Direct USB bootloader handshake at 115,200 baud",
        "Zero external driver or compiler toolchain installation",
      ],
      flashLogs: [
        "Connected to ESP32 on WebSerial port COM3",
        "Chip is ESP32-D0WDQ6 (revision v1.0, 240MHz Xtensa)",
        "Erasing flash sector (0x10000)... OK (0.42s)",
        "Writing firmware at 115.2k baud... 100% [142 kB]",
        "Hash of data verified. Booting firmware!",
      ],
    },
    {
      num: "05",
      title: "AI Self-Healing Feedback Loop",
      desc: "Detects runtime anomalies, baud rate mismatches, or missing pin declarations, and autonomously rewrites and repairs the sketch.",
      icon: Bot,
      badge: "Self-Healing",
      previewType: "selfhealing",
      highlights: [
        "Closed-loop runtime serial log and exception analyzer",
        "Autonomously patches floating pins with INPUT_PULLUP",
        "Instantly recompiles and re-flashes with zero human intervention",
      ],
      diffLines: [
        { type: "error", text: "RUNTIME EXCEPTION: GPIO13 floating state detected" },
        { type: "del", text: "- pinMode(13, INPUT); // Floating voltage instability" },
        { type: "add", text: "+ pinMode(13, INPUT_PULLUP); // Auto-repaired by Blinky" },
        { type: "success", text: "Sketch patched & recompiled in 840ms. Status: CLEAN" },
      ],
    },
    {
      num: "06",
      title: "Live Hardware Telemetry Stream",
      desc: "Streams sensor readings, threshold triggers, and hardware heartbeat telemetry in a sleek dark glassmorphism dashboard.",
      icon: Radio,
      badge: "Telemetry",
      previewType: "telemetry",
      highlights: [
        "115,200 Baud real-time continuous data streaming",
        "Dynamic sensor gauge with color-coded threshold triggers",
        "Hardware health heartbeat and packet latency indicators",
      ],
      telemetryMeters: [
        { label: "Water Level", val: "76.4%", state: "Warning", color: "text-amber-400" },
        { label: "Sonic Distance", val: "11.8 cm", state: "Optimal", color: "text-amber-300" },
        { label: "Alarm Tone", val: "2,400 Hz", state: "Active", color: "text-red-400" },
        { label: "Serial Rate", val: "115.2 kbps", state: "Locked", color: "text-orange-400" },
      ],
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying || isPausedOnHover) return;

    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % pipelineStages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isPausedOnHover, pipelineStages.length]);

  const handleNextStage = () => {
    setActiveStage((prev) => (prev + 1) % pipelineStages.length);
  };

  const handlePrevStage = () => {
    setActiveStage((prev) => (prev - 1 + pipelineStages.length) % pipelineStages.length);
  };

  return (
    <div className="min-h-screen w-full bg-[#08070a] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] bg-gradient-to-b from-amber-500/15 via-red-600/10 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] right-[-10%] w-[800px] h-[700px] bg-gradient-to-bl from-orange-600/10 via-amber-600/5 to-transparent blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-[65%] left-[-10%] w-[700px] h-[600px] bg-gradient-to-tr from-amber-600/10 via-red-600/5 to-transparent blur-[180px] pointer-events-none -z-10" />

      {/* Massive Background Watermark (thwip-style) */}
      <div className="absolute top-[-2%] left-0 w-full flex justify-center -z-10 pointer-events-none select-none opacity-[0.03]">
        <h1 className="text-[26vw] font-black tracking-tighter leading-none m-0 p-0 text-white">
          BLINKY
        </h1>
      </div>

      {/* Top Header Navigation - Full Width */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#08070a]/85 backdrop-blur-xl">
        <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 shadow-md shadow-amber-500/20">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">BLINKY</span>
              <Badge variant="amber" className="text-[10px] px-2 py-0 border-amber-500/30">
                v2.0 AI
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <a href="#workbench" className="hover:text-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">Workbench</a>
            <a href="#audit" className="hover:text-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">Verification</a>
            <a href="#pipeline" className="hover:text-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">5-Stage Loop</a>
            <a href="#metrics" className="hover:text-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">Telemetry</a>
            <a href="#universe" className="hover:text-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">Hardware Matrix</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 border border-white/10 px-3 py-1 rounded-full bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>ESP32 Silicon Engine • WebSerial Ready</span>
            </span>

            <Button
              onClick={onLaunchStudio}
              variant="default"
              size="sm"
              className="gap-1.5 font-semibold text-xs px-4"
            >
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content - Full Width Expansive Layout */}
      <main className="flex-1 w-full">
        {/* EXPANSIVE HERO SECTION (Full Screen 2-Column Grid on Desktop) */}
        <section className="relative pt-10 sm:pt-14 pb-16 px-6 sm:px-10 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            {/* Left Column: Bold Typography & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
              {/* Eyebrow Pill */}
              <div className="interactive-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium mb-6 backdrop-blur-md shadow-xs shadow-amber-500/20 cursor-pointer">
                <Sparkles size={13} className="text-amber-400" />
                <span>Autonomous Agentic IoT &amp; Embedded Engineering</span>
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-zinc-400 font-mono">ESP32 DevKit V1</span>
              </div>

              {/* Interactive 3D 360-Degree Rotatable Headline */}
              <Interactive3DHeadline />

              {/* Thesis Statement */}
              <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-3xl xl:max-w-4xl font-normal leading-relaxed mb-8">
                We don’t just write code. We synthesize <span className="text-white underline decoration-amber-500 decoration-2 underline-offset-4">exact electrical netlists</span>, simulate live in Wokwi, flash physical ESP32 boards via WebSerial, and <span className="text-white">self-heal runtime bugs</span> in a closed AI feedback loop.
              </p>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button
                  onClick={onLaunchStudio}
                  variant="default"
                  size="lg"
                  className="h-14 sm:h-16 px-8 sm:px-10 text-base font-bold rounded-full shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 gap-2.5"
                >
                  <span>Start Hardware Studio</span>
                  <ArrowRight size={18} />
                </Button>

                <Button
                  onClick={() => onSelectPreset("flagship")}
                  variant="outline"
                  size="lg"
                  className="h-14 sm:h-16 px-7 rounded-full border-white/10 hover:border-amber-500/40 text-zinc-300 hover:text-white gap-2 font-medium"
                >
                  <Play size={15} className="text-amber-400 fill-amber-400" />
                  <span>Explore Water Level Alarm</span>
                </Button>
              </div>

              {/* Hardware Spec Badges Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-400">
                <span className="interactive-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:text-zinc-200">
                  <Activity size={12} className="text-amber-400" />
                  115,200 Baud WebSerial
                </span>
                <span className="interactive-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:text-zinc-200">
                  <CircuitBoard size={12} className="text-amber-400" />
                  Wokwi diagram.json Spec
                </span>
                <span className="interactive-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:text-zinc-200">
                  <Bot size={12} className="text-red-400" />
                  Autonomous AI Self-Healing
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Prompt Workbench Card */}
            <div id="workbench" className="lg:col-span-5 w-full relative">
              {/* Subtle Ground Shadow for gentle floating effect */}
              <div className="absolute -bottom-3 left-6 right-6 h-7 bg-amber-500/15 rounded-[100%] blur-xl pointer-events-none workbench-float-shadow -z-10" />

              <div className="interactive-box workbench-subtle-float w-full text-left bg-zinc-950/85 border border-white/15 rounded-2xl p-6 shadow-2xl shadow-black/90 backdrop-blur-2xl focus-within:ring-2 focus-within:ring-amber-500/40 transition-all relative">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-orange-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 ml-2">
                      <Terminal size={12} className="text-amber-400" />
                      blinky-synthesizer.sys
                    </span>
                  </div>
                  <Badge variant="amber" className="text-[10px] py-0 px-2">
                    Active
                  </Badge>
                </div>

                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                      Describe your circuit or IoT system in natural language:
                    </label>
                    <textarea
                      value={heroPrompt}
                      onChange={(e) => setHeroPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Build an ultrasonic water level alarm with buzzer tone frequency and visual warning LED on GPIO2..."
                      className="w-full min-h-[110px] resize-none rounded-xl border border-white/10 bg-zinc-900/60 p-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">Enter ↵</kbd></span>
                    </span>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      variant="default"
                      size="sm"
                      className="rounded-xl px-5 gap-2 font-semibold text-xs h-9 shadow-md shadow-amber-500/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Activity size={14} className="animate-spin" />
                          Synthesizing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Synthesize Hardware
                          <ArrowRight size={14} />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Example Blueprint Seeds */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                    Curated Hardware Blueprints:
                  </p>
                  <div className="flex flex-col gap-2">
                    {examplePrompts.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (item.presetKey) {
                            onSelectPreset(item.presetKey);
                          } else {
                            setHeroPrompt(item.title);
                          }
                        }}
                        className="interactive-box text-xs p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-amber-500/[0.08] hover:border-amber-500/40 text-zinc-300 hover:text-white transition-all text-left cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-amber-400 border border-amber-500/20 shrink-0 group-hover:border-amber-500/40 group-hover:bg-amber-500/20 transition-colors">
                            {item.category}
                          </span>
                          <span className="truncate">“{item.title}”</span>
                        </div>
                        <ArrowRight size={13} className="text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 shrink-0 transition-all ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FULL WIDTH: AUTONOMOUS HARDWARE VERIFICATION ENGINE */}
        <section id="audit" className="py-20 px-6 sm:px-10 lg:px-16 w-full border-t border-white/[0.06]">
          {/* Centered Large Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Pre-Flight Silicon Diagnostics</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-zinc-400 font-mono">Zero Burnout Assurance</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Autonomous Hardware Verification Engine
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Pre-flight silicon diagnostics and safety netlists evaluated on every run to eliminate electrical burnout.
            </p>
          </div>

          {/* 4 Telemetry-Styled Verification Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Verified Safe Connections (Amber) */}
            <div className="interactive-card-amber p-6 sm:p-7 rounded-2xl border border-amber-500/25 bg-zinc-950/70 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-amber-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
                    <CheckCircle2 size={14} className="text-amber-400" />
                    Safe Circuit Netlist
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-medium text-amber-400 bg-amber-500/10 border-amber-500/30 group-hover:scale-105 transition-transform">
                    Zero Burnout
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-amber-400 group-hover:scale-105 origin-left transition-all">
                    100%
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Safety Margin</span>
                </div>
                <div className="text-xs font-bold text-amber-300/90 mb-3">
                  Verified Safe Connections
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside pt-3.5 border-t border-white/10 leading-relaxed">
                  <li>220Ω limiters inserted between GPIO &amp; LED anodes</li>
                  <li>Common ground bus routed from all components to GND</li>
                  <li>Wokwi diagram.json with zero pin overlap</li>
                </ul>
              </div>
              <div className="pt-4 mt-5 border-t border-amber-500/20 text-[11px] text-amber-300 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1">✓ Safety Passed</span>
                <span className="text-[10px] text-zinc-500">0 Short-Circuits</span>
              </div>
            </div>

            {/* Card 2: Caught by Self-Healing Loop (Crimson Red) */}
            <div className="interactive-card-red p-6 sm:p-7 rounded-2xl border border-red-500/25 bg-zinc-950/70 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-red-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 group-hover:text-red-300 transition-colors">
                    <AlertCircle size={14} className="text-red-400" />
                    Closed-Loop Patch
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-medium text-red-400 bg-red-500/10 border-red-500/30 group-hover:scale-105 transition-transform">
                    Auto-Patched
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-red-400 group-hover:scale-105 origin-left transition-all">
                    &lt; 1.2s
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Heal Latency</span>
                </div>
                <div className="text-xs font-bold text-red-300/90 mb-3">
                  Caught by Self-Healing Loop
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside pt-3.5 border-t border-white/10 leading-relaxed">
                  <li>Floating GPIO pin detected; auto-injected <code className="text-red-300 font-mono">INPUT_PULLUP</code></li>
                  <li>Baud rate mismatch corrected from 9600 to 115200</li>
                  <li>Over-current protection auto-diverted to 5V VIN</li>
                </ul>
              </div>
              <div className="pt-4 mt-5 border-t border-red-500/20 text-[11px] text-red-300 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1">⚡ Real-time Patch</span>
                <span className="text-[10px] text-zinc-500">Autonomous</span>
              </div>
            </div>

            {/* Card 3: Hardware Checks (Flame Orange) */}
            <div className="interactive-card-orange p-6 sm:p-7 rounded-2xl border border-orange-500/25 bg-zinc-950/70 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-orange-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 group-hover:text-orange-300 transition-colors">
                    <HelpCircle size={14} className="text-orange-400" />
                    Silicon Parity Check
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-medium text-orange-400 bg-orange-500/10 border-orange-500/30 group-hover:scale-105 transition-transform">
                    Target Verified
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-orange-400 group-hover:scale-105 origin-left transition-all">
                    ESP32
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">DevKit V1</span>
                </div>
                <div className="text-xs font-bold text-orange-300/90 mb-3">
                  Hardware Checks
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside pt-3.5 border-t border-white/10 leading-relaxed">
                  <li>Silicon identity verified: Espressif ESP32-D0WDQ6</li>
                  <li>Chrome WebSerial API capability detected in session</li>
                  <li>Arduino toolchain parity: Core v3.0.x compiled clean</li>
                </ul>
              </div>
              <div className="pt-4 mt-5 border-t border-orange-500/20 text-[11px] text-orange-300 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1">✓ Target Verified</span>
                <span className="text-[10px] text-zinc-500">Xtensa LX6</span>
              </div>
            </div>

            {/* Card 4: Recommended Next Actions (Amber-Red Telemetry Style) */}
            <div className="interactive-card-amber p-6 sm:p-7 rounded-2xl border border-amber-500/25 bg-zinc-950/70 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-amber-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
                    <Lightbulb size={14} className="text-amber-400" />
                    Hardware Flash Pipeline
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-medium text-amber-400 bg-amber-500/10 border-amber-500/30 group-hover:scale-105 transition-transform">
                    Flash Ready
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-amber-400 group-hover:scale-105 origin-left transition-all">
                    1-Click
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Silicon Upload</span>
                </div>
                <div className="text-xs font-bold text-amber-300/90 mb-3">
                  Recommended Next Actions
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside pt-3.5 border-t border-white/10 leading-relaxed">
                  <li>Connect physical board via USB to run real-time flash</li>
                  <li>Open Wokwi simulator to observe live acoustic ping wave</li>
                  <li>View live distance telemetry graph on dashboard stage 5</li>
                </ul>
              </div>
              <div className="pt-4 mt-5 border-t border-amber-500/20 text-[11px] text-amber-300 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1">➔ Ready to Flash</span>
                <span className="text-[10px] text-zinc-500">WebSerial API</span>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & BENCHMARK GRID (Full Width) */}
        <section id="metrics" className="py-20 px-6 sm:px-10 lg:px-16 w-full border-t border-white/[0.06]">
          {/* Centered Large Section Header with Generous Gap */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <Badge variant="amber" className="mb-3.5 px-3.5 py-1 text-xs font-semibold">Real-World Performance</Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Telemetry That Speaks
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              From netlist generation to silicon flashing, every phase of the pipeline is tracked and verified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveMetrics.map((m, i) => (
              <div
                key={i}
                className="interactive-card p-6 sm:p-7 rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{m.label}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-medium group-hover:scale-105 transition-transform ${m.tagColor}`}>
                      {m.tag}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-amber-400 group-hover:scale-105 origin-left transition-all">
                      {m.display}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono group-hover:text-zinc-400 transition-colors">{m.sub}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-3.5 border-t border-white/10 mt-3 group-hover:text-zinc-300 transition-colors">
                    {m.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE 5-STAGE AGENTIC PIPELINE — SEQUENTIAL DYNAMIC TRANSITION SHOWCASE */}
        <section id="pipeline" className="py-20 px-6 sm:px-10 lg:px-16 w-full border-t border-white/[0.06]">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>Closed-Loop AI Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              The 5-Stage Autonomous Loop
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Watch each synthesis phase transition step-by-step in real time — from natural language prompt to physical silicon telemetry.
            </p>
          </div>

          {/* Stepper Timeline Navigation (Clickable Tabs with Progress Line) */}
          <div className="w-full max-w-6xl xl:max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
              {pipelineStages.map((stage, idx) => {
                const isActive = activeStage === idx;
                const Icon = stage.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className={`relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer overflow-hidden group ${
                      isActive
                        ? "bg-amber-500/15 border border-amber-500/50 text-white shadow-lg shadow-amber-500/15 scale-[1.02]"
                        : "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full justify-between">
                      <span className={`font-mono text-[10px] font-bold ${isActive ? "text-amber-400" : "text-zinc-500"}`}>
                        {stage.num}
                      </span>
                      <Icon
                        size={14}
                        className={`transition-transform duration-300 ${
                          isActive
                            ? "text-amber-400 scale-110"
                            : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold truncate w-full text-left">
                      {stage.badge}
                    </span>

                    {/* Active Progress Bar Underneath */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 w-full overflow-hidden">
                        <div
                          key={`progress-${activeStage}-${isPausedOnHover || !isAutoPlaying ? "paused" : "running"}`}
                          className={`h-full bg-white/40 ${isAutoPlaying && !isPausedOnHover ? "stage-progress-bar" : "w-full"}`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Sequential Stage Showcase Card (At the exact same place with dynamic transition) */}
          <div
            className="w-full max-w-6xl xl:max-w-7xl mx-auto"
            onMouseEnter={() => setIsPausedOnHover(true)}
            onMouseLeave={() => setIsPausedOnHover(false)}
          >
            <div
              key={activeStage}
              className="stage-transition-enter rounded-3xl border border-white/15 bg-zinc-950/90 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden relative"
            >
              {/* Top Card Ambient Gradient Halo */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none -z-10" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 blur-[100px] pointer-events-none -z-10" />

              {/* Card Header & Controls Bar */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/10 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    STAGE {pipelineStages[activeStage].num} / 06
                  </span>
                  <span className="hidden sm:inline-block text-xs font-medium text-zinc-400">
                    {pipelineStages[activeStage].badge}
                  </span>
                </div>

                {/* Transition & Playback Controls */}
                <div className="flex items-center gap-2">
                  {/* Auto Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
                    title={isAutoPlaying ? "Pause auto-advancing" : "Resume auto-advancing"}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause size={12} className="text-amber-400" />
                        <span className="hidden sm:inline">Auto-Cycle</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} className="text-amber-400 fill-amber-400" />
                        <span className="hidden sm:inline">Paused</span>
                      </>
                    )}
                  </button>

                  {/* Previous Stage Button */}
                  <button
                    type="button"
                    onClick={handlePrevStage}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                    title="Previous Stage"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Next Stage Button */}
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                    title="Next Stage"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body: 2-Column Responsive Layout */}
              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Side: Stage Information & Highlights */}
                <div className="lg:col-span-6 flex flex-col items-start text-left">
                  {/* Stage Icon */}
                  {(() => {
                    const CurrentIcon = pipelineStages[activeStage].icon;
                    return (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-amber-500/10">
                        <CurrentIcon size={28} />
                      </div>
                    );
                  })()}

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                    {pipelineStages[activeStage].title}
                  </h3>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
                    {pipelineStages[activeStage].desc}
                  </p>

                  {/* Stage Feature Highlights */}
                  <div className="space-y-2.5 mb-8 w-full">
                    {pipelineStages[activeStage].highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Check size={11} />
                        </div>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={onLaunchStudio}
                    variant="default"
                    size="default"
                    className="gap-2 font-bold text-xs sm:text-sm rounded-xl px-6 h-11 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Launch Studio with this Flow</span>
                    <ArrowRight size={15} />
                  </Button>
                </div>

                {/* Right Side: Dynamic Interactive Preview Terminal / Canvas */}
                <div className="lg:col-span-6 w-full">
                  <div className="w-full rounded-2xl border border-white/10 bg-[#0c0a10] p-4 sm:p-5 shadow-xl font-mono text-xs overflow-hidden">
                    {/* Terminal / Preview Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500/70" />
                        <span className="text-[11px] text-zinc-400 ml-1.5">
                          preview_{pipelineStages[activeStage].badge.toLowerCase().replace(/\s+/g, '_')}.io
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Live Stream
                      </span>
                    </div>

                    {/* Preview Type Rendering */}
                    {pipelineStages[activeStage].previewType === "netlist" && (
                      <div className="space-y-2 text-zinc-300">
                        {pipelineStages[activeStage].terminalLines.map((line, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-zinc-600 select-none">0{idx + 1}</span>
                            <span className={idx === 1 ? "text-amber-400" : idx === 2 ? "text-red-400" : "text-zinc-300"}>
                              {line}
                            </span>
                          </div>
                        ))}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Netlist validated: 0 short-circuit risks
                          </span>
                        </div>
                      </div>
                    )}

                    {pipelineStages[activeStage].previewType === "simulation" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between">
                          <span className="text-zinc-400">Target Device:</span>
                          <span className="text-amber-400 font-bold">{pipelineStages[activeStage].simulationData.device}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between">
                          <span className="text-zinc-400">Clock & State:</span>
                          <span className="text-amber-400">{pipelineStages[activeStage].simulationData.status}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between">
                          <span className="text-zinc-400">Sonic Wave Ping:</span>
                          <span className="text-orange-400">{pipelineStages[activeStage].simulationData.frequency}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                          <span className="text-amber-300">Measured Distance:</span>
                          <span className="text-amber-300 font-bold">{pipelineStages[activeStage].simulationData.distance}</span>
                        </div>
                      </div>
                    )}

                    {pipelineStages[activeStage].previewType === "code" && (
                      <pre className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                        <code>{pipelineStages[activeStage].codeSnippet}</code>
                      </pre>
                    )}

                    {pipelineStages[activeStage].previewType === "flasher" && (
                      <div className="space-y-2 text-zinc-300">
                        {pipelineStages[activeStage].flashLogs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500/80 select-none">❯</span>
                            <span className={idx === 3 ? "text-amber-400 font-bold" : "text-zinc-300"}>
                              {log}
                            </span>
                          </div>
                        ))}
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-500 to-red-500 h-1.5 rounded-full w-full" />
                        </div>
                      </div>
                    )}

                    {pipelineStages[activeStage].previewType === "selfhealing" && (
                      <div className="space-y-2">
                        {pipelineStages[activeStage].diffLines.map((diff, idx) => {
                          let color = "text-zinc-300";
                          let bg = "bg-transparent";
                          if (diff.type === "error") {
                            color = "text-red-400";
                            bg = "bg-red-500/10 px-2 py-1 rounded";
                          } else if (diff.type === "del") {
                            color = "text-red-300/80 line-through";
                            bg = "bg-red-950/30 px-2 py-1 rounded";
                          } else if (diff.type === "add") {
                            color = "text-amber-400 font-bold";
                            bg = "bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30";
                          } else if (diff.type === "success") {
                            color = "text-amber-400";
                            bg = "bg-amber-500/10 px-2 py-1 rounded";
                          }
                          return (
                            <div key={idx} className={`${bg} ${color} text-[11px]`}>
                              {diff.text}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {pipelineStages[activeStage].previewType === "telemetry" && (
                      <div className="grid grid-cols-2 gap-2.5">
                        {pipelineStages[activeStage].telemetryMeters.map((meter, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col justify-between">
                            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">{meter.label}</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <span className={`text-base font-extrabold ${meter.color}`}>{meter.val}</span>
                              <span className="text-[10px] text-zinc-400">{meter.state}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Dots Bar at bottom */}
              <div className="px-6 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  {isPausedOnHover ? "Paused on hover" : isAutoPlaying ? "Auto-advancing every 4.5s" : "Auto-cycle paused"}
                </span>

                <div className="flex items-center gap-1.5">
                  {pipelineStages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveStage(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeStage === dotIdx
                          ? "w-6 bg-amber-400"
                          : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                      }`}
                      title={`Go to stage ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COVERED HARDWARE UNIVERSE MATRIX (Vibrant with Interactive Oscilloscope, Wavy Lines & Pop-Up Chips) */}
        <section id="universe" className="py-20 px-6 sm:px-10 lg:px-16 w-full border-t border-white/[0.06] relative overflow-hidden">
          {/* Ambient Glowing Circuit Background Traces */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
            <svg viewBox="0 0 1600 600" fill="none" className="w-full h-full wavy-ambient-backdrop" preserveAspectRatio="none">
              <path d="M-100,100 C300,50 500,250 900,180 C1300,110 1500,300 1800,220" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="6 8" />
              <path d="M-100,300 C400,380 700,180 1100,260 C1400,320 1600,150 1800,200" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" strokeDasharray="8 6" />
              <path d="M-100,500 C350,420 650,550 1000,480 C1350,410 1550,530 1800,460" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1.5" strokeDasharray="5 7" />
            </svg>
          </div>

          {/* Section Header (Centered Large Style with Generous Gap) */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3.5 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Waves size={14} className="text-amber-400 animate-pulse" />
              <span>Silicon &amp; Sensor Ecosystem</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-zinc-400 font-mono">17 Supported Modules</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Supported Silicon &amp; Sensor Universe
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Every component is verified for pin definitions, current draw, and Wokwi simulation models. Click any module chip to pop up its exact electrical pinout and code specs.
            </p>
          </div>

          {/* INTERACTIVE OSCILLOSCOPE & WAVY SIGNAL SYNTHESIZER */}
          <div className="w-full mb-10 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/85 backdrop-blur-2xl relative overflow-hidden shadow-2xl group focus-within:ring-1 focus-within:ring-amber-500/40">
            {/* Ambient Dynamic Background Radial Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-40 bg-red-500/15 blur-[90px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-amber-500/20 blur-[90px] pointer-events-none -z-10" />

            {/* Top Toolbar: Signal Mode Switcher Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <Activity size={14} className="text-amber-400" />
                  Live Hardware Pin Waveforms (Wokwi &amp; WebSerial)
                </span>
                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline-block">
                  • Click any signal to switch active probe
                </span>
              </div>

              {/* Mode Selection Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {Object.values(waveSignalModes).map((mode) => {
                  const isActive = activeSignalMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setActiveSignalMode(mode.id)}
                      className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isActive ? mode.activeTabStyle : mode.inactiveTabStyle
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-zinc-600"}`} />
                      <span>{mode.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Glowing Wavy Oscilloscope Visualizer Box */}
            <div className="relative w-full h-24 sm:h-28 rounded-xl bg-black/60 border border-white/10 p-2 overflow-hidden flex items-center shadow-inner">
              {/* Grid Background Lines (Oscilloscope Division Grid) */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
                  backgroundSize: "40px 20px",
                }}
              />

              {/* Voltage Reference Scale Marks */}
              <div className="absolute left-2.5 top-2 bottom-2 flex flex-col justify-between text-[9px] font-mono text-zinc-500 pointer-events-none select-none z-10">
                <span>+3.3V</span>
                <span>0.0V</span>
                <span>-3.3V</span>
              </div>

              {/* SVG Waveforms with Active Mode Geometry */}
              <svg
                viewBox="0 0 1200 80"
                preserveAspectRatio="none"
                className="w-full h-full relative z-0"
              >
                <defs>
                  <linearGradient id="waveGradAmber" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="waveGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="waveGradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="waveGradAmberRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="waveGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background Clock Baseline Guide */}
                <path
                  d="M0,40 L1200,40"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Animated Primary Signal Path */}
                <path
                  d={waveSignalModes[activeSignalMode].pathPrimary}
                  fill="none"
                  stroke={`url(#${waveSignalModes[activeSignalMode].gradId})`}
                  strokeWidth="2.8"
                  filter="url(#waveGlowEffect)"
                  className={waveSignalModes[activeSignalMode].animClassPrimary}
                />

                {/* Animated Harmonic Secondary Path */}
                <path
                  d={waveSignalModes[activeSignalMode].pathSecondary}
                  fill="none"
                  stroke={`url(#${waveSignalModes[activeSignalMode].gradId})`}
                  strokeWidth="1.6"
                  strokeOpacity="0.6"
                  filter="url(#waveGlowEffect)"
                  className={waveSignalModes[activeSignalMode].animClassSecondary}
                />
              </svg>
            </div>

            {/* Bottom Real-time Signal Readouts */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <p className="text-zinc-400 text-[11px] max-w-xl">
                <span className={`font-semibold ${waveSignalModes[activeSignalMode].textColor}`}>
                  {waveSignalModes[activeSignalMode].name}:
                </span>{" "}
                {waveSignalModes[activeSignalMode].tagline}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px]">
                  PIN: <strong className="text-white">{waveSignalModes[activeSignalMode].metrics.pin}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px]">
                  SIGNAL: <strong className={waveSignalModes[activeSignalMode].textColor}>{waveSignalModes[activeSignalMode].metrics.frequency}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px]">
                  READING: <strong className="text-white">{waveSignalModes[activeSignalMode].metrics.reading}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px]">
                  SIMULATOR: <strong className={waveSignalModes[activeSignalMode].textColor}>{waveSignalModes[activeSignalMode].metrics.status}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4 THEMED HARDWARE UNIVERSE COLUMNS (Telemetry Box Design) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {coveredUniverse.map((cat, idx) => {
              const CategoryIcon = cat.icon;
              return (
                <div
                  key={idx}
                  className={`interactive-card p-6 sm:p-7 rounded-2xl border ${cat.borderColor} bg-zinc-950/70 backdrop-blur-xl flex flex-col justify-between group shadow-xl hover:shadow-2xl relative overflow-hidden transition-all`}
                >
                  <div>
                    {/* Header with Category & Module Count Tag (Telemetry Style) */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-zinc-400 flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                        <CategoryIcon size={16} className={cat.headerColor} />
                        {cat.category}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${cat.badgeColor} group-hover:scale-105 transition-transform`}>
                        {cat.items.length} Modules
                      </span>
                    </div>

                    {/* Hero Metric & Sub-label (Telemetry Style) */}
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-amber-400 group-hover:scale-105 origin-left transition-all">
                        {cat.heroMetric}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">{cat.heroSub}</span>
                    </div>

                    <div className="text-xs font-bold text-amber-300/90 mb-3">
                      {cat.subtitle}
                    </div>

                    {/* Module Chips List with Divider */}
                    <div className="space-y-2 pt-3.5 border-t border-white/10">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          onClick={() => setInspectedModule(item.name)}
                          className="hardware-module-chip p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] hover:border-amber-500/30 flex items-center justify-between gap-2 cursor-pointer group/chip transition-all"
                          title={`Click to inspect electrical pinout & specs for ${item.name}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className={`w-2 h-2 rounded-full ${cat.dotColor} shrink-0 group-hover/chip:scale-150 transition-transform`} />
                            <div className="truncate">
                              <span className="font-semibold text-xs text-zinc-200 group-hover/chip:text-white transition-colors block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono group-hover/chip:text-zinc-400 block truncate">
                                {item.chip}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-transform group-hover/chip:scale-105 ${item.tagStyle}`}>
                              {item.tag}
                            </span>
                            <span className="text-[10px] text-zinc-500 group-hover/chip:text-amber-400 opacity-0 group-hover/chip:opacity-100 transition-opacity">
                              ↗
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Live Verification Indicator (Telemetry Style) */}
                  <div className="pt-4 mt-5 border-t border-white/10 text-[11px] font-mono flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <CheckCircle2 size={12} className={cat.headerColor} />
                      Wokwi Verified
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${cat.headerColor}`}>
                      {cat.badgeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* POP-UP HARDWARE SPEC INSPECTOR MODAL */}
          {inspectedModule && hardwareCatalogDetails[inspectedModule] && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
              onClick={() => setInspectedModule(null)}
            >
              <div
                className="hardware-popup-enter w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-left relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Ambient Radial Accent */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/15 blur-[100px] pointer-events-none -z-10" />

                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${hardwareCatalogDetails[inspectedModule].badgeColor}`}>
                        {hardwareCatalogDetails[inspectedModule].category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Wokwi Model: <strong className="text-zinc-200">{hardwareCatalogDetails[inspectedModule].wokwiId}</strong>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {hardwareCatalogDetails[inspectedModule].name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {hardwareCatalogDetails[inspectedModule].chip}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInspectedModule(null)}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Close inspector (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Key Spec Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs font-mono">
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block uppercase">Voltage Logic</span>
                    <strong className="text-amber-400 text-xs mt-0.5 block">
                      {hardwareCatalogDetails[inspectedModule].voltage}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block uppercase">Flash / Range</span>
                    <strong className="text-orange-400 text-xs mt-0.5 block truncate">
                      {hardwareCatalogDetails[inspectedModule].memory}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-zinc-500 block uppercase">Simulation</span>
                    <strong className="text-amber-400 text-xs mt-0.5 block flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-amber-400" />
                      Zero-Latency
                    </strong>
                  </div>
                </div>

                {/* Pinout Assignment Guide */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <CircuitBoard size={14} className="text-amber-400" />
                    Exact Electrical Pin Allocations
                  </h4>
                  <div className="rounded-xl border border-white/10 bg-black/50 divide-y divide-white/5 overflow-hidden">
                    {hardwareCatalogDetails[inspectedModule].pinout.map((p, pIdx) => (
                      <div key={pIdx} className="px-3.5 py-2 flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-300 font-semibold">{p.pin}</span>
                        <span className="text-zinc-400">{p.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C++ Sketch or Netlist Preview */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Code2 size={14} className="text-amber-400" />
                    Synthesized C++ Sketch Snippet
                  </h4>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-black/80 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {hardwareCatalogDetails[inspectedModule].codeSnippet}
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 text-zinc-300">Esc</kbd> to dismiss
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Button
                      onClick={() => setInspectedModule(null)}
                      variant="outline"
                      size="sm"
                      className="text-xs border-white/10 hover:border-white/30"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setInspectedModule(null);
                        onLaunchStudio();
                      }}
                      variant="default"
                      size="sm"
                      className="gap-1.5 text-xs px-5 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                    >
                      <span>Load in Studio</span>
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* BOTTOM FULL WIDTH CALL TO ACTION */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 w-full text-center border-t border-white/[0.06]">
          <div className="interactive-box p-10 sm:p-16 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-zinc-950 to-zinc-950 relative overflow-hidden shadow-2xl hover:border-amber-500/60 hover:shadow-[0_0_60px_rgba(245,158,11,0.25)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] -z-10" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-6">
              <Flame size={14} className="text-amber-400" />
              <span>Autonomous Embedded IoT Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Ready to Flash Your First ESP32?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8">
              Open the studio now. Build your circuit, run the simulation, and stream live hardware telemetry in under 60 seconds.
            </p>

            <Button
              onClick={onLaunchStudio}
              variant="default"
              size="lg"
              className="h-14 sm:h-16 px-10 text-base font-bold rounded-full shadow-xl shadow-amber-500/30 gap-2.5"
            >
              <span>Launch Blinky Studio</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer - Full Width */}
      <footer className="border-t border-white/[0.06] bg-[#060508] py-10 px-6 sm:px-10 lg:px-16 w-full">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap size={12} className="fill-amber-400" />
            </div>
            <span className="font-bold text-zinc-300">BLINKY</span>
            <span>— Autonomous IoT &amp; Embedded Hardware Studio</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Powered by <strong>Blinky Agentic Core</strong></span>
            <span>•</span>
            <span>Wokwi Simulation &amp; WebSerial Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
