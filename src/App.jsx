import { useState } from "react";
import "./App.css";

import {
  CircuitBoard,
  Code2,
  Cpu,
  Bot,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Activity,
  Star,
  Radio,
  RotateCcw,
  Home,
  Gamepad2,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import LandingPage from "./Components/LandingPage";
import {
  waterLevelAlarmCircuit,
  singleLedCircuit,
  dualLedButtonCircuit,
  joystickLedCircuit,
} from "./data/mockCircuits";
import { generateProject } from "./services/api";
import CircuitDiagram from "./Components/circuitDiagram";
import CodePanel from "./Components/CodePanel";
import PromptBar from "./Components/PromptBar";
import InstructionPanel from "./Components/InstructionPanel";
import HardwarePanel from "./Components/HardwarePanel";
import TelemetryPanel from "./Components/TelemetryPanel";
import VisionVoiceBar from "./Components/VisionVoiceBar";
import AiSelfHealingCard from "./Components/AiSelfHealingCard";
import SuccessBanner from "./Components/SuccessBanner";

// The 5 Sequential Stages of Blinky's Agentic AI Flow
const STAGES = {
  CIRCUIT: "circuit",
  CODE: "code",
  FLASH: "flash",
  AI_TEST: "ai_test",
  SUCCESS: "success",
};

const STAGE_CONFIG = [
  { key: STAGES.CIRCUIT, label: "Circuit & Wokwi", icon: CircuitBoard, num: "1" },
  { key: STAGES.CODE, label: "Firmware Code", icon: Code2, num: "2" },
  { key: STAGES.FLASH, label: "ESP32 Hardware Flash", icon: Cpu, num: "3" },
  { key: STAGES.AI_TEST, label: "AI Self-Healing", icon: Bot, num: "4" },
  { key: STAGES.SUCCESS, label: "Verified Telemetry", icon: CheckCircle2, num: "5" },
];

function App() {
  const [currentProject, setCurrentProject] = useState({
    circuit: waterLevelAlarmCircuit,
    code: waterLevelAlarmCircuit.code,
    instructions: waterLevelAlarmCircuit.instructions,
  });

  const [viewMode, setViewMode] = useState("landing");
  const [activeStage, setActiveStage] = useState(STAGES.CIRCUIT);
  const [activePreset, setActivePreset] = useState("flagship");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [networkWarning, setNetworkWarning] = useState(null);
  const [showTelemetryInSuccess, setShowTelemetryInSuccess] = useState(true);

  // Switch between presets
  const handleSelectPreset = (presetKey) => {
    setActivePreset(presetKey);
    setApiError(null);
    setNetworkWarning(null);

    if (presetKey === "flagship") {
      setCurrentProject({
        circuit: waterLevelAlarmCircuit,
        code: waterLevelAlarmCircuit.code,
        instructions: waterLevelAlarmCircuit.instructions,
      });
    } else if (presetKey === "preset1") {
      setCurrentProject({
        circuit: singleLedCircuit,
        code: singleLedCircuit.code,
        instructions: [
          "1. Place the ESP32 DevKit V1 onto the center of your breadboard.",
          "2. Connect a jumper wire from ESP32 GPIO2 to one leg of the 220Ω resistor.",
          "3. Connect the other leg of the resistor to the LED's longer lead (Anode, +).",
          "4. Connect the shorter lead of the LED (Cathode, -) directly to any ESP32 GND pin.",
          "5. Connect the ESP32 to your laptop via Micro-USB and upload the generated sketch.",
        ],
      });
    } else if (presetKey === "preset2") {
      setCurrentProject({
        circuit: dualLedButtonCircuit,
        code: dualLedButtonCircuit.code,
        instructions: [
          "1. Mount the ESP32 and tactile push button onto the breadboard.",
          "2. Connect tactile button terminal 1 to ESP32 GPIO4.",
          "3. Connect button terminal 2 directly to ESP32 GND (internal pull-up enabled in sketch).",
          "4. Connect current-limiting 220Ω resistor from GPIO2 to the LED anode A (+).",
          "5. Complete the loop by connecting the LED cathode K (-) to ESP32 GND.",
        ],
      });
    } else if (presetKey === "preset3" || presetKey === "joystick") {
      setCurrentProject({
        circuit: joystickLedCircuit,
        code: joystickLedCircuit.code,
        instructions: joystickLedCircuit.instructions,
      });
    }

    // Reset to stage 1 (Circuit Diagram)
    setActiveStage(STAGES.CIRCUIT);
  };

  // Handle generation triggered by PromptBar
  const handleGenerate = async (promptText) => {
    setIsLoading(true);
    setApiError(null);
    setNetworkWarning(null);

    try {
      const result = await generateProject({
        prompt: promptText,
        board: "ESP32",
      });

      setCurrentProject(result);
      if (result.networkWarning) {
        setNetworkWarning(result.networkWarning);
      }
      setActiveStage(STAGES.CIRCUIT);
    } catch (err) {
      console.error("Project generation failed:", err);
      setApiError(err.message || "Failed to generate project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatic transition when AI Self-Healing finishes
  const handleAiHealingComplete = () => {
    setTimeout(() => {
      setActiveStage(STAGES.SUCCESS);
    }, 1200);
  };

  const { circuit, code, instructions } = currentProject;

  if (viewMode === "landing") {
    return (
      <LandingPage
        onLaunchStudio={() => setViewMode("studio")}
        onSelectPreset={(presetKey) => {
          handleSelectPreset(presetKey);
          setViewMode("studio");
        }}
        onGeneratePrompt={(promptText) => {
          setViewMode("studio");
          handleGenerate(promptText);
        }}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="app">
      {/* Background Ambient Glow Mesh */}
      <div className="ambient-glow" />

      {/* Header & Hackathon Team Branding */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-branding">
            <span className="logo-badge">
              <Zap size={14} className="fill-amber-400 text-amber-400" />
              <span>BLINKY</span>
            </span>
            <span className="team-badge">Intelligent IoT Studio</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setViewMode("landing")}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8 px-2.5 border-white/10 text-zinc-300 hover:text-white"
            >
              <Home size={13} className="text-amber-400" />
              <span>Home</span>
            </Button>

            <div className="agentic-status-badge">
              <span className="live-dot" />
              <Activity size={13} className="text-amber-400" />
              <span>Agentic AI Pipeline Active</span>
            </div>
          </div>
        </div>

        <h1 className="hero-heading">
          AI-Powered <span className="gradient-text">Circuit &amp; IoT</span> Coding Assistant
        </h1>
        <p className="subtitle">
          Autonomous Agentic Workflow: Circuit Design ➔ Firmware Generation ➔ ESP32 Flashing ➔ AI Self-Testing &amp; Healing ➔ Verified Success.
        </p>
      </header>

      {/* Progressive Stage Stepper Bar */}
      <div className="agentic-stepper-bar">
        {STAGE_CONFIG.map((s, idx) => {
          const isCurrent = activeStage === s.key;
          const stageKeys = Object.values(STAGES);
          const isPassed = stageKeys.indexOf(activeStage) > idx;
          const IconComp = s.icon;

          return (
            <button
              key={s.key}
              type="button"
              className={`stage-pill ${isCurrent ? "current" : ""} ${isPassed ? "passed" : ""}`}
              onClick={() => setActiveStage(s.key)}
            >
              <span className="stage-num">
                {isPassed ? <CheckCircle2 size={14} className="text-amber-400" /> : <IconComp size={14} />}
              </span>
              <span className="stage-text">{s.num}. {s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Agentic Display Area */}
      <div className="agentic-workspace-card">
        {/* ================= STAGE 1: CIRCUIT DIAGRAM SHOWS UP FIRST ================= */}
        {activeStage === STAGES.CIRCUIT && (
          <div className="stage-view-content circuit-stage">
            <div className="stage-header-bar">
              <div className="stage-badge-group">
                <span className="step-tag">STAGE 1</span>
                <h2>Interactive Wokwi Circuit Simulation</h2>
              </div>
              <span className="stage-hint">
                Real-time Wokwi ESP32 simulation with interactive sensors, breadboard, and live code.
              </span>
            </div>

            {/* Vision AI Detection & Voice Guidance Bar */}
            <VisionVoiceBar instructions={instructions} />

            {/* Prompt & Demo Presets Bar */}
            <PromptBar
              onGenerate={handleGenerate}
              isLoading={isLoading}
              error={apiError}
              networkWarning={networkWarning}
            />

            <div className="preset-bar">
              <span className="preset-label">
                <Sparkles size={12} className="inline mr-1 text-amber-400" />
                Demo Projects:
              </span>
              <button
                type="button"
                className={activePreset === "flagship" ? "active highlight-btn" : "highlight-btn"}
                onClick={() => handleSelectPreset("flagship")}
              >
                <Star size={13} className="text-amber-400" />
                <span>Water Level Alarm (HC-SR04 + Buzzer + LED)</span>
              </button>
              <button
                type="button"
                className={activePreset === "preset1" ? "active" : ""}
                onClick={() => handleSelectPreset("preset1")}
              >
                <Zap size={13} className="text-red-400" />
                <span>Basic LED Blink</span>
              </button>
              <button
                type="button"
                className={activePreset === "preset2" ? "active" : ""}
                onClick={() => handleSelectPreset("preset2")}
              >
                <Radio size={13} className="text-amber-400" />
                <span>Button Controller</span>
              </button>
              <button
                type="button"
                className={activePreset === "preset3" ? "active" : ""}
                onClick={() => handleSelectPreset("preset3")}
              >
                <Gamepad2 size={13} className="text-purple-400" />
                <span>Joystick + Red Light</span>
              </button>
            </div>

            {/* Circuit Diagram Component */}
            <div className="circuit-container">
              <div className="circuit-meta-bar">
                <span className="board-tag">
                  <Cpu size={13} className="text-amber-400" />
                  Target: {circuit?.board?.model || "ESP32 DevKit V1"}
                </span>
                <span className="component-count-tag">
                  {circuit?.components?.length || 0} Components •{" "}
                  {circuit?.connections?.length || 0} Connections
                </span>
              </div>
              <CircuitDiagram circuit={circuit} />
            </div>

            {/* Stage Action Button */}
            <div className="stage-action-bar">
              <div className="stage-summary-text">
                Circuit connections ready. Next: Invoke backend code synthesis.
              </div>
              <button
                type="button"
                className="stage-cta-btn primary"
                onClick={() => setActiveStage(STAGES.CODE)}
              >
                <span>Generate Firmware (Backend Agent)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: GENERATED CODE SHOWS UP ================= */}
        {activeStage === STAGES.CODE && (
          <div className="stage-view-content code-stage">
            <div className="stage-header-bar">
              <div className="stage-badge-group">
                <span className="step-tag">STAGE 2</span>
                <h2>Synthesized Arduino C++ Firmware</h2>
              </div>
              <div className="backend-attribution-badge">
                <Bot size={13} className="inline mr-1 text-red-400" />
                <span>Backend Agent: FastAPI + Gemini Model</span>
              </div>
            </div>

            <CodePanel
              code={code}
              boardModel={circuit?.board?.model}
              circuit={circuit}
              isLoading={isLoading}
            />

            {/* Stage Action Button */}
            <div className="stage-action-bar">
              <button
                type="button"
                className="stage-back-btn"
                onClick={() => setActiveStage(STAGES.CIRCUIT)}
              >
                <ArrowLeft size={14} />
                <span>Back to Circuit</span>
              </button>
              <button
                type="button"
                className="stage-cta-btn primary"
                onClick={() => setActiveStage(STAGES.FLASH)}
              >
                <span>Proceed to Hardware Flashing</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: FLASHING SHOWS UP ================= */}
        {activeStage === STAGES.FLASH && (
          <div className="stage-view-content flash-stage">
            <div className="stage-header-bar">
              <div className="stage-badge-group">
                <span className="step-tag">STAGE 3</span>
                <h2>Upload Firmware to ESP32 Hardware</h2>
              </div>
              <span className="stage-hint">
                PySerial &amp; esptool automated flashing channel
              </span>
            </div>

            <HardwarePanel code={code} />

            {/* Stage Action Button */}
            <div className="stage-action-bar">
              <button
                type="button"
                className="stage-back-btn"
                onClick={() => setActiveStage(STAGES.CODE)}
              >
                <ArrowLeft size={14} />
                <span>Back to Code</span>
              </button>
              <button
                type="button"
                className="stage-cta-btn agentic-btn"
                onClick={() => setActiveStage(STAGES.AI_TEST)}
              >
                <Bot size={16} />
                <span>Launch AI Autonomous Testing &amp; Self-Healing</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: AI TESTS ITSELF & FIXES IT ================= */}
        {activeStage === STAGES.AI_TEST && (
          <div className="stage-view-content ai-test-stage">
            <div className="stage-header-bar">
              <div className="stage-badge-group">
                <span className="step-tag agent">STAGE 4</span>
                <h2>AI Autonomous Hardware Testing &amp; Self-Healing</h2>
              </div>
              <span className="stage-hint">
                Agentic feedback loop: Test ➔ Detect Timing Bug ➔ Patch ➔ Re-Verify
              </span>
            </div>

            {/* The Self-Healing Diagnostic & Diff Component */}
            <AiSelfHealingCard onComplete={handleAiHealingComplete} />

            {/* Stage Action Button */}
            <div className="stage-action-bar">
              <span className="agent-status-msg">
                <Activity size={14} className="inline mr-1 text-amber-400 animate-pulse" />
                AI is actively diagnosing and patching the circuit loop...
              </span>
              <button
                type="button"
                className="stage-cta-btn success"
                onClick={() => setActiveStage(STAGES.SUCCESS)}
              >
                <span>Skip to Verified Success</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 5: SUCCESS MESSAGE & WORKING STATUS ================= */}
        {activeStage === STAGES.SUCCESS && (
          <div className="stage-view-content success-stage">
            {/* The Celebratory Success Message */}
            <SuccessBanner
              onRestart={() => setActiveStage(STAGES.CIRCUIT)}
              onOpenTelemetry={() => setShowTelemetryInSuccess((prev) => !prev)}
            />

            {/* Real-time Telemetry Dashboard */}
            {showTelemetryInSuccess && <TelemetryPanel />}

            {/* Step-by-Step Breadboard Hardware Guide */}
            <InstructionPanel
              instructions={instructions}
              connections={circuit?.connections || []}
            />

            <div className="stage-action-bar">
              <button
                type="button"
                className="stage-back-btn"
                onClick={() => setActiveStage(STAGES.CIRCUIT)}
              >
                <RotateCcw size={14} />
                <span>Restart Complete Demo Flow</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;