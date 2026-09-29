/**
 * Standard component layout profiles.
 * Defines dimensions and relative pin coordinate offsets for common IoT parts.
 */
export const COMPONENT_PROFILES = {
  esp32: {
    width: 220,
    height: 280,
    pins: {
      "3V3": { x: 220, y: 30 },
      GPIO2: { x: 220, y: 55 },
      GPIO4: { x: 220, y: 80 },
      GPIO5: { x: 220, y: 105 },
      GPIO12: { x: 220, y: 130 },
      GPIO13: { x: 220, y: 155 },
      GPIO14: { x: 220, y: 180 },
      GPIO16: { x: 220, y: 205 },
      GPIO18: { x: 220, y: 230 },
      GPIO21: { x: 220, y: 255 },
      GPIO22: { x: 220, y: 280 },
      GPIO25: { x: 220, y: 305 },
      GPIO26: { x: 220, y: 330 },
      GND: { x: 220, y: 355 },
      "5V": { x: 220, y: 380 },
      VIN: { x: 220, y: 380 },
    },
  },
  ultrasonic: {
    width: 160,
    height: 90,
    pins: {
      VCC: { x: 30, y: 90 },
      TRIG: { x: 65, y: 90 },
      ECHO: { x: 100, y: 90 },
      GND: { x: 135, y: 90 },
    },
  },
  sensor: {
    width: 160,
    height: 90,
    pins: {
      VCC: { x: 30, y: 90 },
      TRIG: { x: 65, y: 90 },
      ECHO: { x: 100, y: 90 },
      GND: { x: 135, y: 90 },
    },
  },
  buzzer: {
    width: 70,
    height: 70,
    radius: 34,
    pins: {
      "+": { x: -34, y: 0 },
      "-": { x: 34, y: 0 },
      "1": { x: -34, y: 0 },
      "2": { x: 34, y: 0 },
      VCC: { x: -34, y: 0 },
      GND: { x: 34, y: 0 },
    },
  },
  resistor: {
    width: 120,
    height: 35,
    pins: {
      "1": { x: 0, y: 17 },
      "2": { x: 120, y: 17 },
      pin1: { x: 0, y: 17 },
      pin2: { x: 120, y: 17 },
      A: { x: 0, y: 17 },
      B: { x: 120, y: 17 },
    },
  },
  led: {
    radius: 30,
    pins: {
      anode: { x: -30, y: 0 },
      cathode: { x: 30, y: 0 },
      A: { x: -30, y: 0 },
      K: { x: 30, y: 0 },
      "+": { x: -30, y: 0 },
      "-": { x: 30, y: 0 },
      "1": { x: -30, y: 0 },
      "2": { x: 30, y: 0 },
    },
  },
  button: {
    width: 75,
    height: 75,
    pins: {
      "1": { x: 0, y: 37 },
      "2": { x: 75, y: 37 },
      "1.l": { x: 0, y: 37 },
      "2.l": { x: 75, y: 37 },
      pin1: { x: 0, y: 37 },
      pin2: { x: 75, y: 37 },
    },
  },
  pushbutton: {
    width: 75,
    height: 75,
    pins: {
      "1": { x: 0, y: 37 },
      "2": { x: 75, y: 37 },
      "1.l": { x: 0, y: 37 },
      "2.l": { x: 75, y: 37 },
    },
  },
  generic: {
    width: 130,
    height: 80,
    pins: {},
  },
};

/**
 * Resolves or auto-generates visual coordinates for ANY arbitrary circuit data.
 * Dynamically accommodates 1, 2, 3+ LEDs, resistors, buttons, sensors, and any pin combo.
 */
