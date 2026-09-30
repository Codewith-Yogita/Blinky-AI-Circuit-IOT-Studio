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

  // Tech stack items
  const techStack = [
    { category: "Frontend", items: ["React Native", "Expo", "React", "SVG"] },
    { category: "AI & Backend", items: ["Google Gemini Vision", "Python", "FastAPI"] },
    { category: "Hardware", items: ["ESP32 DevKit V1", "Breadboard Sensors", "Arduino C++"] },
    { category: "Execution", items: ["PySerial", "esptool WebSerial"] },
    { category: "Voice Guidance", items: ["ElevenLabs Audio API"] },
    { category: "Cloud & Telemetry", items: ["TigerData / PostgreSQL", "DigitalOcean"] },
  ];

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
            <button
              type="button"
              onClick={() => scrollToSection("tech-stack")}
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              Tech Stack
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-6 sm:gap-7">
            {/* Day / Night View Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
              title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-amber-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Star on GitHub (Clean Link Without Box) */}
            <a
              href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400/70 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-outfit hidden sm:inline group-hover:underline underline-offset-4 decoration-amber-500/50">
                Star on GitHub
              </span>
            </a>

            {/* Launch Studio CTA (Handwritten / Brush Accent Link Without Rigid Box) */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="group relative flex flex-col items-start text-xs sm:text-sm font-bold font-outfit text-white hover:text-amber-300 transition-colors py-1 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              {/* Organic hand-drawn brush stroke underline */}
              <svg
                className="w-full h-2 -mt-0.5 text-red-500/90 group-hover:text-amber-400 transition-colors overflow-visible"
                viewBox="0 0 100 8"
                fill="none"
              >
                <path
                  d="M2 5 C30 2, 65 7, 98 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
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
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-amber-400 uppercase select-none">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>AI-Powered Electronics Assistant</span>
            </div>

            {/* Main Headline - Bold & Expressive */}
            <div className="space-y-3">
              <h1
                className={`text-4xl sm:text-6xl lg:text-7xl font-black font-outfit tracking-tight leading-[1.08] ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Point. Understand.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 font-handwriting text-5xl sm:text-7xl lg:text-8xl font-normal block sm:inline">
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

            {/* CTAs - Removed rigid boxes in favor of handwritten brush stroke aesthetic */}
            <div className="pt-2 flex flex-wrap items-center gap-8 sm:gap-10">
              {/* Primary Callout: Hand-Drawn Brush Underline CTA */}
              <button
                type="button"
                onClick={() => setShowNewProjectModal(true)}
                className="group relative inline-flex flex-col items-start cursor-pointer transition-transform hover:scale-[1.03] active:scale-95"
              >
                <div className="flex items-center gap-3 text-2xl sm:text-3xl font-bold font-outfit text-white group-hover:text-amber-300 transition-colors">
                  <span>Start New Project</span>
                  <ArrowRight className="w-6 h-6 text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300" />
                </div>
                {/* Organic Hand-Drawn Paint/Brush Stroke Underline */}
                <svg
                  className="w-full h-4 -mt-1 text-red-500 group-hover:text-orange-400 transition-colors duration-300 overflow-visible"
                  viewBox="0 0 200 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9 C45 4, 110 13, 175 6 C188 5, 195 8, 198 7"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12 C60 8, 125 14, 185 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </svg>
              </button>

              {/* Secondary Callout: Handwritten Link with Wavy Underline */}
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="group flex items-center gap-2 text-lg sm:text-xl font-handwriting text-zinc-400 hover:text-white transition-colors cursor-pointer py-1"
              >
                <span className="underline decoration-zinc-600 group-hover:decoration-amber-400 decoration-wavy underline-offset-8 transition-colors">
                  Explore Architecture
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            {/* Hand-drawn style note with curved doodle arrow matching reference */}
            <div className="pt-2 flex items-center gap-3 text-base sm:text-lg font-handwriting text-zinc-400 select-none">
              <span>Works with ESP32, Arduino, sensors and more.</span>
              <svg
                className="w-9 h-6 text-zinc-500 -rotate-6"
                viewBox="0 0 45 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
        <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
            Gemini Vision AI
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Live Component Scanning</span>
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

            <button
              type="button"
              onClick={onLaunchStudio}
              className="group px-5 py-2.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white text-xs font-bold shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 self-start sm:self-auto"
            >
              <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="font-outfit">Open Blinky Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
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

        {/* ================= SECTION 6: TECH STACK (CLEAN CATEGORIZED PILLS, NO CLUTTER) ================= */}
        <section id="tech-stack" className="scroll-mt-24 w-full space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
              ✦ Engineering Stack
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight">
              Tech Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((group, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${
                  isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200"
                } space-y-3.5`}
              >
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#161219] text-xs font-mono text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 7: UNBOXED, BOLD IMPACT CTA ================= */}
        <section className="py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 select-none w-full">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Ready to dig in?
          </h2>

          <button
            type="button"
            onClick={onLaunchStudio}
            className="group px-9 sm:px-12 py-4 sm:py-5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_8px_32px_rgba(0,0,0,0.7)] hover:shadow-[0_0_24px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3.5"
          >
            <div className="w-7 h-7 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-outfit uppercase tracking-wider">Start Building Circuits</span>
            <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
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
