import { useState, useEffect } from "react";
import "./App.css";

import {
  Code2,
  Cpu,
  Bot,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  Activity,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Star,
} from "lucide-react";

import LandingPage from "./Components/LandingPage";
import {
  waterLevelAlarmCircuit,
  singleLedCircuit,
  dualLedButtonCircuit,
  joystickLedCircuit,
  oledDisplayCircuit,
} from "./data/mockCircuits";
import { generateProject } from "./services/api";
import CircuitDiagram from "./Components/circuitDiagram";
import CodePanel from "./Components/CodePanel";
import PromptBar from "./Components/PromptBar";
import InstructionPanel from "./Components/InstructionPanel";
import HardwarePanel from "./Components/HardwarePanel";
import TelemetryPanel from "./Components/TelemetryPanel";
import AiSelfHealingCard from "./Components/AiSelfHealingCard";
import SuccessBanner from "./Components/SuccessBanner";

// The 5 Sequential Stages of Blinky's Studio Workflow
const STAGES = {
  CIRCUIT: "circuit",
  CODE: "code",
  FLASH: "flash",
  AI_TEST: "ai_test",
  SUCCESS: "success",
};

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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blinky-theme") || "dark";
  });

  // Sync theme across entire app
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("blinky-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

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
    } else if (presetKey === "oled_display") {
      setCurrentProject({
        circuit: oledDisplayCircuit,
        code: oledDisplayCircuit.code,
        instructions: oledDisplayCircuit.instructions,
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
        onOpenStage={(stageKey) => {
          setActiveStage(stageKey);
          setViewMode("studio");
        }}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#080709] text-zinc-100" : "bg-[#fbf9f6] text-zinc-900"
      } flex flex-col antialiased selection:bg-amber-500/30 selection:text-white w-full`}
    >
      {/* Background Ambient Glow Mesh */}
      <div className="ambient-glow" />

      {/* ================= STUDIO TOP BAR (MATCHING LANDING PAGE AESTHETICS) ================= */}
      <header
        className={`sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 py-3 border-b backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 transition-colors duration-300 ${
          isDark
            ? "bg-[#080709]/90 border-white/[0.08]"
            : "bg-[#fbf9f6]/90 border-amber-900/10 shadow-sm"
        }`}
      >
        {/* Left: Brand + Back to Dashboard */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setViewMode("landing")}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border border-white/10 hover:border-amber-500/40 bg-[#120f15] hover:bg-[#18131c] text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95"
            title="Return to Landing Page"
          >
            <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="font-outfit">Dashboard</span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setViewMode("landing")}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
              Blinky Studio
            </span>
          </div>
        </div>

        {/* Right: Quick Hardware Switcher + Day/Night + Star on GitHub */}
        <div className="flex items-center gap-2.5">
          {/* Preset Switcher Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-[#141018] p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
            <button
              type="button"
              onClick={() => handleSelectPreset("flagship")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activePreset === "flagship" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              HC-SR04
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset("preset1")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activePreset === "preset1" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              LED
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset("oled_display")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activePreset === "oled_display" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              OLED
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset("joystick")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                activePreset === "joystick" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Joystick
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${
              isDark
                ? "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                : "border-amber-900/20 bg-amber-100 text-amber-700 hover:bg-amber-200"
            }`}
            title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Star on GitHub */}
          <a
            href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-red-500/15 hover:from-amber-500/25 hover:to-red-500/25 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-outfit">Star</span>
          </a>
        </div>
      </header>

      {/* ================= FULL-WIDTH STUDIO WORKSPACE (EDGE-TO-EDGE, NO SIDE GAPS) ================= */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ================= STAGE 1: CIRCUIT & WOKWI SIMULATION ================= */}
        {activeStage === STAGES.CIRCUIT && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 1 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                01 / VIRTUAL HARDWARE
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] text-center">
                Interactive Wokwi Circuit
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-medium text-center max-w-2xl mx-auto leading-relaxed">
                Real-time ESP32 hardware simulation, interactive sensors, and pinout wiring.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CODE)}
                  className="group px-6 py-2.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Code2 size={12} />
                  </div>
                  <span className="font-outfit">Proceed to Firmware Code</span>
                  <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Prompt & AI Generation Bar */}
            <PromptBar
              onGenerate={handleGenerate}
              isLoading={isLoading}
              error={apiError}
              networkWarning={networkWarning}
            />

            {/* Circuit Diagram Component */}
            <div className="circuit-container">
              <CircuitDiagram circuit={circuit} />
            </div>

            {/* Stage Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Circuit connections ready. Next: Synthesize verified Arduino firmware.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveStage(STAGES.CODE)}
                className="group px-5 py-2 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Zap size={11} />
                </div>
                <span className="font-outfit">Synthesize Firmware Code</span>
                <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: GENERATED ARDUINO C++ CODE ================= */}
        {activeStage === STAGES.CODE && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 2 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                02 / SYNTHESIZED FIRMWARE
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] text-center">
                Synthesized Arduino C++
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-medium text-center max-w-2xl mx-auto leading-relaxed">
                Verified pin mappings, non-blocking loops, and compiled firmware routines.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CIRCUIT)}
                  className="group px-4 py-2.5 rounded-2xl border border-white/10 hover:border-amber-500/40 text-zinc-300 hover:text-white bg-[#120f15] hover:bg-[#18131c] text-xs font-semibold flex items-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                    <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
                  </div>
                  <span>Back to Circuit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.FLASH)}
                  className="group px-6 py-2.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Cpu size={12} />
                  </div>
                  <span className="font-outfit">Proceed to Hardware Flash</span>
                  <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <CodePanel
              code={code}
              boardModel={circuit?.board?.model}
              circuit={circuit}
              isLoading={isLoading}
            />

            {/* Stage Bottom Bar */}
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06]">
              <span>Hardware sketch ready for compilation and serial flashing.</span>
              <button
                type="button"
                onClick={() => setActiveStage(STAGES.FLASH)}
                className="group px-5 py-2 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Cpu size={11} />
                </div>
                <span className="font-outfit">Upload to ESP32</span>
                <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: HARDWARE FLASHING ================= */}
        {activeStage === STAGES.FLASH && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 3 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                03 / SERIAL FLASHING
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] text-center">
                Flash Firmware to ESP32
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-medium text-center max-w-2xl mx-auto leading-relaxed">
                Direct browser-to-chip WebSerial upload via esptool and PySerial channel.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CODE)}
                  className="group px-4 py-2.5 rounded-2xl border border-white/10 hover:border-amber-500/40 text-zinc-300 hover:text-white bg-[#120f15] hover:bg-[#18131c] text-xs font-semibold flex items-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                    <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
                  </div>
                  <span>Back to Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.AI_TEST)}
                  className="group px-6 py-2.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Bot size={12} />
                  </div>
                  <span className="font-outfit">Launch AI Self-Healing</span>
                  <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <HardwarePanel code={code} />

            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06]">
              <span>PySerial &bull; 115200 Baud &bull; WebSerial API</span>
              <button
                type="button"
                onClick={() => setActiveStage(STAGES.AI_TEST)}
                className="group px-4 py-2 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Bot size={11} />
                </div>
                <span className="font-outfit">Autonomous AI Testing Loop</span>
                <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: AI SELF-HEALING & DIAGNOSTICS ================= */}
        {activeStage === STAGES.AI_TEST && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 4 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                04 / AGENTIC VERIFICATION
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] text-center">
                AI Autonomous Self-Healing
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-medium text-center max-w-2xl mx-auto leading-relaxed">
                Autonomous loop: diagnose signal noise, calculate corrections, and hot-patch firmware.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.SUCCESS)}
                  className="group px-6 py-2.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-all flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="font-outfit">Skip to Verified Success</span>
                  <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <AiSelfHealingCard onComplete={handleAiHealingComplete} />

            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-amber-400 animate-pulse" />
                <span>AI actively diagnosing hardware loop and verifying timing thresholds...</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 5: VERIFIED TELEMETRY & INSTRUCTIONS ================= */}
        {activeStage === STAGES.SUCCESS && (
          <div className="space-y-8">
            {/* Monumental, Clean Stage 5 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-emerald-400 font-extrabold block">
                05 / LIVE TELEMETRY
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] text-center">
                Verified Telemetry &amp; Guide
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-medium text-center max-w-2xl mx-auto leading-relaxed">
                Hardware loop verified. Real-time sensor metrics synchronized with TigerData / PostgreSQL.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CIRCUIT)}
                  className="group px-5 py-2.5 rounded-2xl border border-white/10 hover:border-amber-500/40 text-zinc-300 hover:text-white bg-[#120f15] hover:bg-[#18131c] text-xs font-semibold flex items-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                    <RotateCcw size={12} />
                  </div>
                  <span className="font-outfit">Restart Complete Flow</span>
                  <ArrowRight size={13} className="text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Celebratory Banner */}
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

            {/* Bottom Actions */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 border-t border-white/[0.06]">
              <div className="font-handwriting text-amber-400 text-xl">
                Keep building :)
              </div>
              <button
                type="button"
                onClick={() => setViewMode("landing")}
                className="group px-4 py-2 rounded-2xl border border-white/10 hover:border-amber-500/40 bg-[#120f15] hover:bg-[#18131c] text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.4)] flex items-center gap-2 hover:scale-[1.02]"
              >
                <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
                </div>
                <span className="font-outfit">Return to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;