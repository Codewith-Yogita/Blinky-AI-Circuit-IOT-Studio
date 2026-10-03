import { useState, useMemo, useRef, useEffect } from "react";
import "@wokwi/elements";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Zap,
  Radio,
  Volume2,
  Gamepad2,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  Layers,
  X,
  Info,
} from "lucide-react";

/**
 * EXACT PHYSICAL PIN COORDINATES AND EXIT DIRECTIONS FOR @wokwi/elements
 * Calibrated precisely to each component's physical solder pads.
 * `dir` specifies the natural exit normal: [-1, 0] = left, [1, 0] = right, [0, 1] = down, [0, -1] = up.
 */
const PIN_MAPS = {
  // ESP32 DevKit V1 (Board dimensions: 109px x 165px)
  esp32: {
    // Left column pins (x: 5, facing LEFT)
    EN: { x: 5, y: 24, dir: [-1, 0] },
    VP: { x: 5, y: 34, dir: [-1, 0] },
    GPIO36: { x: 5, y: 34, dir: [-1, 0] },
    VN: { x: 5, y: 44, dir: [-1, 0] },
    GPIO39: { x: 5, y: 44, dir: [-1, 0] },
    "34": { x: 5, y: 53.1, dir: [-1, 0] },
    GPIO34: { x: 5, y: 53.1, dir: [-1, 0] },
    "35": { x: 5, y: 62.9, dir: [-1, 0] },
    GPIO35: { x: 5, y: 62.9, dir: [-1, 0] },
    "32": { x: 5, y: 72.2, dir: [-1, 0] },
    GPIO32: { x: 5, y: 72.2, dir: [-1, 0] },
    "33": { x: 5, y: 81.7, dir: [-1, 0] },
    GPIO33: { x: 5, y: 81.7, dir: [-1, 0] },
    "25": { x: 5, y: 91.3, dir: [-1, 0] },
    GPIO25: { x: 5, y: 91.3, dir: [-1, 0] },
    "26": { x: 5, y: 101, dir: [-1, 0] },
    GPIO26: { x: 5, y: 101, dir: [-1, 0] },
    "27": { x: 5, y: 110.8, dir: [-1, 0] },
    GPIO27: { x: 5, y: 110.8, dir: [-1, 0] },
    "14": { x: 5, y: 120, dir: [-1, 0] },
    GPIO14: { x: 5, y: 120, dir: [-1, 0] },
    "12": { x: 5, y: 130.4, dir: [-1, 0] },
    GPIO12: { x: 5, y: 130.4, dir: [-1, 0] },
    "13": { x: 5, y: 139.5, dir: [-1, 0] },
    GPIO13: { x: 5, y: 139.5, dir: [-1, 0] },
    "GND.2": { x: 5, y: 149, dir: [-1, 0] },
    VIN: { x: 5, y: 158.5, dir: [-1, 0] },
    "5V": { x: 5, y: 158.5, dir: [-1, 0] },

    // Right column pins (x: 104, facing RIGHT)
    "23": { x: 104, y: 24, dir: [1, 0] },
    GPIO23: { x: 104, y: 24, dir: [1, 0] },
    "22": { x: 104, y: 34, dir: [1, 0] },
    GPIO22: { x: 104, y: 34, dir: [1, 0] },
    TX0: { x: 104, y: 44, dir: [1, 0] },
    "1": { x: 104, y: 44, dir: [1, 0] },
    GPIO1: { x: 104, y: 44, dir: [1, 0] },
    RX0: { x: 104, y: 53.1, dir: [1, 0] },
    "3": { x: 104, y: 53.1, dir: [1, 0] },
    GPIO3: { x: 104, y: 53.1, dir: [1, 0] },
    "21": { x: 104, y: 62.9, dir: [1, 0] },
    GPIO21: { x: 104, y: 62.9, dir: [1, 0] },
    "19": { x: 104, y: 72.2, dir: [1, 0] },
    GPIO19: { x: 104, y: 72.2, dir: [1, 0] },
    "18": { x: 104, y: 81.7, dir: [1, 0] },
    GPIO18: { x: 104, y: 81.7, dir: [1, 0] },
    "5": { x: 104, y: 91.3, dir: [1, 0] },
    GPIO5: { x: 104, y: 91.3, dir: [1, 0] },
    TX2: { x: 104, y: 101, dir: [1, 0] },
    "17": { x: 104, y: 101, dir: [1, 0] },
    GPIO17: { x: 104, y: 101, dir: [1, 0] },
    RX2: { x: 104, y: 110.8, dir: [1, 0] },
    "16": { x: 104, y: 110.8, dir: [1, 0] },
    GPIO16: { x: 104, y: 110.8, dir: [1, 0] },
    "4": { x: 104, y: 120, dir: [1, 0] },
    GPIO4: { x: 104, y: 120, dir: [1, 0] },
    "2": { x: 104, y: 130.4, dir: [1, 0] },
    GPIO2: { x: 104, y: 130.4, dir: [1, 0] },
    "15": { x: 104, y: 139.5, dir: [1, 0] },
    GPIO15: { x: 104, y: 139.5, dir: [1, 0] },
    GND: { x: 104, y: 149, dir: [1, 0] },
    "GND.1": { x: 104, y: 149, dir: [1, 0] },
    "3V3": { x: 104, y: 158.5, dir: [1, 0] },
  },

  // Tactile Pushbutton (67px x 45px)
  pushbutton: {
    "1": { x: 2, y: 13, dir: [-1, 0] },
    "1.l": { x: 2, y: 13, dir: [-1, 0] },
    pin1: { x: 2, y: 13, dir: [-1, 0] },
    "2": { x: 65, y: 13, dir: [1, 0] },
    "1.r": { x: 65, y: 13, dir: [1, 0] },
    pin2: { x: 65, y: 13, dir: [1, 0] },
    "2.l": { x: 2, y: 32, dir: [-1, 0] },
    "2.r": { x: 65, y: 32, dir: [1, 0] },
  },

  // Resistor (60px x 14px)
  resistor: {
    "1": { x: 2, y: 7, dir: [-1, 0] },
    pin1: { x: 2, y: 7, dir: [-1, 0] },
    "2": { x: 57, y: 7, dir: [1, 0] },
    pin2: { x: 57, y: 7, dir: [1, 0] },
  },

  // LED (40px x 50px)
  led: {
    anode: { x: 25, y: 44, dir: [0, 1] },
    A: { x: 25, y: 44, dir: [0, 1] },
    "+": { x: 25, y: 44, dir: [0, 1] },
    "1": { x: 25, y: 44, dir: [0, 1] },
    cathode: { x: 15, y: 44, dir: [0, 1] },
    C: { x: 15, y: 44, dir: [0, 1] },
    K: { x: 15, y: 44, dir: [0, 1] },
    "-": { x: 15, y: 44, dir: [0, 1] },
    "2": { x: 15, y: 44, dir: [0, 1] },
  },

  // Ultrasonic HC-SR04 (170px x 95px, pins point down at y: 94.5)
  ultrasonic: {
    VCC: { x: 71.3, y: 94.5, dir: [0, 1] },
    "5V": { x: 71.3, y: 94.5, dir: [0, 1] },
    TRIG: { x: 81.3, y: 94.5, dir: [0, 1] },
    ECHO: { x: 91.3, y: 94.5, dir: [0, 1] },
    GND: { x: 101.3, y: 94.5, dir: [0, 1] },
  },

  // Piezo Buzzer (75px x 85px, pins point down at y: 84)
  buzzer: {
    "+": { x: 27, y: 84, dir: [0, 1] },
    "1": { x: 27, y: 84, dir: [0, 1] },
    POS: { x: 27, y: 84, dir: [0, 1] },
    SIG: { x: 27, y: 84, dir: [0, 1] },
    "-": { x: 37, y: 84, dir: [0, 1] },
    "2": { x: 37, y: 84, dir: [0, 1] },
    NEG: { x: 37, y: 84, dir: [0, 1] },
    GND: { x: 37, y: 84, dir: [0, 1] },
  },

  // Dual-Axis Analog Joystick Module (103px x 120px, pins point down at y: 115.8)
  joystick: {
    VCC: { x: 33, y: 115.8, dir: [0, 1] },
    "5V": { x: 33, y: 115.8, dir: [0, 1] },
    VERT: { x: 42.6, y: 115.8, dir: [0, 1] },
    VRX: { x: 42.6, y: 115.8, dir: [0, 1] },
    Y: { x: 42.6, y: 115.8, dir: [0, 1] },
    HORZ: { x: 52.2, y: 115.8, dir: [0, 1] },
    VRY: { x: 52.2, y: 115.8, dir: [0, 1] },
    X: { x: 52.2, y: 115.8, dir: [0, 1] },
    SEL: { x: 61.8, y: 115.8, dir: [0, 1] },
    SW: { x: 61.8, y: 115.8, dir: [0, 1] },
    BTN: { x: 61.8, y: 115.8, dir: [0, 1] },
    GND: { x: 71.4, y: 115.8, dir: [0, 1] },
  },
};

