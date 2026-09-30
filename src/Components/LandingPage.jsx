import { useState, useEffect } from "react";
import {
  Play,
  ArrowRight,
  Code2,
  BookOpen,
  Sun,
  Moon,
  Star,
  Activity,
  Check,
  X,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight,
  Camera,
  Bot,
  Terminal,
  Radio,
  Gamepad2,
  Database,
  Flame,
} from "lucide-react";

export default function LandingPage({
  onLaunchStudio,
  onSelectPreset,
  onGeneratePrompt,
  isLoading = false,
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blinky-theme") || "dark";
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  // Sync theme with document root
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

  // The 4 curated hardware projects
  const circuitsList = [
    {
      id: "flagship",
      circuitKey: "flagship",
      title: "HC-SR04 Water Level",
      tag: "Sensors & Audio",
      badgeColor: "border-amber-500/40 text-amber-400 bg-amber-950/30",
      image: "/images/project_hcsr04.jpg",
      description: "Ultrasonic transducer measuring distance with automated warning buzzer and alert LED.",
    },
    {
      id: "preset1",
      circuitKey: "preset1",
      title: "LED Blink Controller",
      tag: "Digital GPIO",
      badgeColor: "border-red-500/40 text-red-400 bg-red-950/30",
      image: "/images/project_led.jpg",
      description: "Digital GPIO2 pin pulse with 220Ω current-limiting resistor.",
    },
    {
      id: "oled_display",
      circuitKey: "oled_display",
      title: "SSD1306 0.96\" OLED",
      tag: "Hardware I2C",
      badgeColor: "border-amber-500/40 text-amber-400 bg-amber-950/30",
      image: "/images/project_oled.jpg",
      description: "Fast I2C graphics display on GPIO21/22 rendering live status.",
    },
    {
      id: "joystick",
      circuitKey: "joystick",
      title: "Dual-Axis Joystick",
      tag: "Analog ADC",
      badgeColor: "border-orange-500/40 text-orange-400 bg-orange-950/30",
      image: "/images/project_joystick.jpg",
      description: "Dual analog ADC channels with thumbstick push button alert trigger.",
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLaunchProject = (presetKey) => {
    if (onSelectPreset) {
      onSelectPreset(presetKey);
    } else {
      onLaunchStudio();
    }
  };

  const handleNewProjectSubmit = (e) => {
    e?.preventDefault();
    if (customPrompt.trim()) {
      onGeneratePrompt(customPrompt.trim());
      setShowNewProjectModal(false);
    } else {
      onLaunchStudio();
      setShowNewProjectModal(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#080709] text-zinc-100" : "bg-[#fbf9f6] text-zinc-900"
      } antialiased selection:bg-amber-500/30 selection:text-white flex flex-col`}
    >
      {/* ================= FULL-WIDTH HEADER (NO SIDEBAR) ================= */}
      <header
        className={`sticky top-0 z-50 w-full px-6 sm:px-12 lg:px-16 py-4 border-b backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? "bg-[#080709]/85 border-white/[0.08]"
            : "bg-[#fbf9f6]/85 border-amber-900/10 shadow-sm"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection("hero")}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
              Blinky
            </span>
          </div>

          {/* Center Smooth-Scroll Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide">
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("circuits")}
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              Circuits
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Day / Night View Toggle */}
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

            {/* Star on GitHub (Bold Link with Animated Underline) */}
            <a
              href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs sm:text-sm font-bold font-outfit text-zinc-200 hover:text-amber-300 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Star className="w-4 h-4 fill-amber-400/90 text-amber-400 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
              <span className="font-outfit hidden sm:inline relative">
                Star on GitHub
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </span>
            </a>

            {/* Launch Studio CTA (Bold Handwritten / Brush Accent with Smooth Glow Transition) */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="group relative flex flex-col items-start text-sm sm:text-base font-black font-outfit text-white hover:text-amber-200 transition-all duration-300 py-1 cursor-pointer hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all duration-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
              </div>
              {/* Bold organic brush stroke underline with gradient & glow */}
              <svg
                className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.9)]"
                viewBox="0 0 110 10"
                fill="none"
              >
                <defs>
                  <linearGradient id="brushGradHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="60%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 6 C35 2, 75 8, 108 5"
                  stroke="url(#brushGradHeader)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
                <path
                  d="M8 8 C40 5, 80 8, 102 6"
                  stroke="url(#brushGradHeader)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ================= FULL-BLEED HERO BACKGROUND SECTION ================= */}
      <section
        id="hero"
        className="relative w-full min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden border-b border-white/[0.08]"
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 select-none">
          <img
            src="/images/blinky_hero_bg.jpg"
            alt="Blinky AI Electronics IoT Workbench"
            className="w-full h-full object-cover object-[75%_center] md:object-right lg:object-center transform scale-[1.02]"
          />

          {/* Left-to-Right Gradient Fade for Superior Text Legibility */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-r from-[#080709] via-[#080709]/90 md:via-60% to-[#080709]/30"
                : "bg-gradient-to-r from-[#fbf9f6] via-[#fbf9f6]/95 md:via-60% to-[#fbf9f6]/40"
            }`}
          />

          {/* Top Fade (Header Integration) and Bottom Fade (Transition into About Section) */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-b from-[#080709]/70 via-transparent to-[#080709]"
                : "bg-gradient-to-b from-[#fbf9f6]/70 via-transparent to-[#fbf9f6]"
            }`}
          />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl space-y-6 sm:space-y-7">
            {/* AI Assistant Tag - Clean without rigid box */}
            <div className="inline-flex items-center gap-2.5 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="tracking-[0.2em] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                AI-POWERED ELECTRONICS ASSISTANT
              </span>
            </div>

            {/* Main Headline - Bold & Expressive */}
            <div className="space-y-3">
              <h1
                className={`text-4xl sm:text-6xl lg:text-7xl font-black font-outfit tracking-tight leading-[1.08] ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Point. Understand.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 font-handwriting text-5xl sm:text-7xl lg:text-8xl font-normal block sm:inline drop-shadow-[0_2px_16px_rgba(239,68,68,0.4)]">
                  Build.
                </span>
              </h1>
              <p
                className={`text-base sm:text-xl font-medium font-outfit leading-relaxed ${
                  isDark ? "text-amber-200/90" : "text-amber-800"
                }`}
              >
                From physical circuit to working IoT project — powered by AI.
              </p>
            </div>

            {/* Description Subtitle */}
            <p
              className={`text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Capture your components with your phone camera, describe what you want to build, and Blinky synthesizes verified circuit wiring with production Arduino C++ firmware.
            </p>

            {/* CTAs - Bold, Expressive, and Animated with Organic Brush Stroke */}
            <div className="pt-3 flex flex-wrap items-center gap-8 sm:gap-12">
              {/* Primary Callout: Bold Hand-Drawn Brush Underline CTA */}
              <button
                type="button"
                onClick={() => setShowNewProjectModal(true)}
                className="group relative inline-flex flex-col items-start cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95"
              >
                <div className="flex items-center gap-3.5 text-2xl sm:text-3xl lg:text-4xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  <span>Start New Project</span>
                  <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-amber-400 group-hover:translate-x-3 transition-all duration-300 ease-out drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                </div>

                {/* Bold Textured Organic Brush Stroke with Gradient & Transition Glow */}
                <svg
                  className="w-full h-5 -mt-1 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.55)] group-hover:drop-shadow-[0_4px_20px_rgba(249,115,22,0.9)]"
                  viewBox="0 0 220 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="brushGradientHero" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  {/* Base heavy organic brush stroke */}
                  <path
                    d="M4 10 C35 4, 85 14, 140 7 C175 3, 200 9, 216 7"
                    stroke="url(#brushGradientHero)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Rough texture stroke to give authentic marker / brush feel */}
                  <path
                    d="M10 13 C55 8, 120 15, 195 9"
                    stroke="url(#brushGradientHero)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {/* Extra brush bristles accent */}
                  <path
                    d="M18 14 C70 12, 130 15, 170 11"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </button>

              {/* Secondary Callout: Bold Handwritten Link with Wavy Underline */}
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="group flex items-center gap-2.5 text-xl sm:text-2xl font-bold font-handwriting text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer py-1 hover:scale-105 active:scale-95"
              >
                <span className="underline decoration-amber-500/60 group-hover:decoration-amber-400 decoration-[3px] decoration-wavy underline-offset-8 transition-colors duration-300">
                  Explore Architecture
                </span>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300" />
              </button>
            </div>

            {/* Hand-drawn style note with curved doodle arrow matching reference */}
            <div className="pt-2 flex items-center gap-3 text-lg sm:text-xl font-bold font-handwriting text-zinc-300/90 select-none group">
              <span>Works with ESP32, Arduino, sensors and more.</span>
              <svg
                className="w-10 h-7 text-amber-400/90 -rotate-6 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1 group-hover:rotate-0"
                viewBox="0 0 45 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14 C16 22, 28 20, 38 8" />
                <path d="M30 7 L39 8 L36 17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Floating Bottom-Right Vision AI Note (No heavy border box) */}
        <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 hidden md:flex items-center gap-2.5 text-xs font-mono text-zinc-300 select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
            Gemini Vision AI
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-medium">Live Component Scanning</span>
        </div>
      </section>

      {/* ================= FULL-WIDTH MAIN CONTAINER ================= */}
      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-12 space-y-16 sm:space-y-24">

        {/* ================= SECTION 2: ABOUT BLINKY (RECONSTRUCTED EXACTLY FROM YOUR IMAGE LAYOUT!) ================= */}
        <section id="about" className="scroll-mt-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Massive Statement (Matching "THE HYPE STOPS HERE." layout in amber-red) */}
            <div className="lg:col-span-5 select-none space-y-1 overflow-visible">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-400 to-red-500 whitespace-nowrap">
                PHYSICAL
              </h2>
              <div
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] whitespace-nowrap ${
                  isDark ? "text-zinc-600/70" : "text-zinc-300"
                }`}
              >
                CIRCUITS.
              </div>
              <div
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] whitespace-nowrap ${
                  isDark ? "text-zinc-700/60" : "text-zinc-300/80"
                }`}
              >
                AI BRAIN.
              </div>
            </div>

            {/* Right Editorial Copy (Clean, focused, no clutter) */}
            <div className="lg:col-span-7 space-y-5 pt-1">
              <h3
                className={`text-xl sm:text-2xl font-bold font-outfit leading-snug ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                From a physical circuit to a working IoT project — powered by AI.
              </h3>

              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Blinky is an AI-powered electronics assistant that transforms real-world components into functional IoT projects. Users simply capture their circuit or available components using their phone camera and describe what they want to build.
              </p>

              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Blinky analyzes the visual input using AI and generates an accurate circuit diagram with component connections, pin mappings, and wiring guidance, along with the corresponding Arduino C++ code.
              </p>

              {/* Validation Note */}
              <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/[0.05] text-xs sm:text-sm text-amber-300/90 leading-relaxed flex items-start gap-3">
                <span className="font-mono font-bold text-amber-400 shrink-0">NOTE:</span>
                <span>
                  Automatic wiring and code generation is provided as AI-generated guidance until the system has validated those outputs against the actual hardware.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: HOW BLINKY WORKS (THE 4 PROGRESSIVE STEPS) ================= */}
        <section id="how-it-works" className="scroll-mt-24 w-full space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
              ✦ Process Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight">
              How Blinky Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 Capture & Describe */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-3xl sm:text-4xl font-black font-outfit text-amber-500 mb-3">01</div>
              <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Capture &amp; Describe</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Use the phone camera to capture components or an existing circuit and describe the desired project through voice or text.
              </p>
            </div>

            {/* 02 AI Understands */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-3xl sm:text-4xl font-black font-outfit text-orange-500 mb-3">02</div>
              <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">AI Understands</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Gemini Vision identifies components and interprets the user's requirements through the Blinky AI Agent, powered by Python and FastAPI.
              </p>
            </div>

            {/* 03 Circuit & Code Generation */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-3xl sm:text-4xl font-black font-outfit text-red-500 mb-3">03</div>
              <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Circuit &amp; Code</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Blinky generates a circuit diagram with the required connections and pin mappings, along with Arduino C++ code for the intended setup.
              </p>
            </div>

            {/* 04 Flash & Execute */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-3xl sm:text-4xl font-black font-outfit text-amber-400 mb-3">04</div>
              <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Flash &amp; Execute</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                The generated code is uploaded to the ESP32 through the hardware execution layer, while telemetry and real-time feedback help users monitor the project.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: CIRCUITS & SENSORS ================= */}
        <section id="circuits" className="scroll-mt-24 w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
                ✦ Hardware Library
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight">
                Featured Circuits
              </h2>
            </div>

            {/* Open Blinky Studio - Organic Brush Stroke */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="group relative inline-flex flex-col items-start cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95 py-1 self-start sm:self-auto"
            >
              <div className="flex items-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span>Open Blinky Studio</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all duration-300" />
              </div>
              <svg
                className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all duration-300 filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)] group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.85)]"
                viewBox="0 0 130 8"
                fill="none"
              >
                <path d="M2 5 C35 2, 80 7, 126 4" stroke="url(#brushGradientHero)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {circuitsList.map((c) => (
              <div
                key={c.id}
                onClick={() => handleLaunchProject(c.circuitKey)}
                className={`group rounded-3xl border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] ${
                  isDark
                    ? "border-white/[0.08] hover:border-amber-500/50 bg-[#0e0c10] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                    : "border-zinc-200 hover:border-amber-500/50 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-black">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className={`absolute top-3 right-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full border backdrop-blur-md ${c.badgeColor}`}>
                    {c.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-outfit mb-1.5 group-hover:text-amber-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-amber-500 font-semibold pt-2 border-t border-white/[0.06] group-hover:text-amber-400">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Zap className="w-2.5 h-2.5" />
                      </div>
                      <span>Launch in Studio</span>
                    </div>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-zinc-400 group-hover:text-amber-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 6: UNBOXED, BOLD IMPACT CTA ================= */}
        <section className="py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 select-none w-full">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Ready to dig in?
          </h2>

          {/* Big Monumental Bottom CTA with Huge Hand-Drawn Brush Stroke */}
          <button
            type="button"
            onClick={onLaunchStudio}
            className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95 py-2"
          >
            <div className="flex items-center gap-3.5 text-2xl sm:text-4xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors duration-300 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span>Start Building Circuits</span>
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 group-hover:text-amber-400 group-hover:translate-x-3 transition-all duration-300 ease-out drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
            </div>
            <svg
              className="w-full h-5 sm:h-6 -mt-1 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 group-hover:scale-y-125 transition-all duration-300 ease-out filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.55)] group-hover:drop-shadow-[0_4px_24px_rgba(249,115,22,0.95)]"
              viewBox="0 0 260 20"
              fill="none"
            >
              <path
                d="M4 11 C45 4, 115 15, 185 8 C220 4, 245 10, 256 8"
                stroke="url(#brushGradientHero)"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15 C75 9, 150 16, 235 10"
                stroke="url(#brushGradientHero)"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </button>

          <div className="font-handwriting text-amber-400 text-2xl sm:text-3xl pt-2 -rotate-2 select-none">
            Keep building :)
          </div>
        </section>

        {/* ================= MINIMALIST FOOTER ================= */}
        <footer className="pt-8 pb-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-bold text-amber-400 text-sm">Blinky</span>
            <span>&bull;</span>
            <span>Capture &bull; Understand &bull; Connect &bull; Create</span>
          </div>

          <a
            href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Star on GitHub</span>
          </a>
        </footer>
      </main>

      {/* ================= MODAL: NEW PROJECT (AI PROMPT) ================= */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#100d13] border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewProjectModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-xl font-bold text-white font-outfit">
                New IoT Circuit Project
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Describe what you want to build or pick a starter template.
            </p>

            <form onSubmit={handleNewProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  AI Prompt:
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Ultrasonic distance sensor with buzzer alarm and red alert LED on ESP32..."
                  className="w-full bg-[#18131c] border border-white/[0.1] rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
                  autoFocus
                />
              </div>

              {/* Quick Starters */}
              <div>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-2">
                  Featured Starters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {circuitsList.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        handleLaunchProject(c.circuitKey);
                        setShowNewProjectModal(false);
                      }}
                      className="text-xs px-3 py-1.5 rounded-xl bg-[#1a1420] border border-white/[0.08] hover:border-amber-500/40 text-zinc-300 hover:text-white transition-colors"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group px-6 py-2.5 text-xs font-bold bg-[#131117] hover:bg-[#1a141e] border border-amber-500/35 hover:border-amber-500/70 text-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] flex items-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <div className="w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                  <span>{customPrompt.trim() ? "Generate Project" : "Open Studio"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
