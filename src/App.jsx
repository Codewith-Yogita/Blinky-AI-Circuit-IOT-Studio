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
      {/* Background Ambient Glow Mesh */}
      <div className="ambient-glow" />

      {/* Global Studio SVG Brush Gradient */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <linearGradient id="brushGradientStudio" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      {/* ================= STUDIO TOP BAR (MATCHING LANDING PAGE AESTHETICS) ================= */}
      <header
        className={`sticky top-0 z-40 w-full px-4 sm:px-8 lg:px-12 py-3.5 border-b backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 transition-colors duration-300 ${
          isDark
            ? "bg-[#080709]/90 border-white/[0.08]"
            : "bg-[#fbf9f6]/90 border-amber-900/10 shadow-sm"
        }`}
      >
        {/* Left: Brand + Back to Dashboard */}
        <div className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            onClick={() => setViewMode("landing")}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold font-outfit text-zinc-300 hover:text-white transition-all duration-300 py-1 cursor-pointer hover:scale-105 active:scale-95"
            title="Return to Landing Page"
          >
            <ArrowLeft size={15} className="text-amber-400 transition-transform duration-300 group-hover:-translate-x-1.5" />
            <span className="relative">
              Dashboard
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </span>
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
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Preset Switcher (Minimalist handwritten style without heavy pill boxes) */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-zinc-400 select-none">
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-handwriting text-sm">// presets:</span>
            {[
              { id: "flagship", label: "HC-SR04" },
              { id: "preset1", label: "LED" },
              { id: "oled_display", label: "OLED" },
              { id: "joystick", label: "Joystick" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`group relative text-xs font-mono transition-all duration-300 cursor-pointer ${
                  activePreset === p.id
                    ? "text-amber-400 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{p.label}</span>
                {activePreset === p.id ? (
                  <svg
                    className="w-full h-1.5 -mt-0.5 text-amber-400 overflow-visible"
                    viewBox="0 0 40 6"
                    fill="none"
                  >
                    <path d="M1 3 C10 1, 25 5, 39 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-amber-500/40 group-hover:w-full transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-zinc-400 hover:text-amber-400 hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
            title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            ) : (
              <Moon className="w-4 h-4 text-amber-600 hover:-rotate-45 transition-transform duration-500" />
            )}
          </button>

          {/* Star on GitHub */}
          <a
            href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-bold font-outfit text-zinc-200 hover:text-amber-300 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400/90 text-amber-400 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <span className="font-outfit relative">
              Star
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </span>
          </a>
        </div>
      </header>

      {/* ================= FULL-WIDTH STUDIO WORKSPACE (EDGE-TO-EDGE, NO SIDE GAPS) ================= */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ================= STAGE 1: CIRCUIT & WOKWI SIMULATION ================= */}
        {activeStage === STAGES.CIRCUIT && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 1 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                01 / VIRTUAL HARDWARE
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-center">
                Interactive Wokwi Circuit
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center max-w-xl mx-auto leading-relaxed">
                Real-time ESP32 hardware simulation, interactive sensors, and pinout wiring.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CODE)}
                  className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <Code2 size={16} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Proceed to Firmware Code</span>
                    <ArrowRight size={16} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                  {/* Organic Hand-Drawn Brush Stroke Underline */}
                  <svg
                    className="w-full h-3 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_12px_rgba(249,115,22,0.85)]"
                    viewBox="0 0 160 10"
                    fill="none"
                  >
                    <path
                      d="M3 6 C35 2, 85 8, 155 5"
                      stroke="url(#brushGradientStudio)"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 8 C45 4, 95 8, 145 6"
                      stroke="url(#brushGradientStudio)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
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
                className="group relative inline-flex flex-col items-start sm:items-end cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <div className="flex items-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300">
                  <Zap size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Synthesize Firmware Code</span>
                  <ArrowRight size={15} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
                <svg
                  className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all duration-300 filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.85)]"
                  viewBox="0 0 140 8"
                  fill="none"
                >
                  <path d="M2 5 C35 2, 80 7, 136 4" stroke="url(#brushGradientStudio)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: GENERATED ARDUINO C++ CODE ================= */}
        {activeStage === STAGES.CODE && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 2 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                02 / SYNTHESIZED FIRMWARE
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-center">
                Synthesized Arduino C++
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center max-w-xl mx-auto leading-relaxed">
                Verified pin mappings, non-blocking loops, and compiled firmware routines.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-8 sm:gap-10">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CIRCUIT)}
                  className="group flex items-center gap-2 text-sm sm:text-base font-bold font-handwriting text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer py-1 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft size={14} className="text-zinc-400 group-hover:text-amber-400 group-hover:-translate-x-1.5 transition-all duration-300" />
                  <span className="underline decoration-zinc-500/60 group-hover:decoration-amber-400 decoration-[2.5px] decoration-wavy underline-offset-6 transition-colors duration-300">
                    Back to Circuit
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.FLASH)}
                  className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <Cpu size={16} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Proceed to Hardware Flash</span>
                    <ArrowRight size={16} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                  <svg
                    className="w-full h-3 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_12px_rgba(249,115,22,0.85)]"
                    viewBox="0 0 160 10"
                    fill="none"
                  >
                    <path d="M3 6 C35 2, 85 8, 155 5" stroke="url(#brushGradientStudio)" strokeWidth="3.8" strokeLinecap="round" />
                    <path d="M10 8 C45 4, 95 8, 145 6" stroke="url(#brushGradientStudio)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  </svg>
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
                className="group relative inline-flex flex-col items-start sm:items-end cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <div className="flex items-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300">
                  <Cpu size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Upload to ESP32</span>
                  <ArrowRight size={15} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
                <svg
                  className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all duration-300 filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.85)]"
                  viewBox="0 0 140 8"
                  fill="none"
                >
                  <path d="M2 5 C35 2, 80 7, 136 4" stroke="url(#brushGradientStudio)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: HARDWARE FLASHING ================= */}
        {activeStage === STAGES.FLASH && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 3 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                03 / SERIAL FLASHING
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-center">
                Flash Firmware to ESP32
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center max-w-xl mx-auto leading-relaxed">
                Direct browser-to-chip WebSerial upload via esptool and PySerial channel.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-8 sm:gap-10">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CODE)}
                  className="group flex items-center gap-2 text-sm sm:text-base font-bold font-handwriting text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer py-1 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft size={14} className="text-zinc-400 group-hover:text-amber-400 group-hover:-translate-x-1.5 transition-all duration-300" />
                  <span className="underline decoration-zinc-500/60 group-hover:decoration-amber-400 decoration-[2.5px] decoration-wavy underline-offset-6 transition-colors duration-300">
                    Back to Code
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.AI_TEST)}
                  className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <Bot size={16} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Launch AI Self-Healing</span>
                    <ArrowRight size={16} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                  <svg
                    className="w-full h-3 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_12px_rgba(249,115,22,0.85)]"
                    viewBox="0 0 160 10"
                    fill="none"
                  >
                    <path d="M3 6 C35 2, 85 8, 155 5" stroke="url(#brushGradientStudio)" strokeWidth="3.8" strokeLinecap="round" />
                    <path d="M10 8 C45 4, 95 8, 145 6" stroke="url(#brushGradientStudio)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  </svg>
                </button>
              </div>
            </div>

            <HardwarePanel code={code} />

            <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06]">
              <span>PySerial &bull; 115200 Baud &bull; WebSerial API</span>
              <button
                type="button"
                onClick={() => setActiveStage(STAGES.AI_TEST)}
                className="group relative inline-flex flex-col items-start sm:items-end cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <div className="flex items-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300">
                  <Bot size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Autonomous AI Testing Loop</span>
                  <ArrowRight size={15} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
                <svg
                  className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all duration-300 filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.85)]"
                  viewBox="0 0 140 8"
                  fill="none"
                >
                  <path d="M2 5 C35 2, 80 7, 136 4" stroke="url(#brushGradientStudio)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: AI SELF-HEALING & DIAGNOSTICS ================= */}
        {activeStage === STAGES.AI_TEST && (
          <div className="space-y-6">
            {/* Monumental, Clean Stage 4 Heading (Centered & Ultra Bold) */}
            <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-extrabold block">
                04 / AGENTIC VERIFICATION
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-center">
                AI Autonomous Self-Healing
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center max-w-xl mx-auto leading-relaxed">
                Autonomous loop: diagnose signal noise, calculate corrections, and hot-patch firmware.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.SUCCESS)}
                  className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <CheckCircle2 size={16} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>Skip to Verified Success</span>
                    <ArrowRight size={16} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                  <svg
                    className="w-full h-3 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_12px_rgba(249,115,22,0.85)]"
                    viewBox="0 0 160 10"
                    fill="none"
                  >
                    <path d="M3 6 C35 2, 85 8, 155 5" stroke="url(#brushGradientStudio)" strokeWidth="3.8" strokeLinecap="round" />
                    <path d="M10 8 C45 4, 95 8, 145 6" stroke="url(#brushGradientStudio)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  </svg>
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
            <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-white/[0.08] w-full">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-emerald-400 font-extrabold block">
                05 / LIVE TELEMETRY
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-center">
                Verified Telemetry &amp; Guide
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center max-w-xl mx-auto leading-relaxed">
                Hardware loop verified. Real-time sensor metrics synchronized with TigerData / PostgreSQL.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveStage(STAGES.CIRCUIT)}
                  className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <RotateCcw size={16} className="text-amber-400 group-hover:-rotate-90 transition-transform duration-300" />
                    <span>Restart Complete Flow</span>
                    <ArrowRight size={16} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                  <svg
                    className="w-full h-3 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_12px_rgba(249,115,22,0.85)]"
                    viewBox="0 0 160 10"
                    fill="none"
                  >
                    <path d="M3 6 C35 2, 85 8, 155 5" stroke="url(#brushGradientStudio)" strokeWidth="3.8" strokeLinecap="round" />
                    <path d="M10 8 C45 4, 95 8, 145 6" stroke="url(#brushGradientStudio)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  </svg>
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
              <div className="font-handwriting text-amber-400 text-2xl select-none">
                Keep building :)
              </div>
              <button
                type="button"
                onClick={() => setViewMode("landing")}
                className="group flex items-center gap-2 text-sm sm:text-base font-bold font-handwriting text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer py-1 hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={14} className="text-zinc-400 group-hover:text-amber-400 group-hover:-translate-x-1.5 transition-all duration-300" />
                <span className="underline decoration-zinc-500/60 group-hover:decoration-amber-400 decoration-[2.5px] decoration-wavy underline-offset-6 transition-colors duration-300">
                  Return to Dashboard
                </span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;