/**
 * Standard Wokwi Wire Colors
 */
function getWireColor(fromPin, toPin, index = 0) {
  const f = String(fromPin || "").toUpperCase();
  const t = String(toPin || "").toUpperCase();

  // Ground lines (Black/Slate)
  if (
    f.includes("GND") ||
    t.includes("GND") ||
    f === "C" ||
    t === "C" ||
    f === "K" ||
    t === "K" ||
    f === "-" ||
    t === "-"
  ) {
    return "#3f3f46"; // Wokwi Slate-Black Ground Wire
  }

  // 5V Power lines (Vivid Red)
  if (
    f.includes("5V") ||
    t.includes("5V") ||
    f.includes("VCC") ||
    t.includes("VCC") ||
    f === "+" ||
    t === "+"
  ) {
    return "#ef4444"; // Wokwi Red Power Wire
  }

  // 3.3V Power lines (Orange)
  if (f.includes("3V3") || t.includes("3V3")) {
    return "#f97316";
  }

  // Dedicated Signal colors for clarity
  if (f.includes("TRIG") || t.includes("TRIG") || f.includes("5") || t.includes("5")) {
    return "#10b981"; // Emerald Green for Trigger
  }
  if (f.includes("ECHO") || t.includes("ECHO") || f.includes("18") || t.includes("18")) {
    return "#a855f7"; // Vibrant Purple for Echo
  }
  if (f.includes("VERT") || t.includes("VERT") || f.includes("34") || t.includes("34")) {
    return "#8b5cf6"; // Violet for Joystick Y-Axis
  }
  if (f.includes("HORZ") || t.includes("HORZ") || f.includes("35") || t.includes("35")) {
    return "#3b82f6"; // Electric Blue for Joystick X-Axis
  }
  if (f.includes("SEL") || t.includes("SEL") || f.includes("SW") || t.includes("SW")) {
    return "#f59e0b"; // Warm Amber for Joystick Select Button
  }
  if (f.includes("BUZZER") || t.includes("BUZZER") || f.includes("16") || t.includes("16")) {
    return "#3b82f6"; // Electric Blue for Buzzer
  }
  if (f.includes("4") || t.includes("4") || f.includes("BUTTON") || t.includes("BUTTON")) {
    return "#f59e0b"; // Warm Amber for Button Input
  }
  if (f.includes("2") || t.includes("2")) {
    return "#06b6d4"; // Cyan for LED Signal
  }

  const cycle = ["#06b6d4", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899"];
  return cycle[index % cycle.length];
}

/**
 * Clean Wokwi Wire Routing Engine
 * Generates natural, collision-free jumper wire curves.
 */
function computeWokwiWirePath(p1, p2, idx) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);

  // 1. Far-right Return Loop (e.g. LED Cathode returning back to ESP32 right GND)
  if (dx < -60 && p1.x > 600) {
    const busY = Math.max(p1.y, p2.y) + 42 + (idx % 3) * 12;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 35}, ${p1.x - 30} ${busY}, ${(p1.x + p2.x) / 2} ${busY} C ${p2.x + 60} ${busY}, ${p2.x + 40} ${p2.y + 15}, ${p2.x} ${p2.y}`;
  }

  // 2. Under-ESP32 Route (e.g. Button on left (x < 250) to ESP32 right header (x > 400))
  if (p1.x < 250 && p2.x > 400) {
    const underY = 325 + (idx % 2) * 16;
    return `M ${p1.x} ${p1.y} C ${p1.x + 40} ${p1.y}, ${p1.x + 70} ${underY}, 360 ${underY} C 430 ${underY}, ${p2.x + 40} ${p2.y + 12}, ${p2.x} ${p2.y}`;
  }

  // 3. Right header up to Top-Left Sensor (e.g. ESP32 GPIO5/GPIO18 to Ultrasonic TRIG/ECHO)
  if (p1.x > 400 && p2.x < 300 && p2.y < 160) {
    const channelY = 175 + (idx % 2) * 14;
    return `M ${p1.x} ${p1.y} C ${p1.x + 40} ${p1.y}, ${p1.x + 40} ${channelY}, 360 ${channelY} C 280 ${channelY}, ${p2.x} ${channelY + 20}, ${p2.x} ${p2.y}`;
  }

  // 4. Direct horizontal or adjacent connection
  if (Math.abs(dx) > Math.abs(dy) && (p1.dir[0] !== 0 || p2.dir[0] !== 0)) {
    const pullX = Math.min(Math.max(Math.abs(dx) * 0.45, 20), 65);
    const cx1 = p1.x + p1.dir[0] * pullX;
    const cy1 = p1.y;
    const cx2 = p2.x + p2.dir[0] * pullX;
    const cy2 = p2.y;
    return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
  }

  // 5. Default natural spline based on pin exit normal vectors
  const pull = Math.min(Math.max(dist * 0.38, 20), 80);
  const spread = (idx % 3 - 1) * 6;
  const cx1 = p1.x + p1.dir[0] * pull;
  const cy1 = p1.y + p1.dir[1] * pull + (p1.dir[0] !== 0 ? spread : 0);
  const cx2 = p2.x + p2.dir[0] * pull;
  const cy2 = p2.y + p2.dir[1] * pull + (p2.dir[0] !== 0 ? spread : 0);

  return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
}

/**
 * Clean Wokwi Circuit Diagram Canvas (True Wokwi Style + Fully Functional Interactive Simulation)
 * Buttons click, Joysticks deflect, Sensors trigger, and LEDs dynamically illuminate in real time.
 */
export default function WokwiCircuitCanvas({ circuit, initialMode = "step" }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredWireId, setHoveredWireId] = useState(null);
  const canvasRef = useRef(null);

  // Step-by-Step Simulation Mode State
  const [isStepMode, setIsStepMode] = useState(initialMode === "step");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed] = useState(2500);

  // Live Interactive State
  const [buttonPressed, setButtonPressed] = useState(false);
  const [buttonToggled, setButtonToggled] = useState(false);
  const [joystickState, setJoystickState] = useState({ x: 0, y: 0, pressed: false });
  const [ultrasonicDistance, setUltrasonicDistance] = useState(12); // Default 12cm triggers alarm (<15cm)
  const [blinkTick, setBlinkTick] = useState(true);

  // Filter ONLY components that actually participate in connections
  const activeComponents = useMemo(() => {
    const connectedIds = new Set();
    (circuit?.connections || []).forEach((c) => {
      if (c.from?.component) connectedIds.add(c.from.component);
      if (c.to?.component) connectedIds.add(c.to.component);
    });

    return (circuit?.components || []).filter(
      (comp) => connectedIds.has(comp.id) || connectedIds.has(comp.name)
    );
  }, [circuit]);

  // Determine component category
  const getCompCategory = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("joy")) return "joystick";
    if (t.includes("ultrasonic") || t.includes("sonar")) return "ultrasonic";
    if (t.includes("buzzer") || t.includes("piezo")) return "buzzer";
    if (t.includes("button") || t.includes("switch")) return "pushbutton";
    if (t.includes("resistor")) return "resistor";
    if (t.includes("led")) return "led";
    return "resistor";
  };

  const isUltrasonicCircuit = useMemo(
    () => activeComponents.some((c) => getCompCategory(c.type) === "ultrasonic"),
    [activeComponents]
  );
  const isButtonCircuit = useMemo(
    () => activeComponents.some((c) => getCompCategory(c.type) === "pushbutton"),
    [activeComponents]
  );
  const isJoystickCircuit = useMemo(
    () => activeComponents.some((c) => getCompCategory(c.type) === "joystick"),
    [activeComponents]
  );

  // Automatic 1s blink tick for default single-LED circuit
  useEffect(() => {
    if (!isButtonCircuit && !isJoystickCircuit && !isUltrasonicCircuit) {
      const interval = setInterval(() => {
        setBlinkTick((prev) => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isButtonCircuit, isJoystickCircuit, isUltrasonicCircuit]);

  // Reset steps when circuit changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, [circuit?.id, circuit?.title]);

  // Distinct, collision-free layout for each circuit type
  const layout = useMemo(() => {
    const positions = {};
    if (!circuit) return positions;

    const hasJoystick = activeComponents.some(
      (c) => getCompCategory(c.type) === "joystick"
    );
    const hasUltrasonic = activeComponents.some(
      (c) => getCompCategory(c.type) === "ultrasonic"
    );
    const hasButton = activeComponents.some(
      (c) => getCompCategory(c.type) === "pushbutton"
    );

    if (hasJoystick) {
      // Preset: Dual-Axis Joystick Controller with Red Alert LED
      positions["esp32"] = {
        x: 360,
        y: 150,
        width: 109,
        height: 165,
        type: "esp32",
        name: circuit?.board?.model || "ESP32 DevKit V1",
      };
      positions["esp"] = positions["esp32"];

      let joyCount = 0;
      let resistorCount = 0;
      let ledCount = 0;

      activeComponents.forEach((comp) => {
        const cat = getCompCategory(comp.type);
        const id = comp.id;

        if (cat === "joystick") {
          // Left of ESP32 (y: 70, width: 103, height: 120)
          positions[id] = {
            x: 100 + joyCount * 120,
            y: 70,
            width: 103,
            height: 120,
            type: "joystick",
            comp,
          };
          joyCount++;
        } else if (cat === "resistor") {
          // Right of ESP32
          positions[id] = {
            x: 580,
            y: 180 + resistorCount * 80,
            width: 60,
            height: 14,
            type: "resistor",
            comp,
          };
          resistorCount++;
        } else if (cat === "led") {
          // Far right
          positions[id] = {
            x: 740,
            y: 165 + ledCount * 80,
            width: 40,
            height: 50,
            type: "led",
            comp,
          };
          ledCount++;
        }
      });
    } else if (hasUltrasonic) {
      // Preset 1: Water Level / Ultrasonic Alarm
      positions["esp32"] = {
        x: 360,
        y: 220,
        width: 109,
        height: 165,
        type: "esp32",
        name: circuit?.board?.model || "ESP32 DevKit V1",
      };
      positions["esp"] = positions["esp32"];

      let sensorCount = 0;
      let buzzerCount = 0;
      let resistorCount = 0;
      let ledCount = 0;

      activeComponents.forEach((comp) => {
        const cat = getCompCategory(comp.type);
        const id = comp.id;

        if (cat === "ultrasonic") {
          positions[id] = {
            x: 120 + sensorCount * 220,
            y: 40,
            width: 170,
            height: 95,
            type: "ultrasonic",
            comp,
          };
          sensorCount++;
        } else if (cat === "buzzer") {
          positions[id] = {
            x: 580 + buzzerCount * 110,
            y: 45,
            width: 75,
            height: 85,
            type: "buzzer",
            comp,
          };
          buzzerCount++;
        } else if (cat === "resistor") {
          positions[id] = {
            x: 580,
            y: 220 + resistorCount * 70,
            width: 60,
            height: 14,
            type: "resistor",
            comp,
          };
          resistorCount++;
        } else if (cat === "led") {
          positions[id] = {
            x: 740,
            y: 205 + ledCount * 70,
            width: 40,
            height: 50,
            type: "led",
            comp,
          };
          ledCount++;
        }
      });
    } else if (hasButton) {
      // Preset 2: Button Controller
      positions["esp32"] = {
        x: 360,
        y: 140,
        width: 109,
        height: 165,
        type: "esp32",
        name: circuit?.board?.model || "ESP32 DevKit V1",
      };
      positions["esp"] = positions["esp32"];

      let buttonCount = 0;
      let resistorCount = 0;
      let ledCount = 0;

      activeComponents.forEach((comp) => {
        const cat = getCompCategory(comp.type);
        const id = comp.id;

        if (cat === "pushbutton") {
          positions[id] = {
            x: 120,
            y: 180 + buttonCount * 100,
            width: 67,
            height: 45,
            type: "pushbutton",
            comp,
          };
          buttonCount++;
        } else if (cat === "resistor") {
          positions[id] = {
            x: 580,
            y: 175 + resistorCount * 80,
            width: 60,
            height: 14,
            type: "resistor",
            comp,
          };
          resistorCount++;
        } else if (cat === "led") {
          positions[id] = {
            x: 740,
            y: 160 + ledCount * 80,
            width: 40,
            height: 50,
            type: "led",
            comp,
          };
          ledCount++;
        }
      });
    } else {
      // Preset 3: Single LED Blink
      positions["esp32"] = {
        x: 320,
        y: 140,
        width: 109,
        height: 165,
        type: "esp32",
        name: circuit?.board?.model || "ESP32 DevKit V1",
      };
      positions["esp"] = positions["esp32"];

      let resistorCount = 0;
      let ledCount = 0;

      activeComponents.forEach((comp) => {
        const cat = getCompCategory(comp.type);
        const id = comp.id;

        if (cat === "resistor") {
          positions[id] = {
            x: 540,
            y: 175 + resistorCount * 80,
            width: 60,
            height: 14,
            type: "resistor",
            comp,
          };
          resistorCount++;
        } else if (cat === "led") {
          positions[id] = {
            x: 700,
            y: 160 + ledCount * 80,
            width: 40,
            height: 50,
            type: "led",
            comp,
          };
          ledCount++;
        }
      });
    }

    return positions;
  }, [circuit, activeComponents]);

  // Resolve absolute (x, y) coordinates and exit direction of any pin
  const resolvePinCoords = (compKey, pinName, otherCompPos) => {
    const compPos = layout[compKey];
    if (!compPos) return null;

    const cat = compPos.type || "resistor";
    const registry = PIN_MAPS[cat] || PIN_MAPS.resistor;

    let cleanPin = String(pinName || "").trim();

    // Smart GND routing for ESP32
    if (
      compKey === "esp32" &&
      (cleanPin.toUpperCase() === "GND" || cleanPin.toUpperCase() === "GND.1")
    ) {
      if (otherCompPos && otherCompPos.x < compPos.x) {
        cleanPin = "GND.2";
      }
    }

    let pinMeta = registry[cleanPin];

    if (!pinMeta) {
      const foundKey = Object.keys(registry).find(
        (k) => k.toLowerCase() === cleanPin.toLowerCase()
      );
      if (foundKey) pinMeta = registry[foundKey];
    }

    return {
      compId: compKey,
      x: compPos.x + pinMeta.x,
      y: compPos.y + pinMeta.y,
      dir: pinMeta.dir || [0, 1],
      pinName: cleanPin,
      compName: compPos.comp?.name || compPos.name || compKey,
    };
  };

  // Generate verified wires with natural curves
  const rawWires = useMemo(() => {
    if (!circuit?.connections) return [];

    return circuit.connections
      .map((conn, idx) => {
        const fromKey = conn.from.component === "esp" ? "esp32" : conn.from.component;
        const toKey = conn.to.component === "esp" ? "esp32" : conn.to.component;

        const toCompPos = layout[toKey];
        const fromCompPos = layout[fromKey];

        const p1 = resolvePinCoords(fromKey, conn.from.pin, toCompPos);
        const p2 = resolvePinCoords(toKey, conn.to.pin, fromCompPos);

        if (!p1 || !p2) return null;

        const color = getWireColor(conn.from.pin, conn.to.pin, idx);
        const pathData = computeWokwiWirePath(p1, p2, idx);
        const fullLabel = `${p1.compName} [${p1.pinName}] ➔ ${p2.compName} [${p2.pinName}]`;

        return {
          id: `wire-${idx}`,
          num: idx + 1,
          fromKey,
          toKey,
          p1,
          p2,
          pathData,
          color,
          fullLabel,
          fromComp: p1.compName,
          fromPin: p1.pinName,
          toComp: p2.compName,
          toPin: p2.pinName,
        };
      })
      .filter(Boolean);
  }, [circuit, layout]);

  // Step-by-Step Assembly Steps Sequence
  const steps = useMemo(() => {
    if (!circuit) return [];

    const generatedSteps = [];
    const introducedComponents = new Set(["esp32", "esp"]);
    const introducedWires = new Set();

    const boardModel = circuit?.board?.model || "ESP32 DevKit V1";

    // Step 1: ESP32 Microcontroller
    generatedSteps.push({
      stepNumber: 1,
      type: "board",
      title: `1. Mount ${boardModel}`,
      shortTitle: "1. ESP32",
      subtitle: `Place the ${boardModel} onto the breadboard workspace`,
      description: `The ${boardModel} serves as the central IoT controller, supplying 3.3V digital GPIO logic outputs, ADC analog inputs, and system ground (GND) return paths.`,
      visibleCompIds: new Set(["esp32", "esp"]),
      visibleWireIds: new Set(),
      focusedCompId: "esp32",
      focusedWireId: null,
      pinCallouts: [],
      isLiveSimulation: false,
    });

    const getCompTitle = (comp) => {
      if (!comp) return "Component";
      return comp.name || comp.type || "Component";
    };

    const getCompTip = (comp) => {
      const cat = getCompCategory(comp?.type);
      if (cat === "resistor") {
        return `A ${comp.value || "220"}Ω current-limiting resistor is placed in series with the LED to restrict excess current from 3.3V GPIO to a safe ~15mA, preventing LED burnout.`;
      }
      if (cat === "led") {
        return `The Red LED is a directional semiconductor diode. Current must enter the longer lead (Anode +) and exit through the shorter lead (Cathode -).`;
      }
      if (cat === "pushbutton") {
        return `The tactile pushbutton acts as a momentary digital switch to pull GPIO input LOW when clicked.`;
      }
      if (cat === "ultrasonic") {
        return `The HC-SR04 sonar sensor measures distance by emitting 40kHz ultrasonic sound pulses and measuring echo return timing.`;
      }
      if (cat === "buzzer") {
        return `The piezo buzzer vibrates rapidly when electrical current passes through its crystal element, generating acoustic alarms.`;
      }
      if (cat === "joystick") {
        return `The analog joystick provides dual potentiometers for 2D coordinate deflection and an integrated pushbutton.`;
      }
      return `Mount the ${getCompTitle(comp)} onto the breadboard.`;
    };

    const getWireTip = (wire) => {
      const f = String(wire.fromPin || "").toUpperCase();
      const t = String(wire.toPin || "").toUpperCase();

      if (f.includes("GND") || t.includes("GND") || f === "C" || t === "C" || f === "K" || t === "K") {
        return `Route a jumper wire from ${wire.fromComp} pin [${wire.fromPin}] to ${wire.toComp} pin [${wire.toPin}]. This completes the closed electrical ground loop (0.0V reference).`;
      }
      if (f.includes("GPIO") || t.includes("GPIO") || f === "2" || t === "2") {
        return `Connect signal jumper wire from ${wire.fromComp} pin [${wire.fromPin}] to ${wire.toComp} pin [${wire.toPin}]. When firmware sets this pin HIGH (3.3V), power is delivered.`;
      }
      if (f.includes("5V") || t.includes("5V") || f.includes("VCC") || t.includes("VCC")) {
        return `Connect the 5V DC power wire from ${wire.fromComp} pin [${wire.fromPin}] to ${wire.toComp} pin [${wire.toPin}] to energize the component.`;
      }
      return `Connect jumper wire from ${wire.fromComp} pin [${wire.fromPin}] ➔ ${wire.toComp} pin [${wire.toPin}].`;
    };

    rawWires.forEach((wire) => {
      const fromKey = wire.fromKey;
      const toKey = wire.toKey;

      const fromComp = activeComponents.find((c) => c.id === fromKey || c.name === wire.fromComp);
      const toComp = activeComponents.find((c) => c.id === toKey || c.name === wire.toComp);

      if (fromComp && !introducedComponents.has(fromComp.id)) {
        introducedComponents.add(fromComp.id);
        const stepNum = generatedSteps.length + 1;
        generatedSteps.push({
          stepNumber: stepNum,
          type: "component",
          title: `${stepNum}. Place ${getCompTitle(fromComp)}`,
          shortTitle: `${stepNum}. ${getCompTitle(fromComp).replace(/DevKit.*|Sensor.*|Module.*/, "")}`,
          subtitle: `Position the ${getCompTitle(fromComp)} on the breadboard`,
          description: getCompTip(fromComp),
          visibleCompIds: new Set(introducedComponents),
          visibleWireIds: new Set(introducedWires),
          focusedCompId: fromComp.id,
          focusedWireId: null,
          pinCallouts: [],
          isLiveSimulation: false,
        });
      }

      if (toComp && !introducedComponents.has(toComp.id)) {
        introducedComponents.add(toComp.id);
        const stepNum = generatedSteps.length + 1;
        generatedSteps.push({
          stepNumber: stepNum,
          type: "component",
          title: `${stepNum}. Place ${getCompTitle(toComp)}`,
          shortTitle: `${stepNum}. ${getCompTitle(toComp).replace(/DevKit.*|Sensor.*|Module.*/, "")}`,
          subtitle: `Position the ${getCompTitle(toComp)} on the breadboard`,
          description: getCompTip(toComp),
          visibleCompIds: new Set(introducedComponents),
          visibleWireIds: new Set(introducedWires),
          focusedCompId: toComp.id,
          focusedWireId: null,
          pinCallouts: [],
          isLiveSimulation: false,
        });
      }

      // Add wire step
      introducedWires.add(wire.id);
      const stepNum = generatedSteps.length + 1;
      generatedSteps.push({
        stepNumber: stepNum,
        type: "wire",
        title: `${stepNum}. Wire ${wire.fromComp} [${wire.fromPin}] ➔ ${wire.toComp} [${wire.toPin}]`,
        shortTitle: `${stepNum}. Wire ${wire.fromPin} ➔ ${wire.toPin}`,
        subtitle: `Route jumper wire specifying ${wire.fromComp} pin ${wire.fromPin}`,
        description: getWireTip(wire),
        visibleCompIds: new Set(introducedComponents),
        visibleWireIds: new Set(introducedWires),
        focusedCompId: null,
        focusedWireId: wire.id,
        pinCallouts: [
          {
            compId: fromKey,
            compName: wire.fromComp,
            pin: wire.fromPin,
            x: wire.p1.x,
            y: wire.p1.y,
            dir: wire.p1.dir,
          },
          {
            compId: toKey,
            compName: wire.toComp,
            pin: wire.toPin,
            x: wire.p2.x,
            y: wire.p2.y,
            dir: wire.p2.dir,
          },
        ],
        wire,
        isLiveSimulation: false,
      });
    });

    // Final live simulation step
    const finalStepNum = generatedSteps.length + 1;
    generatedSteps.push({
      stepNumber: finalStepNum,
      type: "completed",
      title: `${finalStepNum}. ⚡ Circuit Complete — Live Hardware Simulation`,
      shortTitle: `${finalStepNum}. Live Power ⚡`,
      subtitle: "All connections closed & verified. Firmware runtime operational!",
      description:
        "Circuit fully assembled and energized! Firmware on the ESP32 is actively driving signals: GPIO2 toggles HIGH (3.3V) and LOW (0V), blinking the LED in real-time. You can toggle switches and inspect runtime response!",
      visibleCompIds: new Set([...activeComponents.map((c) => c.id), "esp32", "esp"]),
      visibleWireIds: new Set(rawWires.map((w) => w.id)),
      focusedCompId: null,
      focusedWireId: null,
      pinCallouts: [],
      isLiveSimulation: true,
    });

    return generatedSteps;
  }, [circuit, activeComponents, rawWires]);

  // Current Active Step Object
  const currentStep = useMemo(() => {
    if (!isStepMode || steps.length === 0) return null;
    return steps[Math.min(currentStepIndex, Math.max(0, steps.length - 1))] || steps[0];
  }, [isStepMode, steps, currentStepIndex]);

  // Is the circuit completely assembled and energized (final live simulation step reached)
  const isCircuitCompleted = useMemo(() => {
    if (!currentStep) return false;
    return Boolean(
      currentStep.isLiveSimulation ||
        currentStep.type === "completed" ||
        currentStepIndex === steps.length - 1
    );
  }, [currentStep, currentStepIndex, steps.length]);

  // Dynamic LED State resolved in real-time from active inputs
  const isLedOn = useMemo(() => {
    if (isStepMode && currentStep && !currentStep.isLiveSimulation) {
      return false;
    }
    if (isButtonCircuit) {
      return buttonPressed || buttonToggled;
    }
    if (isJoystickCircuit) {
      const isDeflected =
        Math.abs(joystickState.x) > 0.25 || Math.abs(joystickState.y) > 0.25;
      return isDeflected || joystickState.pressed;
    }
    if (isUltrasonicCircuit) {
      return ultrasonicDistance > 0 && ultrasonicDistance < 15;
    }
    return blinkTick;
  }, [
    isStepMode,
    currentStep,
    isButtonCircuit,
    buttonPressed,
    buttonToggled,
    isJoystickCircuit,
    joystickState,
    isUltrasonicCircuit,
    ultrasonicDistance,
    blinkTick,
  ]);

  // Dynamic Piezo Buzzer Soundwaves
  const isBuzzerOn = useMemo(() => {
    if (isStepMode && currentStep && !currentStep.isLiveSimulation) {
      return false;
    }
    if (isUltrasonicCircuit) {
      return ultrasonicDistance > 0 && ultrasonicDistance < 15;
    }
    return false;
  }, [isStepMode, currentStep, isUltrasonicCircuit, ultrasonicDistance]);

  // Generate verified wires with live current status
  const wires = useMemo(() => {
    return rawWires.map((wire) => {
      const isCurrentActive =
        (isLedOn &&
          (wire.toKey === "led_1" ||
            wire.fromKey === "led_1" ||
            wire.toKey === "resistor_1" ||
            wire.fromKey === "resistor_1")) ||
        ((buttonPressed || buttonToggled) &&
          (wire.toKey === "button_1" || wire.fromKey === "button_1")) ||
        (isBuzzerOn && (wire.toKey === "buzzer_1" || wire.fromKey === "buzzer_1"));

      return {
        ...wire,
        isCurrentActive,
      };
    });
  }, [rawWires, isLedOn, buttonPressed, buttonToggled, isBuzzerOn]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || !isStepMode || steps.length === 0) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsAutoPlaying(false);
          return prev;
        }
      });
    }, autoPlaySpeed);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isStepMode, autoPlaySpeed, steps.length]);

  // Keyboard navigation for step simulation
  useEffect(() => {
    if (!isStepMode) return;
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        setIsAutoPlaying(false);
        setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setIsAutoPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === " " && !e.target.closest("button")) {
        e.preventDefault();
        setIsAutoPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStepMode, steps.length]);

  const canvasWidth = 920;
  const canvasHeight = 460;

  const activeWireObj = wires.find((w) => w.id === hoveredWireId);

  return (
    <div className="wokwi-canvas-container">
      {/* Top Header Bar */}
      <div className="wokwi-canvas-bar">
        <div className="flex items-center gap-3">
          <span className="wokwi-canvas-chip">
            <span className="wokwi-chip-dot" />
            <span>CIRCUIT BLUEPRINT</span>
          </span>
          <h2 className="text-sm font-bold text-amber-200/95 tracking-wide truncate max-w-sm drop-shadow-[0_1px_8px_rgba(245,158,11,0.2)]">
            {circuit?.title || "ESP32 Hardware Circuit Diagram"}
          </h2>
          <span className="text-[11px] text-amber-500/80 font-mono font-semibold hidden md:inline">
            • {activeComponents.length} Components • {wires.length} Connections
          </span>
        </div>

        {/* Mode Switcher: Step-by-Step vs Full Circuit */}
        <div className="flex items-center gap-2">
          <div className="circuit-mode-switcher">
            <button
              type="button"
              className={`circuit-mode-btn ${isStepMode ? "active" : ""}`}
              onClick={() => setIsStepMode(true)}
              title="Interactive step-by-step assembly walkthrough"
            >
              <Sparkles size={11} />
              <span>Step-by-Step Assembly</span>
            </button>
            <button
              type="button"
              className={`circuit-mode-btn ${!isStepMode ? "active" : ""}`}
              onClick={() => {
                setIsStepMode(false);
                setIsAutoPlaying(false);
              }}
              title="View complete interactive circuit directly"
            >
              <Zap size={11} />
              <span>Full Circuit</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              className="canvas-zoom-btn"
              onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="canvas-zoom-val">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              className="canvas-zoom-btn"
              onClick={() => setZoomLevel((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                className="canvas-reset-btn"
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom to 100%"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clean, Simple Step-by-Step Navigation Bar (No bulky explanation box or pills) */}
      {isStepMode && currentStep && (
        <div className="wokwi-simple-stepper">
          {/* Subtle Step Progress Line */}
          <div className="simple-stepper-progress">
            <div
              className="simple-stepper-progress-fill"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="simple-stepper-inner">
            {/* Primary Prev & Next Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="simple-step-btn prev"
                disabled={currentStepIndex === 0}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                }}
                title="Previous Step (Left Arrow)"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <div className="simple-step-info">
                <span className="simple-step-pill">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <span className="simple-step-title">
                  {currentStep.shortTitle || currentStep.title}
                </span>
                {isCircuitCompleted && (
                  <span className="simple-complete-chip">
                    <Check size={11} /> Complete ⚡
                  </span>
                )}
              </div>

              <button
                type="button"
                className="simple-step-btn next"
                disabled={currentStepIndex === steps.length - 1}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                }}
                title="Next Step (Right Arrow)"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Quick Actions (Restart & Auto-Play) */}
            <div className="simple-stepper-actions">
              <button
                type="button"
                className="simple-action-btn"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIndex(0);
                }}
                title="Restart assembly from Step 1"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Restart</span>
              </button>

              <button
                type="button"
                className={`simple-action-btn ${isAutoPlaying ? "active" : ""}`}
                onClick={() => setIsAutoPlaying((p) => !p)}
                title={isAutoPlaying ? "Pause (Spacebar)" : "Auto Play (Spacebar)"}
              >
                {isAutoPlaying ? <Pause size={13} /> : <Play size={13} className="fill-amber-400" />}
                <span className="hidden sm:inline">{isAutoPlaying ? "Pause" : "Auto Play"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Hardware Runtime Toolbar */}
      <div className="wokwi-live-toolbar">
        <div className="flex items-center gap-2.5">
          <div className="live-status-pill">
            <span
              className={`live-pulse-dot ${
                isStepMode && currentStep && !currentStep.isLiveSimulation
                  ? ""
                  : isLedOn
                  ? "active"
                  : ""
              }`}
            />
            <span className="text-xs font-bold text-amber-300">
              {isStepMode && currentStep && !currentStep.isLiveSimulation
                ? `ASSEMBLY STEP ${currentStepIndex + 1}/${steps.length}:`
                : "LIVE HARDWARE RUNTIME:"}
            </span>
            <span
              className={`text-xs font-bold font-mono ${
                isStepMode && currentStep && !currentStep.isLiveSimulation
                  ? "text-amber-400/80"
                  : isLedOn
                  ? "text-emerald-400"
                  : "text-amber-500/70"
              }`}
            >
              {isStepMode && currentStep && !currentStep.isLiveSimulation
                ? "POWER STANDBY"
                : isLedOn
                ? "LED [ON 🟢]"
                : "LED [OFF ⚫]"}
            </span>
          </div>

          {isBuzzerOn && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold animate-pulse">
              <Volume2 size={13} className="text-red-400" />
              <span>BUZZER ALARM ACTIVE (85dB)</span>
            </div>
          )}
        </div>

        {/* Dynamic Hardware Interaction Triggers */}
        <div className="flex items-center gap-2">
          {isButtonCircuit && (
            <button
              type="button"
              className={`interactive-trigger-btn ${
                buttonPressed || buttonToggled ? "pressed" : ""
              }`}
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
              onClick={() => setButtonToggled((t) => !t)}
              title="Click or press down to trigger GPIO4 input"
            >
              <Radio size={13} />
              <span>
                {buttonPressed || buttonToggled
                  ? "Release Pushbutton (HIGH)"
                  : "Click Pushbutton (LOW)"}
              </span>
            </button>
          )}

          {isUltrasonicCircuit && (
            <div className="flex items-center gap-2.5 bg-[#17101e] border border-amber-500/25 px-3 py-1 rounded-md text-xs">
              <span className="text-amber-400 font-mono font-semibold">Sonar Distance:</span>
              <span
                className={`font-bold font-mono ${
                  ultrasonicDistance < 15 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {ultrasonicDistance} cm {ultrasonicDistance < 15 ? "(ALARM)" : "(SAFE)"}
              </span>
              <input
                type="range"
                min="3"
                max="35"
                value={ultrasonicDistance}
                onChange={(e) => setUltrasonicDistance(Number(e.target.value))}
                className="w-24 accent-amber-400 cursor-pointer h-1.5 bg-zinc-700 rounded"
                title="Adjust distance to trigger alarm threshold (<15cm)"
              />
            </div>
          )}

          {isJoystickCircuit && (
            <div className="flex items-center gap-2 text-xs font-mono bg-[#17101e] border border-amber-500/25 px-2.5 py-1 rounded-md">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Gamepad2 size={13} />
                <span>Thumbstick:</span>
              </span>
              <span className="text-amber-200 font-medium">
                X:{Math.round(joystickState.x * 100)}% Y:
                {Math.round(joystickState.y * 100)}%
              </span>
              <button
                type="button"
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  joystickState.pressed
                    ? "bg-amber-400 text-black shadow-sm"
                    : "bg-zinc-800 text-amber-300 hover:text-white"
                }`}
                onClick={() =>
                  setJoystickState((s) => ({ ...s, pressed: !s.pressed }))
                }
              >
                {joystickState.pressed ? "SEL Pressed" : "Click SEL"}
              </button>
            </div>
          )}

          {!isButtonCircuit && !isUltrasonicCircuit && !isJoystickCircuit && (
            <button
              type="button"
              className="interactive-trigger-btn"
              onClick={() => setBlinkTick((b) => !b)}
            >
              <Zap size={13} />
              <span>Toggle LED ({blinkTick ? "ON" : "OFF"})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Artboard Scroll Viewport */}
      <div className="wokwi-viewport-scroll" ref={canvasRef}>
        <div
          className="wokwi-artboard"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
          }}
        >
          {/* Authentic Wokwi PCB Dot Grid */}
          <div className="wokwi-grid-layer" />

          {/* SVG Wires & Pin Solder Dots Layer */}
          <svg
            className="wokwi-wires-svg"
            width={canvasWidth}
            height={canvasHeight}
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          >
            <defs>
              <filter id="wire-glow-subtle" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
              <filter id="current-pulse-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Wire traces */}
            {wires.map((wire) => {
              const isWireVisible = !isStepMode || currentStep?.visibleWireIds?.has(wire.id);
              if (!isWireVisible) return null;

              const isHovered = hoveredWireId === wire.id;
              const isDimmed = hoveredWireId && !isHovered;
              const isFocusedWire = isStepMode && currentStep?.focusedWireId === wire.id;

              return (
                <g
                  key={wire.id}
                  className={`wokwi-wire-group ${isFocusedWire ? "wire-focus-active" : ""}`}
                  onMouseEnter={() => setHoveredWireId(wire.id)}
                  onMouseLeave={() => setHoveredWireId(null)}
                  style={{ opacity: isDimmed ? 0.25 : 1, transition: "opacity 0.2s" }}
                >
                  {/* Outer dark shadow stroke for 3D depth and contrast */}
                  <path
                    d={wire.pathData}
                    fill="none"
                    stroke="#0a0a0f"
                    strokeWidth={isHovered ? 7.5 : wire.isCurrentActive || isFocusedWire ? 6 : 5}
                    strokeLinecap="round"
                    strokeOpacity="0.88"
                  />

                  {/* Core colorful jumper wire */}
                  <path
                    d={wire.pathData}
                    fill="none"
                    stroke={wire.color}
                    strokeWidth={isHovered ? 4.5 : wire.isCurrentActive ? 3.6 : isFocusedWire ? 3.8 : 2.8}
                    strokeLinecap="round"
                    className={isFocusedWire ? "wire-drawing-anim" : ""}
                    filter={wire.isCurrentActive ? "url(#current-pulse-glow)" : "url(#wire-glow-subtle)"}
                  />

                  {/* Start Pin - Authentic through-hole solder eyelet */}
                  <circle
                    cx={wire.p1.x}
                    cy={wire.p1.y}
                    r={isHovered || isFocusedWire ? 5.5 : 4}
                    fill="#18181b"
                    stroke={wire.color}
                    strokeWidth={isHovered || isFocusedWire ? 2.5 : 1.8}
                  />
                  <circle
                    cx={wire.p1.x}
                    cy={wire.p1.y}
                    r={isHovered || isFocusedWire ? 2.2 : 1.4}
                    fill={isHovered || isFocusedWire ? "#fbbf24" : "#09090b"}
                  />

                  {/* End Pin - Authentic through-hole solder eyelet */}
                  <circle
                    cx={wire.p2.x}
                    cy={wire.p2.y}
                    r={isHovered || isFocusedWire ? 5.5 : 4}
                    fill="#18181b"
                    stroke={wire.color}
                    strokeWidth={isHovered || isFocusedWire ? 2.5 : 1.8}
                  />
                  <circle
                    cx={wire.p2.x}
                    cy={wire.p2.y}
                    r={isHovered || isFocusedWire ? 2.2 : 1.4}
                    fill={isHovered || isFocusedWire ? "#fbbf24" : "#09090b"}
                  />

                  <title>{wire.fullLabel}</title>
                </g>
              );
            })}

            {/* Glowing ripple pulse on active pins for the current wiring step */}
            {isStepMode && currentStep?.pinCallouts?.map((callout, cIdx) => (
              <g key={`pin-solder-glow-${cIdx}`}>
                <circle
                  cx={callout.x}
                  cy={callout.y}
                  r="7"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className="solder-pin-pulse"
                />
                <circle
                  cx={callout.x}
                  cy={callout.y}
                  r="3.5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>

          {/* Hardware Elements Layer (Authentic Silkscreen + Interactive Click Handlers) */}
          <div className="wokwi-components-layer">
            {/* 1. ESP32 DevKit Board */}
            {(!isStepMode || currentStep?.visibleCompIds?.has("esp32")) && layout["esp32"] && (
              <div
                className={`part-container esp32-container ${
                  isStepMode && currentStep?.focusedCompId === "esp32" ? "part-newly-placed" : ""
                }`}
                style={{
                  left: `${layout["esp32"].x}px`,
                  top: `${layout["esp32"].y}px`,
                  width: `${layout["esp32"].width}px`,
                  height: `${layout["esp32"].height}px`,
                }}
              >
                {isStepMode && currentStep?.focusedCompId === "esp32" && (
                  <div className="component-spotlight-box" />
                )}
                <wokwi-esp32-devkit-v1 ledPower="" />
                <span className="component-silkscreen-label placement-bottom">
                  ESP32 DevKit V1
                </span>
              </div>
            )}

            {/* 2. Connected Hardware Components with Real-time Interactive Logic */}
            {activeComponents.map((comp) => {
              const isCompVisible = !isStepMode || currentStep?.visibleCompIds?.has(comp.id);
              if (!isCompVisible) return null;

              const isFocused = isStepMode && currentStep?.focusedCompId === comp.id;
              const pos = layout[comp.id];
              if (!pos) return null;
              const cat = getCompCategory(comp.type);

              return (
                <div
                  key={comp.id}
                  className={`part-container ${
                    cat === "led" && isLedOn ? "led-glowing-active" : ""
                  } ${isFocused ? "part-newly-placed" : ""}`}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                  }}
                >
                  {isFocused && <div className="component-spotlight-box" />}
                  {/* Pushbutton: Interactive Click/Hold */}
                  {cat === "pushbutton" && (
                    <div
                      className="relative flex flex-col items-center part-clickable"
                      title="Click or Hold Pushbutton to toggle LED"
                      onMouseDown={() => setButtonPressed(true)}
                      onMouseUp={() => setButtonPressed(false)}
                      onClick={() => setButtonToggled((t) => !t)}
                    >
                      <wokwi-pushbutton
                        ref={(el) => {
                          if (el) {
                            el.onbuttonpress = () => setButtonPressed(true);
                            el.onbuttonrelease = () => setButtonPressed(false);
                          }
                        }}
                        color="red"
                      />
                      <span
                        className={`interactive-click-hint ${
                          buttonPressed || buttonToggled ? "hint-active" : "hint-idle"
                        }`}
                      >
                        {buttonPressed || buttonToggled ? "● PRESSED" : "○ CLICK ME"}
                      </span>
                    </div>
                  )}

                  {/* Resistor */}
                  {cat === "resistor" && <wokwi-resistor value={comp.value || "220"} />}

                  {/* LED: Dynamic Live Glow with Click Toggle */}
                  {cat === "led" && (
                    <div
                      className="relative flex flex-col items-center part-clickable"
                      title="Click to toggle LED"
                      onClick={() => setButtonToggled((t) => !t)}
                    >
                      <wokwi-led
                        ref={(el) => {
                          if (el) el.value = isLedOn;
                        }}
                        color={comp.color || "red"}
                      />
                      <span
                        className={`interactive-click-hint ${
                          isLedOn ? "hint-active" : "hint-idle"
                        }`}
                      >
                        {isLedOn ? "● LED: ON" : "○ LED: OFF"}
                      </span>
                    </div>
                  )}

                  {/* Ultrasonic HC-SR04: Click to Toggle Alarm Distance */}
                  {cat === "ultrasonic" && (
                    <div
                      className="relative flex flex-col items-center part-clickable"
                      title="Click to toggle distance between 10cm (Alarm) and 25cm (Safe)"
                      onClick={() =>
                        setUltrasonicDistance((d) => (d < 15 ? 25 : 10))
                      }
                    >
                      <wokwi-hc-sr04 />
                      <span
                        className={`interactive-click-hint ${
                          ultrasonicDistance < 15 ? "hint-active" : "hint-idle"
                        }`}
                      >
                        {ultrasonicDistance < 15
                          ? `● ${ultrasonicDistance}cm (ALARM)`
                          : `○ ${ultrasonicDistance}cm (SAFE)`}
                      </span>
                    </div>
                  )}

                  {/* Piezo Buzzer: Acoustic Soundwave Animation */}
                  {cat === "buzzer" && (
                    <div className="relative flex flex-col items-center">
                      {isBuzzerOn && <span className="buzzer-active-ring" />}
                      <wokwi-buzzer />
                      <span
                        className={`interactive-click-hint ${
                          isBuzzerOn ? "hint-active" : "hint-idle"
                        }`}
                      >
                        {isBuzzerOn ? "● ALARM ON" : "○ SILENT"}
                      </span>
                    </div>
                  )}

                  {/* Analog Joystick: Interactive Thumbstick Drag/Click */}
                  {cat === "joystick" && (
                    <div className="relative flex flex-col items-center">
                      <wokwi-analog-joystick
                        ref={(el) => {
                          if (el) {
                            el.oninput = () => {
                              setJoystickState({
                                x: el.xValue || 0,
                                y: el.yValue || 0,
                                pressed: el.pressed || false,
                              });
                            };
                            el.onbuttonpress = () =>
                              setJoystickState((s) => ({ ...s, pressed: true }));
                            el.onbuttonrelease = () =>
                              setJoystickState((s) => ({ ...s, pressed: false }));
                          }
                        }}
                      />
                      <span
                        className={`interactive-click-hint ${
                          isLedOn ? "hint-active" : "hint-idle"
                        }`}
                      >
                        {isLedOn ? "● DEFLECTED (ALERT)" : "○ CENTER"}
                      </span>
                    </div>
                  )}

                  <span className="component-silkscreen-label placement-top">
                    {comp.name || comp.type?.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Pin Callout Badges Hovering Directly Over Physical Pins */}
          {isStepMode &&
            currentStep?.pinCallouts?.map((callout, cIdx) => {
              let badgeStyle = {
                left: `${callout.x}px`,
                top: `${callout.y - 14}px`,
              };
              let arrowClass = "arrow-down";

              if (callout.dir && callout.dir[1] > 0) {
                badgeStyle = {
                  left: `${callout.x}px`,
                  top: `${callout.y + 14}px`,
                  transform: "translate(-50%, 0)",
                };
                arrowClass = "arrow-up";
              } else if (callout.dir && callout.dir[0] > 0) {
                badgeStyle = {
                  left: `${callout.x + 8}px`,
                  top: `${callout.y - 12}px`,
                  transform: "translate(0, -50%)",
                };
                arrowClass = "arrow-left";
              } else if (callout.dir && callout.dir[0] < 0) {
                badgeStyle = {
                  left: `${callout.x - 8}px`,
                  top: `${callout.y - 12}px`,
                  transform: "translate(-100%, -50%)",
                };
                arrowClass = "arrow-right";
              }

              return (
                <div
                  key={`pin-callout-badge-${cIdx}`}
                  className={`canvas-pin-callout-badge ${arrowClass}`}
                  style={badgeStyle}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span>
                    {callout.compName}:{" "}
                    <strong className="text-white font-mono">{callout.pin}</strong>
                  </span>
                </div>
              );
            })}

          {/* Interactive Floating Wire Inspection HUD */}
          {activeWireObj && (
            <div className="wire-hud-banner">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeWireObj.color }}
              />
              <span className="text-amber-300 font-extrabold">Net #{activeWireObj.num}:</span>
              <span className="text-amber-100 font-mono font-bold">
                {activeWireObj.fullLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Verified Netlist Wiring Guide Table */}
      <div className="wokwi-netlist-drawer">
        <div className="netlist-drawer-header">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-400" />
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Verified Pinout Netlist Guide
            </span>
          </div>
          <span className="text-[11px] text-amber-500/80 font-mono font-medium">
            {isStepMode
              ? "Click any net to jump directly to that wiring step"
              : "Hover any row to highlight the wire on the diagram"}
          </span>
        </div>

        <div className="netlist-table-scroll">
          <table className="netlist-table">
            <thead>
              <tr>
                <th className="w-12">Net</th>
                <th className="w-20">Wire</th>
                <th>From (Source Pin)</th>
                <th className="w-8 text-center">➔</th>
                <th>To (Destination Pin)</th>
                <th>Electrical Function &amp; Live Status</th>
              </tr>
            </thead>
            <tbody>
              {wires.map((wire) => {
                const isHovered = hoveredWireId === wire.id;
                const isWireInStep = !isStepMode || currentStep?.visibleWireIds?.has(wire.id);
                const isCurrentStepWire = isStepMode && currentStep?.focusedWireId === wire.id;
                const stepTargetIndex = steps.findIndex((s) => s.focusedWireId === wire.id);

                return (
                  <tr
                    key={wire.id}
                    className={`netlist-row ${
                      isHovered || isCurrentStepWire ? "row-highlight" : ""
                    } ${isCurrentStepWire ? "bg-amber-500/20 border-l-4 border-amber-400 font-bold" : ""} ${
                      !isWireInStep ? "opacity-35" : ""
                    }`}
                    onMouseEnter={() => setHoveredWireId(wire.id)}
                    onMouseLeave={() => setHoveredWireId(null)}
                    onClick={() => {
                      if (isStepMode && stepTargetIndex !== -1) {
                        setCurrentStepIndex(stepTargetIndex);
                        setIsAutoPlaying(false);
                      }
                    }}
                    title={
                      isStepMode && stepTargetIndex !== -1
                        ? `Click to jump to Step ${stepTargetIndex + 1} (${wire.fromComp} ➔ ${wire.toComp})`
                        : undefined
                    }
                  >
                    <td className="font-mono text-amber-500 font-bold">#{wire.num}</td>
                    <td>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: wire.color }}
                        />
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-amber-100">{wire.fromComp}</span>{" "}
                      <span className="pin-highlight-chip">{wire.fromPin}</span>
                    </td>
                    <td className="text-amber-500 font-mono text-center font-bold">➔</td>
                    <td>
                      <span className="font-bold text-amber-100">{wire.toComp}</span>{" "}
                      <span className="pin-highlight-chip">{wire.toPin}</span>
                    </td>
                    <td className="text-amber-200/85 text-xs font-medium">
                      <div className="flex items-center justify-between gap-3">
                        <span>
                          {wire.fromPin.includes("GND") || wire.toPin.includes("GND")
                            ? "Common Ground Return (0.0V GND)"
                            : wire.fromPin.includes("5V") ||
                              wire.toPin.includes("5V") ||
                              wire.fromPin.includes("VCC") ||
                              wire.toPin.includes("VCC")
                            ? "5V DC Power Rail"
                            : wire.fromPin.includes("VERT") ||
                              wire.toPin.includes("VERT") ||
                              wire.fromPin.includes("34") ||
                              wire.toPin.includes("34")
                            ? "Analog ADC Y-Axis Deflection (0–4095, 12-Bit ADC1)"
                            : wire.fromPin.includes("HORZ") ||
                              wire.toPin.includes("HORZ") ||
                              wire.fromPin.includes("35") ||
                              wire.toPin.includes("35")
                            ? "Analog ADC X-Axis Deflection (0–4095, 12-Bit ADC1)"
                            : wire.fromPin.includes("SEL") ||
                              wire.toPin.includes("SEL")
                            ? "Joystick Integrated Select Button (Active LOW)"
                            : wire.fromPin.includes("TRIG") || wire.toPin.includes("TRIG")
                            ? "10µs Ultrasonic Sonar Trigger Pulse"
                            : wire.fromPin.includes("ECHO") || wire.toPin.includes("ECHO")
                            ? "Ultrasonic Sonar Pulse-Width Echo Input"
                            : wire.fromPin.includes("BUZZER") ||
                              wire.toPin.includes("+") ||
                              wire.fromPin.includes("16")
                            ? "Piezo Acoustic Warning Output"
                            : wire.fromPin.includes("4") || wire.toPin.includes("1")
                            ? "Tactile Input Interrupt (Active LOW)"
                            : `Current-Limited GPIO Output ${
                                wire.isCurrentActive ? "⚡ (ACTIVE HIGH: 3.3V)" : "⚫ (STANDBY: 0.0V)"
                              }`}
                        </span>

                        {isStepMode && (
                          <span className="shrink-0">
                            {isCurrentStepWire ? (
                              <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-extrabold bg-amber-400 text-black shadow-sm flex items-center gap-1 animate-pulse">
                                ● CURRENT STEP
                              </span>
                            ) : isWireInStep ? (
                              <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                ✓ CONNECTED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                                ⏳ PENDING
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
