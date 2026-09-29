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
          <div className="flex items-center gap-3.5">
            {/* Day / Night View Toggle */}
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
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-amber-600" />
              )}
            </button>

            {/* Star on GitHub */}
            <a
              href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-red-500/15 hover:from-amber-500/25 hover:to-red-500/25 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-outfit hidden sm:inline">Star on GitHub</span>
            </a>

            {/* Launch Studio CTA */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="group px-4 py-2 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white text-xs font-bold shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2.5"
            >
              <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="font-outfit">Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= FULL-WIDTH MAIN CONTAINER ================= */}
      <main className="flex-1 w-full px-6 sm:px-12 lg:px-16 py-12 space-y-28 sm:space-y-36">
        {/* ================= HERO SECTION (LARGE HEADINGS, SINGLE CLEAR FOCAL POINT) ================= */}
        <section id="hero" className="scroll-mt-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-amber-500 uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>AI-Powered Electronics Assistant</span>
              </div>

              <h1
                className={`text-5xl sm:text-7xl lg:text-8xl font-black font-outfit tracking-tight leading-[1.05] ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                From circuit to working IoT project.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 font-handwriting text-6xl sm:text-8xl lg:text-9xl font-normal block mt-1">
                  Powered by AI.
                </span>
              </h1>

              <p
                className={`text-base sm:text-xl font-normal leading-relaxed max-w-2xl ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Capture your components with your phone camera, describe what you want to build, and Blinky synthesizes verified circuit wiring with production Arduino C++ firmware.
              </p>

              {/* Tagline */}
              <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-amber-400/90 font-semibold pt-1">
                Capture &bull; Understand &bull; Connect &bull; Create
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(true)}
                  className="group px-7 py-3.5 rounded-2xl border border-amber-500/35 hover:border-amber-500/70 bg-[#131117] hover:bg-[#1a141e] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-outfit">Start New Project</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="group px-6 py-3.5 rounded-2xl border border-white/10 hover:border-amber-500/40 bg-[#100d14] hover:bg-[#161219] text-zinc-200 hover:text-white text-sm font-semibold shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-outfit">Explore Architecture</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Realistic Image Focal Point (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] group">
                <img
                  src="/images/blinky_vision_scan.jpg"
                  alt="Phone Camera Vision AI Component Scanning"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Gemini Vision AI Component Detection</span>
                    </span>
                    <p className="text-xs text-zinc-300">
                      Instantly identifies ESP32, ultrasonic sensors, potentiometers, and resistors from live camera frames.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: ABOUT BLINKY (RECONSTRUCTED EXACTLY FROM YOUR IMAGE LAYOUT!) ================= */}
        <section id="about" className="scroll-mt-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Massive Statement (Matching "THE HYPE STOPS HERE." layout in amber-red) */}
            <div className="lg:col-span-5 select-none space-y-1">
              <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black font-outfit uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-400 to-red-500">
                PHYSICAL
              </h2>
              <div
                className={`text-6xl sm:text-8xl lg:text-9xl font-black font-outfit uppercase tracking-tighter leading-none ${
                  isDark ? "text-zinc-600/70" : "text-zinc-300"
                }`}
              >
                CIRCUITS.
              </div>
              <div
                className={`text-6xl sm:text-8xl lg:text-9xl font-black font-outfit uppercase tracking-tighter leading-none ${
                  isDark ? "text-zinc-700/60" : "text-zinc-300/80"
                }`}
              >
                AI BRAIN.
              </div>
            </div>

            {/* Right Editorial Copy (Clean, focused, no clutter) */}
            <div className="lg:col-span-7 space-y-6 pt-2">
              <h3
                className={`text-2xl sm:text-3xl font-bold font-outfit leading-snug ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                From a physical circuit to a working IoT project — powered by AI.
              </h3>

              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Blinky is an AI-powered electronics assistant that transforms real-world components into functional IoT projects. Users simply capture their circuit or available components using their phone camera and describe what they want to build.
              </p>

              <p
                className={`text-base sm:text-lg leading-relaxed ${
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
        <section id="how-it-works" className="scroll-mt-24 w-full space-y-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
              ✦ Process Workflow
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-outfit tracking-tight">
              How Blinky Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 Capture & Describe */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-4xl font-black font-outfit text-amber-500 mb-3">01</div>
              <h3 className="text-lg font-bold font-outfit mb-2 text-white">Capture &amp; Describe</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Use the phone camera to capture components or an existing circuit and describe the desired project through voice or text.
              </p>
            </div>

            {/* 02 AI Understands */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-4xl font-black font-outfit text-orange-500 mb-3">02</div>
              <h3 className="text-lg font-bold font-outfit mb-2 text-white">AI Understands</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Gemini Vision identifies components and interprets the user's requirements through the Blinky AI Agent, powered by Python and FastAPI.
              </p>
            </div>

            {/* 03 Circuit & Code Generation */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-4xl font-black font-outfit text-red-500 mb-3">03</div>
              <h3 className="text-lg font-bold font-outfit mb-2 text-white">Circuit &amp; Code</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Blinky generates a circuit diagram with the required connections and pin mappings, along with Arduino C++ code for the intended setup.
              </p>
            </div>

            {/* 04 Flash & Execute */}
            <div className={`p-6 rounded-3xl border transition-all ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="text-4xl font-black font-outfit text-amber-400 mb-3">04</div>
              <h3 className="text-lg font-bold font-outfit mb-2 text-white">Flash &amp; Execute</h3>
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
              <h2 className="text-4xl sm:text-6xl font-black font-outfit tracking-tight">
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
            <h2 className="text-4xl sm:text-6xl font-black font-outfit tracking-tight">
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
        <section className="py-24 sm:py-36 text-center flex flex-col items-center justify-center space-y-8 select-none w-full">
          <h2 className="text-5xl sm:text-7xl lg:text-9xl font-black font-outfit uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
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
