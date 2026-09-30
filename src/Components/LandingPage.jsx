import { useState, useEffect, useLayoutEffect, useRef } from "react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveCircuitStory from "./InteractiveCircuitStory";

gsap.registerPlugin(ScrollTrigger);

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

  // Master container & element refs for GSAP ScrollTrigger
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroTitlePart1Ref = useRef(null);
  const heroTitlePart2Ref = useRef(null);
  const heroSubheadRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroCtasRef = useRef(null);
  const heroConduitRef = useRef(null);

  // Transition conduits
  const heroToCircuitConduitRef = useRef(null);
  const circuitToAboutConduitRef = useRef(null);
  const neuralDistributorRef = useRef(null);
  const aboutToWorkflowConduitRef = useRef(null);
  const workflowBusRef = useRef(null);

  // Section 2 refs
  const aboutSectionRef = useRef(null);
  const aboutWord1Ref = useRef(null);
  const aboutWord2Ref = useRef(null);
  const aboutWord3Ref = useRef(null);
  const aboutContentRef = useRef(null);

  // Section 3 refs
  const howItWorksSectionRef = useRef(null);

  // Bottom CTA ref
  const bottomCtaRef = useRef(null);
  const bottomCtaPowerRingRef = useRef(null);

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

  // Master GSAP Animation & Scroll-Driven Storytelling Sequence
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // If reduced motion is requested, reveal all elements immediately without pin or stagger
        gsap.set(
          [
            headerRef.current,
            heroBgRef.current,
            heroTagRef.current,
            heroTitlePart1Ref.current,
            heroTitlePart2Ref.current,
            heroSubheadRef.current,
            heroDescRef.current,
            heroCtasRef.current,
            heroToCircuitConduitRef.current,
            circuitToAboutConduitRef.current,
            neuralDistributorRef.current,
            aboutWord1Ref.current,
            aboutWord2Ref.current,
            aboutWord3Ref.current,
            aboutContentRef.current,
            aboutToWorkflowConduitRef.current,
            bottomCtaRef.current,
            bottomCtaPowerRingRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1 }
        );
        return;
      }

      // ================= 1. CINEMATIC ENTRANCE TIMELINE (ON PAGE ARRIVAL) =================
      const enterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Step 1: Dark background is present; header gently lowers
      enterTl.fromTo(
        headerRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 }
      );

      // Step 2: Hero background image shifts smoothly into focus
      enterTl.fromTo(
        heroBgRef.current,
        { scale: 1.08, opacity: 0.5 },
        { scale: 1.02, opacity: 1, duration: 1.6, ease: "power2.out" },
        0.15
      );

      // Step 3: Tiny amber pulse & AI tag reveal
      enterTl.fromTo(
        heroTagRef.current,
        { opacity: 0, scale: 0.88, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" },
        0.35
      );

      // Step 4: Controlled heading entrance: "Point. Understand." then "Build."
      enterTl.fromTo(
        heroTitlePart1Ref.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.55
      );

      enterTl.fromTo(
        heroTitlePart2Ref.current,
        { opacity: 0, scale: 0.88, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.5)" },
        0.75
      );

      // Step 5: Supporting text appears
      enterTl.fromTo(
        heroSubheadRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75 },
        0.95
      );

      // Step 6: Description subtitle
      enterTl.fromTo(
        heroDescRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75 },
        1.1
      );

      // Step 7: CTAs appear with their hand-drawn brush stroke
      enterTl.fromTo(
        heroCtasRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85 },
        1.25
      );

      // Step 8: Hero Central Conductive Conduit initializes
      if (heroToCircuitConduitRef.current) {
        enterTl.fromTo(
          heroToCircuitConduitRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          1.5
        );
      }

      // ================= 2. HERO SCROLL-DRIVEN SCRUB & PARALLAX =================
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "+=85%",
          scrub: 0.65,
        },
      });

      // Hero content recedes smoothly as scroll progresses
      heroScrollTl
        .to(
          heroContentRef.current,
          { y: -60, scale: 0.94, opacity: 0.2, ease: "none" },
          0
        )
        .to(
          heroBgRef.current,
          { y: 80, scale: 1.06, ease: "none" },
          0
        );

      // Central conduit draws downward as user scrolls, leading directly into the circuit story
      if (heroConduitRef.current) {
        heroScrollTl.fromTo(
          heroConduitRef.current,
          { strokeDasharray: 260, strokeDashoffset: 260 },
          { strokeDashoffset: 0, ease: "none" },
          0.1
        );
      }

      // ================= 3. CIRCUIT TO SECTION 2 CONDUIT & "PHYSICAL CIRCUITS. AI BRAIN." REVEAL =================
      // Conduit leaving the circuit canvas and striking the AI Neural Distributor Node
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 80%",
          end: "top 45%",
          scrub: 0.6,
        },
      });

      if (circuitToAboutConduitRef.current) {
        aboutTl.fromTo(
          circuitToAboutConduitRef.current,
          { strokeDasharray: 240, strokeDashoffset: 240 },
          { strokeDashoffset: 0, ease: "none" }
        );
      }

      if (neuralDistributorRef.current) {
        aboutTl.fromTo(
          neuralDistributorRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, ease: "back.out(1.5)" },
          "-=0.3"
        );
      }

      // Staggered illumination of the 3 monumental words as the signal branches
      aboutTl.fromTo(
        aboutWord1Ref.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" }
      );
      aboutTl.fromTo(
        aboutWord2Ref.current,
        { y: 35, opacity: 0.2 },
        { y: 0, opacity: 1, ease: "power2.out" },
        "-=0.2"
      );
      aboutTl.fromTo(
        aboutWord3Ref.current,
        { y: 35, opacity: 0.2 },
        { y: 0, opacity: 1, ease: "power2.out" },
        "-=0.2"
      );

      gsap.fromTo(
        aboutContentRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutSectionRef.current,
            start: "top 68%",
          },
        }
      );

      // ================= 4. SECTION 3: "HOW BLINKY WORKS" CONNECTED BUS =================
      // Conduit leading from Section 2 into Section 3 workflow bus
      const workflowTl = gsap.timeline({
        scrollTrigger: {
          trigger: howItWorksSectionRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 0.7,
        },
      });

      if (aboutToWorkflowConduitRef.current) {
        workflowTl.fromTo(
          aboutToWorkflowConduitRef.current,
          { strokeDasharray: 260, strokeDashoffset: 260 },
          { strokeDashoffset: 0, ease: "none" }
        );
      }

      if (workflowBusRef.current) {
        workflowTl.fromTo(
          workflowBusRef.current,
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          { strokeDashoffset: 0, ease: "none" }
        );
      }

      // The 4 workflow cards activate sequentially as current reaches each station
      gsap.fromTo(
        ".workflow-card",
        { y: 40, opacity: 0.35, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 72%",
          },
        }
      );

      // ================= 5. MONUMENTAL BOTTOM CTA (MASTER POWER TERMINAL) =================
      const bottomTl = gsap.timeline({
        scrollTrigger: {
          trigger: bottomCtaRef.current,
          start: "top 80%",
        },
      });

      bottomTl.fromTo(
        bottomCtaPowerRingRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }
      );

      bottomTl.fromTo(
        bottomCtaRef.current,
        { y: 35, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
        0.15
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  // Starter templates preserved for modal
  const starterCircuits = [
    {
      id: "flagship",
      circuitKey: "flagship",
      title: "HC-SR04 Water Level",
    },
    {
      id: "preset1",
      circuitKey: "preset1",
      title: "LED Blink Controller",
    },
    {
      id: "oled_display",
      circuitKey: "oled_display",
      title: "SSD1306 0.96\" OLED",
    },
    {
      id: "joystick",
      circuitKey: "joystick",
      title: "Dual-Axis Joystick",
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
      ref={pageRef}
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#080709] text-zinc-100" : "bg-[#fbf9f6] text-zinc-900"
      } antialiased selection:bg-amber-500/30 selection:text-white flex flex-col`}
    >
      {/* ================= FULL-WIDTH HEADER (ENTRANCE TIMELINE) ================= */}
      <header
        ref={headerRef}
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

          {/* Center Smooth-Scroll Narrative Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide">
            <button
              type="button"
              onClick={() => scrollToSection("circuit-story")}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Circuit Story</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              How It Works
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

            {/* Star on GitHub */}
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

            {/* Launch Studio CTA with Glowing Handwritten Brush Stroke */}
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

      {/* ================= HERO SECTION (ENTRANCE SEQUENCE & SCROLL SCRUB) ================= */}
      <section
        ref={heroSectionRef}
        id="hero"
        className="relative w-full min-h-[660px] sm:min-h-[740px] lg:min-h-[800px] flex items-center overflow-hidden border-b border-white/[0.08]"
      >
        {/* Background Image Layer with Cinematic Parallax */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <img
            ref={heroBgRef}
            src="/images/blinky_hero_bg.jpg"
            alt="Blinky AI Electronics IoT Workbench"
            className="w-full h-full object-cover object-[75%_center] md:object-right lg:object-center transform will-change-transform"
          />

          {/* Left-to-Right Gradient Fade for Superior Text Legibility */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-r from-[#080709] via-[#080709]/90 md:via-60% to-[#080709]/30"
                : "bg-gradient-to-r from-[#fbf9f6] via-[#fbf9f6]/95 md:via-60% to-[#fbf9f6]/40"
            }`}
          />

          {/* Top & Bottom Cinematic Fade */}
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

        {/* Hero Content Container (Controlled Entrance Sequence) */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24 will-change-transform"
        >
          <div className="max-w-2xl space-y-6 sm:space-y-7">
            {/* Step 3: AI Assistant Tag */}
            <div
              ref={heroTagRef}
              className="inline-flex items-center gap-2.5 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase select-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="tracking-[0.2em] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                AI-POWERED ELECTRONICS ASSISTANT
              </span>
            </div>

            {/* Step 4: Main Headline - Assembling in Controlled Sequence */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-outfit tracking-tight leading-[1.08] select-none">
                <span
                  ref={heroTitlePart1Ref}
                  className={`inline-block ${isDark ? "text-white" : "text-zinc-950"}`}
                >
                  Point. Understand.
                </span>{" "}
                <span
                  ref={heroTitlePart2Ref}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 font-handwriting text-5xl sm:text-7xl lg:text-8xl font-normal drop-shadow-[0_2px_16px_rgba(239,68,68,0.4)]"
                >
                  Build.
                </span>
              </h1>
              {/* Step 5: Supporting Subhead */}
              <p
                ref={heroSubheadRef}
                className={`text-base sm:text-xl font-medium font-outfit leading-relaxed ${
                  isDark ? "text-amber-200/90" : "text-amber-800"
                }`}
              >
                From physical circuit to working IoT project — powered by AI.
              </p>
            </div>

            {/* Step 6: Description Subtitle */}
            <p
              ref={heroDescRef}
              className={`text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Capture your components with your phone camera, describe what you want to build, and Blinky synthesizes verified circuit wiring with production Arduino C++ firmware.
            </p>

            {/* Step 7: CTAs - Bold, Expressive, and Animated with Organic Brush Stroke */}
            <div
              ref={heroCtasRef}
              className="pt-3 flex flex-wrap items-center gap-8 sm:gap-12"
            >
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

                {/* Bold Textured Organic Brush Stroke */}
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
                  <path
                    d="M4 10 C35 4, 85 14, 140 7 C175 3, 200 9, 216 7"
                    stroke="url(#brushGradientHero)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 13 C55 8, 120 15, 195 9"
                    stroke="url(#brushGradientHero)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
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
                onClick={() => scrollToSection("circuit-story")}
                className="group flex items-center gap-2.5 text-xl sm:text-2xl font-bold font-handwriting text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer py-1 hover:scale-105 active:scale-95"
              >
                <span className="underline decoration-amber-500/60 group-hover:decoration-amber-400 decoration-[3px] decoration-wavy underline-offset-8 transition-colors duration-300">
                  Explore Architecture
                </span>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-2 transition-all duration-300" />
              </button>
            </div>

            {/* Hand-drawn style note with curved doodle arrow */}
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

        {/* Floating Bottom-Right Vision AI Note */}
        <div className="absolute right-6 sm:right-10 lg:right-14 bottom-8 hidden md:flex items-center gap-2.5 text-xs font-mono text-zinc-300 select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
            Gemini Vision AI
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-medium">Live Component Scanning</span>
        </div>

        {/* ================= CONNECTIVE CONDUIT: HERO TO CIRCUIT STORY ================= */}
        <div
          ref={heroToCircuitConduitRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-ping" />
          <svg className="w-6 h-20 overflow-visible" viewBox="0 0 24 80" fill="none">
            <path
              ref={heroConduitRef}
              d="M 12 0 L 12 80"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="260"
              strokeDashoffset="260"
            />
          </svg>
        </div>
      </section>

      {/* ================= INTERACTIVE STORY CHAPTER: WATCH YOUR CIRCUIT BUILD ITSELF ================= */}
      <section id="circuit-story" className="scroll-mt-20 w-full relative">
        <InteractiveCircuitStory
          isDark={isDark}
          onLaunchStudio={onLaunchStudio}
        />

        {/* Connective Conduit: Circuit Story down into Section 2 */}
        <div className="w-full flex flex-col items-center pointer-events-none -mt-4 mb-2 z-20">
          <svg className="w-6 h-16 overflow-visible" viewBox="0 0 24 64" fill="none">
            <path
              ref={circuitToAboutConduitRef}
              d="M 12 0 L 12 64"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="240"
              strokeDashoffset="240"
            />
          </svg>
        </div>
      </section>

      {/* ================= FULL-WIDTH MAIN CONTAINER ================= */}
      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-16 space-y-20 sm:space-y-28">

        {/* ================= SECTION 2: ABOUT BLINKY ("PHYSICAL CIRCUITS. AI BRAIN.") ================= */}
        <section ref={aboutSectionRef} id="about" className="scroll-mt-24 w-full">
          {/* Central AI Neural Distributor Node */}
          <div className="w-full flex justify-center mb-8">
            <div
              ref={neuralDistributorRef}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <Cpu size={14} className="text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              <span>AI Neural Netlist Distributor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Massive Statement - Reveal on Scroll */}
            <div className="lg:col-span-5 select-none space-y-1 overflow-hidden">
              <div ref={aboutWord1Ref}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-400 to-red-500 whitespace-nowrap drop-shadow-[0_2px_15px_rgba(245,158,11,0.3)]">
                  PHYSICAL
                </h2>
              </div>
              <div
                ref={aboutWord2Ref}
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] whitespace-nowrap transition-colors duration-300 ${
                  isDark ? "text-orange-400/90" : "text-zinc-600"
                }`}
              >
                CIRCUITS.
              </div>
              <div
                ref={aboutWord3Ref}
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] whitespace-nowrap transition-colors duration-300 ${
                  isDark ? "text-red-500/90" : "text-zinc-700"
                }`}
              >
                AI BRAIN.
              </div>
            </div>

            {/* Right Editorial Copy */}
            <div ref={aboutContentRef} className="lg:col-span-7 space-y-5 pt-1">
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

          {/* Connective Conduit: Section 2 down into Section 3 Workflow */}
          <div className="w-full flex justify-center mt-12 pointer-events-none">
            <svg className="w-6 h-16 overflow-visible" viewBox="0 0 24 64" fill="none">
              <path
                ref={aboutToWorkflowConduitRef}
                d="M 12 0 L 12 64"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="260"
                strokeDashoffset="260"
              />
            </svg>
          </div>
        </section>

        {/* ================= SECTION 3: HOW BLINKY WORKS (THE 4 PROGRESSIVE STEPS) ================= */}
        <section ref={howItWorksSectionRef} id="how-it-works" className="scroll-mt-24 w-full space-y-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
                ✦ Continuous Execution Pipeline
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-white">
                How Blinky Works
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Activity size={14} className="text-emerald-400" />
              <span>4 STATIONS // SYNCHRONIZED</span>
            </div>
          </div>

          {/* Horizontal Circuit Bus Bar (Desktop) */}
          <div className="relative">
            <svg
              className="absolute -top-4 left-0 right-0 w-full h-8 pointer-events-none hidden lg:block overflow-visible"
              viewBox="0 0 1000 32"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                ref={workflowBusRef}
                d="M 0 16 L 1000 16"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                strokeLinecap="round"
              />
              <circle cx="125" cy="16" r="4.5" fill="#f59e0b" />
              <circle cx="375" cy="16" r="4.5" fill="#f97316" />
              <circle cx="625" cy="16" r="4.5" fill="#ef4444" />
              <circle cx="875" cy="16" r="4.5" fill="#10b981" />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {/* 01 Capture & Describe */}
              <div className={`workflow-card p-6 rounded-3xl border transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl sm:text-4xl font-black font-outfit text-amber-500">01</div>
                  <Camera size={20} className="text-amber-400/80" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Capture &amp; Describe</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Use the phone camera to capture components or an existing circuit and describe the desired project through voice or text.
                </p>
              </div>

              {/* 02 AI Understands */}
              <div className={`workflow-card p-6 rounded-3xl border transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl sm:text-4xl font-black font-outfit text-orange-500">02</div>
                  <Bot size={20} className="text-orange-400/80" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">AI Understands</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Gemini Vision identifies components and interprets the user's requirements through the Blinky AI Agent, powered by Python and FastAPI.
                </p>
              </div>

              {/* 03 Circuit & Code Generation */}
              <div className={`workflow-card p-6 rounded-3xl border transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_8px_30px_rgba(239,68,68,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl sm:text-4xl font-black font-outfit text-red-500">03</div>
                  <Terminal size={20} className="text-red-400/80" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Circuit &amp; Code</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Blinky generates a circuit diagram with the required connections and pin mappings, along with Arduino C++ code for the intended setup.
                </p>
              </div>

              {/* 04 Flash & Execute */}
              <div className={`workflow-card p-6 rounded-3xl border transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl sm:text-4xl font-black font-outfit text-emerald-400">04</div>
                  <Flame size={20} className="text-emerald-400/80" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-outfit mb-2 text-white">Flash &amp; Execute</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  The generated code is uploaded to the ESP32 through the hardware execution layer, while telemetry and real-time feedback help users monitor the project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: UNBOXED, BOLD IMPACT CTA (MASTER POWER TERMINAL) ================= */}
        <section
          ref={bottomCtaRef}
          className="py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 select-none w-full relative"
        >
          {/* Collector Power Ring behind Final CTA */}
          <div
            ref={bottomCtaPowerRingRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-amber-500/20 bg-radial-gradient pointer-events-none blur-xl"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.05) 50%, transparent 75%)",
            }}
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap size={13} className="text-amber-400" />
            <span>Master Control Terminal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Ready to dig in?
          </h2>

          {/* Big Monumental Bottom CTA with Huge Hand-Drawn Brush Stroke */}
          <button
            type="button"
            onClick={onLaunchStudio}
            className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.04] active:scale-95 py-2 z-10"
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
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
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
                  {starterCircuits.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        handleLaunchProject(c.circuitKey);
                        setShowNewProjectModal(false);
                      }}
                      className="text-xs px-3 py-1.5 rounded-xl bg-[#1a1420] border border-white/[0.08] hover:border-amber-500/40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
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
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group px-6 py-2.5 text-xs font-bold bg-[#131117] hover:bg-[#1a141e] border border-amber-500/35 hover:border-amber-500/70 text-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(245,158,11,0.2)] flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
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
