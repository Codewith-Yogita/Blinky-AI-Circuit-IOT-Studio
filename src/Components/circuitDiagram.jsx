import { useMemo, useState, useRef } from "react";
import {
  Cpu,
  Play,
  Layers,
  FileCode,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import Wire from "./wires";
import ComponentRenderer from "./ComponentRenderer";
import WokwiCircuitCanvas from "./WokwiCircuitCanvas";
import HardwareSimulator from "./HardwareSimulator";
import StudioCircuitStory from "./StudioCircuitStory";
import { resolveCircuitLayout, calculateCanvasBounds } from "../utils/layoutEngine";
import { exportToWokwiDiagram } from "../utils/wokwiExporter";

// Curated live Wokwi simulation project IDs matching our IoT presets
const WOKWI_PRESET_MAP = {
  water_level_alarm: "343594090247488082", // ESP32 + HC-SR04 Ultrasonic + Buzzer + 4 LEDs
  single_led: "441971812032999425",        // ESP32 DevKit V1 + LED Blink
  dual_led_button: "408056248585797633",   // ESP32 DevKit V1 + Push Button + LED
  oled_display: "305569420067603028",      // ESP32 DevKit V1 + SSD1306 OLED Display
};


function CircuitDiagram({ circuit, onProceedToCode }) {
  const [viewMode, setViewMode] = useState("circuit_story"); // 'circuit_story' | 'wokwi_circuit' | 'schematic' | 'diagram_json' | 'simulator' | 'wokwi_cloud'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedJson, setCopiedJson] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  // Determine matching Wokwi URL for any circuit (presets OR custom backend JSON)
  const wokwiProjectInfo = useMemo(() => {
    const circuitId = circuit?.id;
    const matchedId = WOKWI_PRESET_MAP[circuitId];

    if (matchedId) {
      return {
        url: `https://wokwi.com/projects/${matchedId}`,
        id: matchedId,
        title: circuit?.title || "ESP32 Hardware Simulation",
        isPreset: true,
      };
    }

    const comps = circuit?.components || [];
    const hasJoystick = comps.some(
      (c) => (c.type || "").toLowerCase().includes("joy")
    );
    const hasUltrasonic = comps.some(
      (c) => (c.type || "").toLowerCase().includes("ultrasonic") || (c.type || "").toLowerCase().includes("sensor")
    );
    const hasButton = comps.some(
      (c) => (c.type || "").toLowerCase().includes("button") || (c.type || "").toLowerCase().includes("switch")
    );
    const hasLed = comps.some((c) => (c.type || "").toLowerCase().includes("led"));

    if (hasJoystick) {
      return {
        url: `https://wokwi.com/projects/new/esp32`,
        id: "joystick_led_alarm",
        title: circuit?.title || "ESP32 Dual-Axis Joystick Controller",
        isPreset: false,
        heuristicMatch: "Dual-Axis Joystick & LED System",
      };
    }

    if (hasUltrasonic) {
      return {
        url: `https://wokwi.com/projects/${WOKWI_PRESET_MAP.water_level_alarm}`,
        id: WOKWI_PRESET_MAP.water_level_alarm,
        title: circuit?.title || "Custom ESP32 Sensor Circuit",
        isPreset: false,
        heuristicMatch: "Ultrasonic / Buzzer System",
      };
    }

    if (hasButton) {
      return {
        url: `https://wokwi.com/projects/${WOKWI_PRESET_MAP.dual_led_button}`,
        id: WOKWI_PRESET_MAP.dual_led_button,
        title: circuit?.title || "Custom ESP32 Button Controller",
        isPreset: false,
        heuristicMatch: "Pushbutton Controller",
      };
    }

    if (hasLed) {
      return {
        url: `https://wokwi.com/projects/${WOKWI_PRESET_MAP.single_led}`,
        id: WOKWI_PRESET_MAP.single_led,
        title: circuit?.title || "Custom ESP32 LED Circuit",
        isPreset: false,
        heuristicMatch: "ESP32 LED System",
      };
    }

    return {
      url: "https://wokwi.com/projects/new/esp32",
      id: "new",
      title: "Custom ESP32 Circuit",
      isPreset: false,
      heuristicMatch: "Blank ESP32 Project",
    };
  }, [circuit]);

  // Generate Wokwi diagram.json
  const wokwiJsonString = useMemo(() => {
    if (!circuit) return "{}";
    const diagram = exportToWokwiDiagram(circuit);
    return JSON.stringify(diagram, null, 2);
  }, [circuit]);

  // Schematic Layout calculations dynamically supporting any number of components and pins
  const layout = useMemo(() => {
    return resolveCircuitLayout(circuit);
  }, [circuit]);

  const baseViewBox = useMemo(() => {
    return calculateCanvasBounds(layout, 30);
  }, [layout]);

  const viewBox = useMemo(() => {
    const parts = baseViewBox.split(" ").map(Number);
    if (parts.length !== 4) return baseViewBox;
    const [x, y, w, h] = parts;

    if (zoomLevel === 1) return baseViewBox;

    const newW = w / zoomLevel;
    const newH = h / zoomLevel;
    const newX = x + (w - newW) / 2;
    const newY = y + (h - newH) / 2;

    return `${newX} ${newY} ${newW} ${newH}`;
  }, [baseViewBox, zoomLevel]);

  if (!circuit) {
    return (
      <div className="circuit-empty-state">
        <p>No circuit data available to display.</p>
      </div>
    );
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(wokwiJsonString);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleReloadFrame = () => {
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  function getPinPosition(endpoint) {
    const component = layout[endpoint.component];
    if (!component) return null;
    const pin = component.pins?.[endpoint.pin];
    if (!pin) {
      // Dynamic fallback if pin name casing differed
      const keys = Object.keys(component.pins || {});
      const matchedKey = keys.find(
        (k) => k.toLowerCase() === String(endpoint.pin).toLowerCase()
      );
      if (matchedKey) {
        return {
          x: component.x + component.pins[matchedKey].x,
          y: component.y + component.pins[matchedKey].y,
        };
      }
      return null;
    }
    return {
      x: component.x + pin.x,
      y: component.y + pin.y,
    };
  }

  function getWireColor(fromPin, toPin) {
    const f = String(fromPin || "").toUpperCase();
    const t = String(toPin || "").toUpperCase();

    const isGround =
      f.includes("GND") ||
      t.includes("GND") ||
      fromPin === "cathode" ||
      toPin === "cathode" ||
      fromPin === "-" ||
      toPin === "-" ||
      fromPin === "K" ||
      toPin === "K";

    const isPower =
      f.includes("VCC") ||
      t.includes("VCC") ||
      f.includes("3V3") ||
      t.includes("3V3") ||
      f.includes("5V") ||
      t.includes("5V") ||
      fromPin === "+" ||
      toPin === "+" ||
      fromPin === "anode" ||
      toPin === "anode" ||
      fromPin === "A" ||
      toPin === "A";

    if (isGround) return "#64748b";
    if (isPower) return "#ef4444";
    return "#f59e0b";
  }

  const wires = (circuit.connections || []).map((connection, index) => {
    const start = getPinPosition(connection.from);
    const end = getPinPosition(connection.to);
    if (!start || !end) return null;

    const color = getWireColor(connection.from.pin, connection.to.pin);
    const label = `${connection.from.component} (${connection.from.pin}) ➔ ${connection.to.component} (${connection.to.pin})`;

    return (
      <Wire
        key={`${connection.from.component}-${connection.to.component}-${index}`}
        start={start}
        end={end}
        color={color}
        label={label}
      />
    );
  });

  const boardComponent = circuit.board
    ? {
        id: circuit.board.id || "esp32",
        type: circuit.board.type || "ESP32",
        name: circuit.board.model || "ESP32 DevKit V1",
        ...circuit.board,
      }
    : null;

  const allComponents = [
    ...(boardComponent ? [boardComponent] : []),
    ...(circuit.components || []),
  ];

  return (
    <div className="wokwi-circuit-wrapper">
      {/* Top Wokwi Control & Mode Bar */}
      <div className="wokwi-toolbar">
        <div className="wokwi-toolbar-left">
          <span className="wokwi-badge">
            <span className="wokwi-dot" />
            <Cpu size={13} className="text-amber-400" />
            <span>WOKWI ESP32</span>
          </span>
          <span className="wokwi-title-text">{wokwiProjectInfo.title}</span>
        </div>

        {/* View Mode Switcher */}
        <div className="wokwi-view-toggle">
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "circuit_story" ? "active" : ""}`}
            onClick={() => setViewMode("circuit_story")}
            title="Interactive Circuit Build Story: watch the circuit assemble itself with animated Dupont wires and live current"
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Circuit Build Story</span>
          </button>
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "wokwi_circuit" ? "active" : ""}`}
            onClick={() => setViewMode("wokwi_circuit")}
            title="Clean Wokwi hardware circuit diagram rendered directly from backend JSON"
          >
            <Zap size={13} className="text-amber-400" />
            <span>Wokwi Circuit Diagram</span>
          </button>
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "schematic" ? "active" : ""}`}
            onClick={() => setViewMode("schematic")}
            title="Clean SVG Wiring Schematic with all custom pins"
          >
            <Layers size={13} />
            <span>Schematic Blueprint ({circuit.connections?.length || 0})</span>
          </button>
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "diagram_json" ? "active" : ""}`}
            onClick={() => setViewMode("diagram_json")}
            title="Wokwi diagram.json configuration"
          >
            <FileCode size={13} />
            <span>diagram.json</span>
          </button>
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "simulator" ? "active" : ""}`}
            onClick={() => setViewMode("simulator")}
            title="Interactive hardware simulation with slider controls and audio"
          >
            <Play size={13} />
            <span>Interactive Sim</span>
          </button>
          <button
            type="button"
            className={`wokwi-toggle-btn ${viewMode === "wokwi_cloud" ? "active" : ""}`}
            onClick={() => setViewMode("wokwi_cloud")}
            title="External Wokwi Cloud Simulator & IDE"
          >
            <ExternalLink size={13} />
            <span>Wokwi Cloud IDE</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="wokwi-toolbar-actions">
          {viewMode === "wokwi_cloud" && (
            <button
              type="button"
              className="wokwi-tool-btn"
              onClick={handleReloadFrame}
              title="Reset and reload the cloud simulation"
            >
              <RotateCcw size={13} />
              <span>Reload Cloud</span>
            </button>
          )}

          <button
            type="button"
            className="wokwi-tool-btn copy"
            onClick={handleCopyJson}
            title="Copy Wokwi diagram.json for offline simulation"
          >
            {copiedJson ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>diagram.json</span>
              </>
            )}
          </button>

          <a
            href={wokwiProjectInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="wokwi-tool-btn external"
            title="Open simulation in new Wokwi tab"
          >
            <span>Open Wokwi</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Helpful banner for custom AI-synthesized circuits */}
      {!wokwiProjectInfo.isPreset && (
        <div className="custom-circuit-banner">
          <div className="custom-banner-left">
            <span className="custom-badge">
              <Sparkles size={11} className="inline mr-1" />
              AI DYNAMIC CIRCUIT
            </span>
            <span>
              Detected <strong>{circuit.components?.length || 0} Components</strong> &{" "}
              <strong>{circuit.connections?.length || 0} Pin Connections</strong>. Wokwi hardware
              components &amp; wires generated dynamically from backend JSON.
            </span>
          </div>
          <div className="custom-banner-actions">
            <button
              type="button"
              className="banner-switch-btn"
              onClick={() => setViewMode("wokwi_circuit")}
            >
              <Zap size={13} className="inline mr-1 text-amber-400" />
              View Wokwi Circuit
            </button>
            <button
              type="button"
              className="banner-copy-btn"
              onClick={handleCopyJson}
            >
              {copiedJson ? <Check size={13} className="inline mr-1 text-emerald-400" /> : <Copy size={13} className="inline mr-1" />}
              {copiedJson ? "Copied!" : "Copy diagram.json"}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODE 0: INTERACTIVE CIRCUIT BUILD STORY ================= */}
      {viewMode === "circuit_story" && (
        <StudioCircuitStory
          circuit={circuit}
          onProceedToCode={onProceedToCode}
          onSwitchToWokwi={() => setViewMode("wokwi_circuit")}
        />
      )}

      {/* ================= MODE 1: EXACT WOKWI CIRCUIT CANVAS ================= */}
      {viewMode === "wokwi_circuit" && (
        <WokwiCircuitCanvas circuit={circuit} />
      )}

      {/* ================= MODE 2: INTERACTIVE HARDWARE SIMULATOR ================= */}
      {viewMode === "simulator" && (
        <HardwareSimulator circuit={circuit} />
      )}

      {/* ================= MODE 2: WOKWI CLOUD IDE (EMBEDDED) ================= */}
      {viewMode === "wokwi_cloud" && (
        <div className="wokwi-iframe-container">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10 text-xs text-zinc-400">
            <span>🌐 Connected to Wokwi Cloud Virtual Runtime</span>
            <a
              href={wokwiProjectInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              Open in full browser window <ExternalLink size={11} />
            </a>
          </div>

          {!iframeLoaded && (
            <div className="wokwi-loading-overlay">
              <div className="wokwi-spinner" />
              <p>Connecting to Wokwi ESP32 Virtual Hardware...</p>
              <small>Interactive simulator loads in real-time with firmware and breadboard</small>
            </div>
          )}

          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={wokwiProjectInfo.url}
            title="Wokwi ESP32 Interactive Circuit"
            className="wokwi-iframe"
            onLoad={() => setIframeLoaded(true)}
            allow="clipboard-write; serial"
            allowFullScreen
          />
        </div>
      )}

      {/* ================= MODE 2: VISUAL SCHEMATIC ================= */}
      {viewMode === "schematic" && (
        <div className="circuit-wrapper">
          <div className="circuit-controls-bar">
            <span className="schematic-label">
              Dynamic Circuit Schematic • {circuit.components?.length || 0} Components •{" "}
              {circuit.connections?.length || 0} Active Wires
            </span>
            <div className="zoom-actions">
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                title="Zoom Out"
              >
                🔍 -
              </button>
              <span className="zoom-indicator">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                title="Zoom In"
              >
                🔍 +
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  className="zoom-reset-btn"
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <svg
            viewBox={viewBox}
            className="circuit"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" rx="8" />

            <g className="wires-layer">{wires}</g>

            <g className="components-layer">
              {allComponents.map((component) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  layout={layout[component.id]}
                />
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* ================= MODE 3: DIAGRAM.JSON VIEWER ================= */}
      {viewMode === "diagram_json" && (
        <div className="wokwi-json-container">
          <div className="wokwi-json-header">
            <span>Wokwi diagram.json (Ready for VS Code or Wokwi.com)</span>
            <button
              type="button"
              className="copy-json-btn"
              onClick={handleCopyJson}
            >
              {copiedJson ? "✓ Copied to Clipboard" : "📋 Copy JSON"}
            </button>
          </div>
          <pre className="wokwi-json-content">
            <code>{wokwiJsonString}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default CircuitDiagram;