export function resolveCircuitLayout(circuit) {
  const layout = {};

  if (!circuit) return layout;

  const boardId = circuit.board?.id || "esp32";
  const connections = circuit.connections || [];
  const components = circuit.components || [];

  // 1. DYNAMICALLY SCAN ALL BOARD PINS FROM CONNECTIONS
  const boardPinsUsed = new Set();
  connections.forEach((conn) => {
    if (conn.from?.component === boardId && conn.from?.pin) {
      boardPinsUsed.add(String(conn.from.pin));
    }
    if (conn.to?.component === boardId && conn.to?.pin) {
      boardPinsUsed.add(String(conn.to.pin));
    }
  });

  // Always ensure standard pins are present for context
  ["GPIO2", "GND", "3V3"].forEach((p) => boardPinsUsed.add(p));

  // Build the dynamic pin layout for the ESP32
  const esp32Pins = {};
  const sortedPins = Array.from(boardPinsUsed);

  sortedPins.forEach((pinName, idx) => {
    // If standard pin profile exists, use it as baseline
    if (COMPONENT_PROFILES.esp32.pins[pinName]) {
      esp32Pins[pinName] = { ...COMPONENT_PROFILES.esp32.pins[pinName] };
    } else {
      // Dynamically calculate vertical slot on right edge of board
      esp32Pins[pinName] = {
        x: 220,
        y: 35 + idx * 28,
      };
    }
  });

  // Expand board height to accommodate all pins comfortably
  const requiredBoardHeight = Math.max(260, Object.keys(esp32Pins).length * 28 + 45);

  layout[boardId] = {
    x: 50,
    y: 50,
    width: 220,
    height: requiredBoardHeight,
    pins: esp32Pins,
  };

  // 2. DYNAMIC COMPONENT PLACEMENT (STAGGERED MULTI-COLUMN)
  let resCount = 0;
  let ledCount = 0;
  let btnCount = 0;
  let sensorCount = 0;
  let otherCount = 0;

  components.forEach((comp) => {
    const rawType = (comp.type || "").toLowerCase();
    let profileKey = "generic";

    if (rawType.includes("ultrasonic") || rawType.includes("sonar")) profileKey = "ultrasonic";
    else if (rawType.includes("buzzer") || rawType.includes("piezo")) profileKey = "buzzer";
    else if (rawType.includes("resistor")) profileKey = "resistor";
    else if (rawType.includes("led")) profileKey = "led";
    else if (rawType.includes("button") || rawType.includes("switch")) profileKey = "button";

    const profile = COMPONENT_PROFILES[profileKey] || COMPONENT_PROFILES.generic;

    let posX;
    let posY;

    if (profileKey === "ultrasonic") {
      posX = 370;
      posY = 35 + sensorCount * 120;
      sensorCount++;
    } else if (profileKey === "buzzer") {
      posX = 650;
      posY = 75 + otherCount * 110;
      otherCount++;
    } else if (profileKey === "button") {
      posX = 370;
      posY = 80 + btnCount * 100;
      btnCount++;
    } else if (profileKey === "resistor") {
      posX = 370;
      posY = 80 + btnCount * 80 + resCount * 90;
      resCount++;
    } else if (profileKey === "led") {
      posX = 650;
      posY = 85 + ledCount * 105;
      ledCount++;
    } else {
      posX = 500;
      posY = 240 + otherCount * 100;
      otherCount++;
    }

    // Dynamic pin registration for the component:
    // Ensures whatever pin names the backend sends (e.g. anode, 1, 2, A, K) are present in layout.pins
    const detectedPins = { ...(profile.pins || {}) };

    connections.forEach((conn) => {
      if (conn.from?.component === comp.id && conn.from?.pin) {
        const pin = String(conn.from.pin);
        if (!detectedPins[pin]) {
          // Normalize alias
          if (/anode|\+/i.test(pin)) detectedPins[pin] = { x: -30, y: 0 };
          else if (/cathode|-/i.test(pin)) detectedPins[pin] = { x: 30, y: 0 };
          else if (/1|a/i.test(pin)) detectedPins[pin] = { x: 0, y: (profile.height || 40) / 2 };
          else if (/2|b/i.test(pin)) detectedPins[pin] = { x: profile.width || 100, y: (profile.height || 40) / 2 };
          else detectedPins[pin] = { x: 0, y: 35 };
        }
      }

      if (conn.to?.component === comp.id && conn.to?.pin) {
        const pin = String(conn.to.pin);
        if (!detectedPins[pin]) {
          if (/anode|\+/i.test(pin)) detectedPins[pin] = { x: -30, y: 0 };
          else if (/cathode|-/i.test(pin)) detectedPins[pin] = { x: 30, y: 0 };
          else if (/1|a/i.test(pin)) detectedPins[pin] = { x: 0, y: (profile.height || 40) / 2 };
          else if (/2|b/i.test(pin)) detectedPins[pin] = { x: profile.width || 100, y: (profile.height || 40) / 2 };
          else detectedPins[pin] = { x: profile.width || 120, y: 35 };
        }
      }
    });

    layout[comp.id] = {
      x: posX,
      y: posY,
      ...profile,
      pins: detectedPins,
    };
  });

  return layout;
}

/**
 * Calculates a tight, snug SVG viewBox that maximizes the size of the components.
 * Eliminates excess empty black margins so the circuit appears large, crisp, and prominent.
 */
export function calculateCanvasBounds(layout, padding = 35) {
  const nodes = Object.values(layout);
  if (nodes.length === 0) return "0 0 800 400";

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const radius = node.radius || 0;
    const width = node.width || radius * 2 || 120;
    const height = node.height || radius * 2 || 120;

    const left = node.x - radius;
    const top = node.y - radius;
    const right = node.x + (node.radius ? radius : width);
    const bottom = node.y + (node.radius ? radius : height);

    if (left < minX) minX = left;
    if (top < minY) minY = top;
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  });

  // Generous margin for comfortable wire curves
  maxY += 60;

  const x = Math.max(0, Math.floor(minX - padding));
  const y = Math.max(0, Math.floor(minY - padding));
  const w = Math.ceil(maxX - minX + padding * 2);
  const h = Math.ceil(maxY - minY + padding * 2);

  return `${x} ${y} ${w} ${h}`;
}
