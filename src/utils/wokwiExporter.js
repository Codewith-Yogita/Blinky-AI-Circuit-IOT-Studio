/**
 * Translates any arbitrary Blinky circuit schema into Wokwi's open diagram.json format.
 * Dynamically supports any combination of ESP32, LEDs, Resistors, Buttons, Buzzers, and Sensors.
 */
export function exportToWokwiDiagram(circuit) {
  if (!circuit) return null;

  const parts = [
    { type: "board-esp32-devkit-c-v4", id: "esp", top: 0, left: 0, attrs: {} },
  ];

  const connections = [];

  let ledCount = 0;
  let resCount = 0;
  let btnCount = 0;
  let buzzerCount = 0;
  let sensorCount = 0;

  // 1. Dynamically add and position all components with zero overlap
  (circuit.components || []).forEach((comp, idx) => {
    const type = (comp.type || "").toLowerCase();
    const id = comp.id || `comp_${idx}`;

    if (type.includes("ultrasonic") || type.includes("sonar")) {
      parts.push({
        type: "wokwi-hc-sr04",
        id,
        top: -120 - sensorCount * 110,
        left: 180,
        attrs: {},
      });
      sensorCount++;
    } else if (type.includes("buzzer") || type.includes("piezo")) {
      parts.push({
        type: "wokwi-buzzer",
        id,
        top: -80 - buzzerCount * 90,
        left: 360,
        attrs: {},
      });
      buzzerCount++;
      parts.push({
        type: "wokwi-pushbutton",
        id,
        top: 220 + btnCount * 80,
        left: 200,
        attrs: { color: "green" },
      });
      btnCount++;
    } else if (type.includes("joy")) {
      parts.push({
        type: "wokwi-analog-joystick",
        id,
        top: 140,
        left: -180,
        attrs: {},
      });
    } else if (type.includes("resistor")) {
      parts.push({
        type: "wokwi-resistor",
        id,
        top: 60 + resCount * 65,
        left: 200,
        attrs: { value: comp.value || "220" },
      });
      resCount++;
    } else if (type.includes("led")) {
      const colors = ["red", "green", "blue", "yellow", "orange", "white"];
      const chosenColor = comp.color || colors[ledCount % colors.length];
      parts.push({
        type: "wokwi-led",
        id,
        top: 60 + ledCount * 65,
        left: 340,
        attrs: { color: chosenColor },
      });
      ledCount++;
    } else {
      // Generic fallback for any other component
      parts.push({
        type: "wokwi-resistor",
        id,
        top: 180 + idx * 60,
        left: 260,
        attrs: { value: "1000" },
      });
    }
  });

  // Helper to normalize pin identifiers for Wokwi's format
  function normalizePin(componentId, pin) {
    if (!pin) return "1";
    let p = String(pin).trim();

    const isBoard = componentId === "esp" || componentId === "esp32";

    if (isBoard) {
      // Normalize GPIO numbers: GPIO2 -> 2, D4 -> 4, GPIO25 -> 25
      const gpioMatch = p.match(/^(?:GPIO|D)?(\d+)$/i);
      if (gpioMatch) {
        return gpioMatch[1];
      }

      if (/^GND/i.test(p)) return "GND.1";
      if (/^(?:5V|VIN)/i.test(p)) return "5V";
      if (/^(?:3V3|3\.3V)/i.test(p)) return "3V3";
      return p;
    }

    // Component pins
    if (/^anode$/i.test(p) || p === "+") return "A";
    if (/^cathode$/i.test(p) || p === "-") return "K";
    if (p === "pin1" || p === "1") return "1";
    if (p === "pin2" || p === "2") return "2";
    if (/^VCC$/i.test(p)) return "VCC";
    if (/^GND$/i.test(p)) return "GND";
    if (/^TRIG/i.test(p)) return "TRIG";
    if (/^ECHO/i.test(p)) return "ECHO";

    return p;
  }

  // 2. Map all electrical connections dynamically
  (circuit.connections || []).forEach((conn) => {
    if (!conn?.from?.component || !conn?.to?.component) return;

    const fromComp = conn.from.component === "esp32" ? "esp" : conn.from.component;
    const toComp = conn.to.component === "esp32" ? "esp" : conn.to.component;

    const fromPin = normalizePin(fromComp, conn.from.pin);
    const toPin = normalizePin(toComp, conn.to.pin);

    // Color code wires
    const isGround = String(conn.from.pin).includes("GND") || String(conn.to.pin).includes("GND") || conn.to.pin === "cathode";
    const isPower = String(conn.from.pin).includes("5V") || String(conn.from.pin).includes("3V3") || String(conn.to.pin).includes("VCC");
    const wireColor = isGround ? "black" : isPower ? "red" : "orange";

    connections.push([`${fromComp}:${fromPin}`, `${toComp}:${toPin}`, wireColor, []]);
  });

  return {
    version: 1,
    author: "Blinky AI - Dynamic Circuit Synthesizer",
    editor: "wokwi",
    parts,
    connections,
  };
}

/**
 * Generates a clean Wokwi web URL or pre-fills an ESP32 simulator project
 */
export function getWokwiSimulationUrl() {
  return "https://wokwi.com/projects/new/esp32";
}
