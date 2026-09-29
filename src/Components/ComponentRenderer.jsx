import ESP32Node from "./nodes/ESP32Node";
import ResistorNode from "./nodes/ResistorNode";
import LEDNode from "./nodes/LEDNode";
import UltrasonicNode from "./nodes/UltrasonicNode";
import BuzzerNode from "./nodes/BuzzerNode";
import ButtonNode from "./nodes/ButtonNode";
import GenericNode from "./nodes/GenericNode";

// Registry mapping component type names to their SVG node components
const COMPONENT_REGISTRY = {
  esp32: ESP32Node,
  resistor: ResistorNode,
  led: LEDNode,
  ultrasonic: UltrasonicNode,
  sensor: UltrasonicNode,
  buzzer: BuzzerNode,
  button: ButtonNode,
  pushbutton: ButtonNode,
  switch: ButtonNode,
};

function ComponentRenderer({ component, layout }) {
  if (!component) {
    return null;
  }

  // If layout is not defined, we provide a safe fallback so the app does not crash
  const effectiveLayout = layout || {
    x: 100,
    y: 100,
    width: 120,
    height: 70,
    pins: {},
  };

  const normalizedType = (component.type || "").toLowerCase();
  const SelectedNode = COMPONENT_REGISTRY[normalizedType] || GenericNode;

  return <SelectedNode component={component} layout={effectiveLayout} />;
}

export default ComponentRenderer;
