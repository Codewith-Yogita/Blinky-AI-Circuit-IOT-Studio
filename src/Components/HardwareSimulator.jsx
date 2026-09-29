import { useState, useEffect, useRef, useMemo } from "react";
import "@wokwi/elements";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Terminal,
  Activity,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

/**
 * Native Interactive Virtual Hardware Simulator built with @wokwi/elements.
 * Provides photorealistic ESP32 and peripheral simulation directly in Blinky
 * without third-party website chrome, headers, or share buttons.
 */
export default function HardwareSimulator({ circuit }) {
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [distance, setDistance] = useState(12); // cm for ultrasonic
  const [buttonPressed, setButtonPressed] = useState(false);
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const [activeLedStates, setActiveLedStates] = useState({
    red: false,
    yellow: false,
    green: false,
    blue: false,
  });
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [tick, setTick] = useState(0);

  const audioCtxRef = useRef(null);
  const serialContainerRef = useRef(null);

  // Determine circuit preset type
  const circuitType = useMemo(() => {
    const id = circuit?.id || "";
    if (id.includes("water") || id.includes("distance") || id.includes("alarm")) {
      return "water_level_alarm";
    }
    if (id.includes("single") || id.includes("blink")) {
      return "single_led";
    }
    if (id.includes("button") || id.includes("switch")) {
      return "dual_led_button";
    }
    // Heuristic based on components
    const comps = circuit?.components || [];
    if (comps.some((c) => (c.type || "").toLowerCase().includes("ultrasonic"))) {
      return "water_level_alarm";
    }
    if (comps.some((c) => (c.type || "").toLowerCase().includes("button"))) {
      return "dual_led_button";
    }
    if (comps.some((c) => (c.type || "").toLowerCase().includes("led"))) {
      return "single_led";
    }
    return "water_level_alarm";
  }, [circuit]);

  // Audio buzzer generator
  const triggerBuzzerSound = (freq = 2400) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Add serial log entry
  const addSerialLog = (text) => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setSerialLogs((prev) => [...prev.slice(-30), `[${time}] ${text}`]);
  };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);

      if (circuitType === "water_level_alarm") {
        // Logic based on distance in cm
        const isCritical = distance < 15;
        const isWarning = distance >= 15 && distance < 30;
        const isSafe = distance >= 30 && distance < 80;
        const isFar = distance >= 80;

        if (isCritical) {
          // Flashing alarm
          setActiveLedStates((prev) => {
            const nextRed = !prev.red;
            if (nextRed) {
              triggerBuzzerSound(2600);
            }
            return {
              red: nextRed,
              yellow: false,
              green: false,
              blue: false,
            };
          });
          setBuzzerActive(true);
        } else if (isWarning) {
          setActiveLedStates({
            red: false,
            yellow: true,
            green: false,
            blue: false,
          });
          setBuzzerActive(false);
        } else if (isSafe) {
          setActiveLedStates({
            red: false,
            yellow: false,
            green: true,
            blue: false,
          });
          setBuzzerActive(false);
        } else {
          setActiveLedStates({
            red: false,
            yellow: false,
            green: false,
            blue: true,
          });
          setBuzzerActive(false);
        }
      } else if (circuitType === "single_led") {
        setBlinkPhase((b) => {
          const next = !b;
          setActiveLedStates({
            red: next,
            yellow: false,
            green: false,
            blue: false,
          });
          return next;
        });
      } else if (circuitType === "dual_led_button") {
        setActiveLedStates({
          red: false,
          yellow: false,
          green: false,
          blue: buttonPressed,
        });
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isRunning, distance, circuitType, buttonPressed, isMuted]);

  // Periodic serial log output
  useEffect(() => {
    if (!isRunning) return;

    const logTimer = setInterval(() => {
      if (circuitType === "water_level_alarm") {
        if (distance < 15) {
          addSerialLog(
            `ALERT: Distance = ${distance} cm | GPIO22 (Buzzer) -> HIGH | GPIO18 (Red LED) -> BLINK`
          );
        } else if (distance < 30) {
          addSerialLog(
            `WARN: Distance = ${distance} cm | GPIO5 (Yellow LED) -> HIGH`
          );
        } else if (distance < 80) {
          addSerialLog(
            `NORMAL: Distance = ${distance} cm | GPIO4 (Green LED) -> HIGH`
          );
        } else {
          addSerialLog(
            `CLEAR: Distance = ${distance} cm | GPIO19 (Blue LED) -> HIGH`
          );
        }
      } else if (circuitType === "single_led") {
        addSerialLog(
          `[ESP32 D0WDQ6] LED Pin GPIO2 -> ${blinkPhase ? "HIGH (3.3V)" : "LOW (0.0V)"}`
        );
      } else if (circuitType === "dual_led_button") {
        addSerialLog(
          `[GPIO14] Button State: ${buttonPressed ? "PRESSED (LOW) -> LED ON" : "RELEASED (HIGH) -> LED OFF"}`
        );
      }
    }, 1500);

    return () => clearInterval(logTimer);
  }, [isRunning, distance, circuitType, blinkPhase, buttonPressed]);

  // Auto-scroll serial logs strictly inside the terminal box, NEVER moving the page
  useEffect(() => {
    if (serialContainerRef.current) {
      serialContainerRef.current.scrollTop = serialContainerRef.current.scrollHeight;
    }
  }, [serialLogs]);

  // Reset simulator
  const handleReset = () => {
    setDistance(12);
    setButtonPressed(false);
    setSerialLogs([
      "[00:00:00] Blinky Hardware Simulator initialized.",
      "[00:00:00] ESP32 DevKit V1 booting firmware...",
      "[00:00:01] CPU0: Xtensa LX6 dual-core @ 240MHz ready.",
    ]);
  };

  return (
    <div className="hardware-simulator-root">
      {/* Top Simulator Control Bar */}
      <div className="sim-control-header">
        <div className="sim-header-left">
          <div className="sim-status-pill">
            <span className={`sim-indicator-dot ${isRunning ? "active" : "paused"}`} />
            <span className="sim-status-label">
              {isRunning ? "SIMULATION RUNNING" : "SIMULATION PAUSED"}
            </span>
          </div>
          <span className="sim-board-chip">
            <Zap size={12} className="text-amber-400" />
            ESP32 DevKit V1 (3.3V Silicon Logic)
          </span>
        </div>

        <div className="sim-header-actions">
          {/* Play/Pause Button */}
          <button
            type="button"
            className={`sim-btn ${isRunning ? "pause-btn" : "play-btn"}`}
            onClick={() => setIsRunning(!isRunning)}
            title={isRunning ? "Pause Simulation" : "Resume Simulation"}
          >
            {isRunning ? (
              <>
                <Pause size={13} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            className="sim-btn secondary"
            onClick={handleReset}
            title="Reset Simulation State"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* Audio Mute/Unmute */}
          {circuitType === "water_level_alarm" && (
            <button
              type="button"
              className={`sim-btn ${!isMuted ? "audio-active" : "secondary"}`}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute Buzzer Audio" : "Mute Buzzer Audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={13} />
                  <span>Unmute Audio</span>
                </>
              ) : (
                <>
                  <Volume2 size={13} className="text-amber-400 animate-pulse" />
                  <span>Audio ON</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Workbench Area */}
      <div className="sim-workbench-grid">
        {/* Left / Center: Interactive Circuit Board Canvas */}
        <div className="sim-canvas-viewport">
          {/* Subtle PCB Grid Background */}
          <div className="sim-pcb-backdrop">
            <div className="sim-watermark-badge">
              <span>BLINKY SILICON WORKBENCH</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {circuit?.title || "ESP32 Interactive Hardware"}
              </span>
            </div>

            {/* Render Circuit Components based on Preset */}
            {circuitType === "water_level_alarm" && (
              <div className="sim-components-layout">
                {/* Upper Deck: HC-SR04 Ultrasonic Sensor + Buzzer */}
                <div className="sim-upper-deck">
                  {/* HC-SR04 Ultrasonic Sensor */}
                  <div className="sim-component-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">HC-SR04 Ultrasonic Sensor</span>
                      <span className="sim-comp-pins">TRIG: GPIO15 | ECHO: GPIO2</span>
                    </div>
                    <div className="sim-element-wrapper ultrasonic-wrapper">
                      <wokwi-hc-sr04 />
                      {/* Animated Soundwave Ping Effect */}
                      {isRunning && (
                        <div className="sonic-waves-container">
                          <div className="sonic-wave wave-1" />
                          <div className="sonic-wave wave-2" />
                          <div className="sonic-wave wave-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buzzer Component */}
                  <div className="sim-component-card buzzer-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">Piezo Buzzer (2.4kHz)</span>
                      <span className="sim-comp-pins">SIG: GPIO22 | GND</span>
                    </div>
                    <div className="sim-element-wrapper">
                      <wokwi-buzzer hasSignal={buzzerActive ? "" : undefined} />
                      {buzzerActive && (
                        <div className="buzzer-alarm-glow">
                          <span className="buzzer-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle Deck: 4 Alert Status LEDs with Resistors */}
                <div className="sim-led-rack">
                  <div className="sim-rack-title">
                    <span>4-STAGE STATUS LED INDICATOR ARRAY</span>
                    <span className="text-zinc-500 font-mono text-[10px]">
                      Current Limiting: 220Ω Limiting Resistors Installed
                    </span>
                  </div>

                  <div className="sim-leds-row">
                    {/* Blue LED */}
                    <div className="sim-led-item">
                      <span className="led-channel-tag blue">STANDBY</span>
                      <wokwi-led
                        color="blue"
                        value={activeLedStates.blue ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                      <span className="led-gpio-label">GPIO 19</span>
                    </div>

                    {/* Green LED */}
                    <div className="sim-led-item">
                      <span className="led-channel-tag green">SAFE</span>
                      <wokwi-led
                        color="green"
                        value={activeLedStates.green ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                      <span className="led-gpio-label">GPIO 4</span>
                    </div>

                    {/* Yellow LED */}
                    <div className="sim-led-item">
                      <span className="led-channel-tag yellow">WARN</span>
                      <wokwi-led
                        color="yellow"
                        value={activeLedStates.yellow ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                      <span className="led-gpio-label">GPIO 5</span>
                    </div>

                    {/* Red LED */}
                    <div className="sim-led-item">
                      <span className="led-channel-tag red">ALARM</span>
                      <wokwi-led
                        color="red"
                        value={activeLedStates.red ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                      <span className="led-gpio-label">GPIO 18</span>
                    </div>
                  </div>
                </div>

                {/* Lower Deck: Central ESP32 DevKit V1 Board */}
                <div className="sim-board-deck">
                  <div className="sim-board-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">ESP32 DevKit V1 Microcontroller</span>
                      <span className="sim-comp-pins">Tensilica Xtensa Dual-Core LX6</span>
                    </div>
                    <div className="sim-esp32-wrapper">
                      <wokwi-esp32-devkit-v1 ledPower="" led1={isRunning ? "" : undefined} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Single LED Blink Preset */}
            {circuitType === "single_led" && (
              <div className="sim-simple-layout">
                <div className="sim-simple-pair">
                  <div className="sim-board-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">ESP32 DevKit V1</span>
                      <span className="sim-comp-pins">GPIO2 Output</span>
                    </div>
                    <div className="sim-esp32-wrapper">
                      <wokwi-esp32-devkit-v1 ledPower="" led1={blinkPhase ? "" : undefined} />
                    </div>
                  </div>

                  <div className="sim-single-peripheral">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">Status Indicator</span>
                      <span className="sim-comp-pins">GPIO2 ➔ 220Ω ➔ LED ➔ GND</span>
                    </div>
                    <div className="sim-led-spotlight">
                      <wokwi-led
                        color="red"
                        value={activeLedStates.red ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                    </div>
                    <div className="sim-pulse-badge">
                      <span className={`pulse-dot ${blinkPhase ? "on" : "off"}`} />
                      <span>{blinkPhase ? "PIN HIGH (3.3V)" : "PIN LOW (0V)"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Push Button Preset */}
            {circuitType === "dual_led_button" && (
              <div className="sim-button-layout">
                <div className="sim-board-card">
                  <div className="sim-comp-header">
                    <span className="sim-comp-title">ESP32 DevKit V1</span>
                    <span className="sim-comp-pins">GPIO14 (In) | GPIO2 (Out)</span>
                  </div>
                  <div className="sim-esp32-wrapper">
                    <wokwi-esp32-devkit-v1 ledPower="" led1={buttonPressed ? "" : undefined} />
                  </div>
                </div>

                <div className="sim-button-rack">
                  <div className="sim-comp-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">Interactive Pushbutton</span>
                      <span className="sim-comp-pins">Click to Trigger Interrupt</span>
                    </div>
                    <div
                      className="sim-clickable-button"
                      onMouseDown={() => setButtonPressed(true)}
                      onMouseUp={() => setButtonPressed(false)}
                      onTouchStart={() => setButtonPressed(true)}
                      onTouchEnd={() => setButtonPressed(false)}
                    >
                      <wokwi-pushbutton color="red" />
                      <span className="button-press-hint">
                        {buttonPressed ? "PRESSED!" : "CLICK & HOLD BUTTON"}
                      </span>
                    </div>
                  </div>

                  <div className="sim-comp-card">
                    <div className="sim-comp-header">
                      <span className="sim-comp-title">Response LED</span>
                      <span className="sim-comp-pins">GPIO2 ➔ LED</span>
                    </div>
                    <div className="sim-led-spotlight">
                      <wokwi-led
                        color="blue"
                        value={activeLedStates.blue ? "true" : "false"}
                      />
                      <wokwi-resistor value="220" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Dynamic Interactive Telemetry & Controls */}
        <div className="sim-sidebar">
          {/* Interactive Input Widget for Ultrasonic Sensor */}
          {circuitType === "water_level_alarm" && (
            <div className="sim-control-panel">
              <div className="sim-panel-title">
                <Sliders size={13} className="text-amber-400" />
                <span>Acoustic Obstacle Distance</span>
              </div>

              <div className="sim-slider-container">
                <div className="sim-slider-metric">
                  <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                    {distance}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">cm</span>
                  <span
                    className={`sim-alert-pill ${
                      distance < 15
                        ? "crit"
                        : distance < 30
                        ? "warn"
                        : distance < 80
                        ? "safe"
                        : "standby"
                    }`}
                  >
                    {distance < 15
                      ? "CRITICAL PROXIMITY"
                      : distance < 30
                      ? "WARNING ZONE"
                      : distance < 80
                      ? "SAFE CLEARANCE"
                      : "STANDBY / FAR"}
                  </span>
                </div>

                <input
                  type="range"
                  min="2"
                  max="200"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="sim-distance-range"
                />

                {/* Quick Presets */}
                <div className="sim-preset-chips">
                  <button
                    type="button"
                    className={`preset-chip ${distance === 6 ? "active" : ""}`}
                    onClick={() => setDistance(6)}
                  >
                    🚨 6cm Alarm
                  </button>
                  <button
                    type="button"
                    className={`preset-chip ${distance === 20 ? "active" : ""}`}
                    onClick={() => setDistance(20)}
                  >
                    ⚠️ 20cm Warn
                  </button>
                  <button
                    type="button"
                    className={`preset-chip ${distance === 50 ? "active" : ""}`}
                    onClick={() => setDistance(50)}
                  >
                    🟢 50cm Safe
                  </button>
                  <button
                    type="button"
                    className={`preset-chip ${distance === 120 ? "active" : ""}`}
                    onClick={() => setDistance(120)}
                  >
                    🔵 120cm Standby
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pin Voltage Logic Table */}
          <div className="sim-pin-matrix-panel">
            <div className="sim-panel-title">
              <Activity size={13} className="text-amber-400" />
              <span>Silicon Pin States (GPIO Bus)</span>
            </div>

            <div className="sim-pins-table">
              {circuitType === "water_level_alarm" ? (
                <>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 15</span>
                    <span className="pin-role">TRIG (Ultrasonic)</span>
                    <span className="pin-voltage active">10µs PULSE</span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 2</span>
                    <span className="pin-role">ECHO (Ultrasonic)</span>
                    <span className="pin-voltage">{Math.round(distance * 58)}µs</span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 22</span>
                    <span className="pin-role">Buzzer (Piezo)</span>
                    <span className={`pin-voltage ${buzzerActive ? "high" : "low"}`}>
                      {buzzerActive ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 18</span>
                    <span className="pin-role">Red LED</span>
                    <span className={`pin-voltage ${activeLedStates.red ? "high" : "low"}`}>
                      {activeLedStates.red ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 5</span>
                    <span className="pin-role">Yellow LED</span>
                    <span className={`pin-voltage ${activeLedStates.yellow ? "high" : "low"}`}>
                      {activeLedStates.yellow ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 4</span>
                    <span className="pin-role">Green LED</span>
                    <span className={`pin-voltage ${activeLedStates.green ? "high" : "low"}`}>
                      {activeLedStates.green ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 19</span>
                    <span className="pin-role">Blue LED</span>
                    <span className={`pin-voltage ${activeLedStates.blue ? "high" : "low"}`}>
                      {activeLedStates.blue ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                </>
              ) : circuitType === "single_led" ? (
                <>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 2</span>
                    <span className="pin-role">Status LED</span>
                    <span className={`pin-voltage ${blinkPhase ? "high" : "low"}`}>
                      {blinkPhase ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GND</span>
                    <span className="pin-role">Cathode Return</span>
                    <span className="pin-voltage low">0.0V</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 14</span>
                    <span className="pin-role">Push Button (Pullup)</span>
                    <span className={`pin-voltage ${buttonPressed ? "low" : "high"}`}>
                      {buttonPressed ? "LOW (GND)" : "HIGH (3.3V)"}
                    </span>
                  </div>
                  <div className="sim-pin-row">
                    <span className="pin-id">GPIO 2</span>
                    <span className="pin-role">Indicator LED</span>
                    <span className={`pin-voltage ${buttonPressed ? "high" : "low"}`}>
                      {buttonPressed ? "HIGH (3.3V)" : "LOW (0.0V)"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Embedded Real-Time Serial Monitor */}
          <div className="sim-serial-panel">
            <div className="sim-serial-header">
              <div className="flex items-center gap-1.5">
                <Terminal size={12} className="text-amber-400" />
                <span>ESP32 Serial Monitor</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">115200 baud</span>
            </div>

            <div className="sim-serial-output" ref={serialContainerRef}>
              {serialLogs.length === 0 ? (
                <div className="text-zinc-600 italic">Connecting to UART0...</div>
              ) : (
                serialLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`serial-line ${
                      log.includes("ALERT")
                        ? "log-alert"
                        : log.includes("WARN")
                        ? "log-warn"
                        : "log-info"
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
