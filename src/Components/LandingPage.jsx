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
  Menu,
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
  onOpenChat,
  onSelectPreset,
  onGeneratePrompt,
  isLoading = false,
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blinky-theme") || "dark";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Transition conduits
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
    const isMobile = window.innerWidth < 768;

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

      // Step 1: Header gently lowers
      enterTl.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      // Step 2: Hero background image shifts smoothly into focus
      enterTl.fromTo(
        heroBgRef.current,
        { scale: isMobile ? 1.04 : 1.08, opacity: 0.5 },
        { scale: 1.01, opacity: 1, duration: 1.5, ease: "power2.out" },
        0.15
      );

      // Step 3: Tiny amber pulse & AI tag reveal
      enterTl.fromTo(
        heroTagRef.current,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
        0.3
      );

      // Step 4: Controlled heading entrance: "Point. Understand." then "Build."
      enterTl.fromTo(
        heroTitlePart1Ref.current,
        { opacity: 0, y: isMobile ? 20 : 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0.5
      );

      enterTl.fromTo(
        heroTitlePart2Ref.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.4)" },
        0.7
      );

      // Step 5: Supporting text appears
      enterTl.fromTo(
        heroSubheadRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.9
      );

      // Step 6: Description subtitle
      enterTl.fromTo(
        heroDescRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.05
      );

      // Step 7: CTAs appear with their hand-drawn brush stroke
      enterTl.fromTo(
        heroCtasRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      );

      // ================= 2. HERO SCROLL-DRIVEN SCRUB & PARALLAX =================
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: isMobile ? "+=60%" : "+=85%",
          scrub: isMobile ? 0.45 : 0.65,
        },
      });

      // Hero content recedes smoothly as scroll progresses (restrained on mobile)
      heroScrollTl
        .to(
          heroContentRef.current,
          { y: isMobile ? -25 : -60, scale: isMobile ? 0.97 : 0.94, opacity: isMobile ? 0.35 : 0.2, ease: "none" },
          0
        )
        .to(
          heroBgRef.current,
          { y: isMobile ? 25 : 80, scale: 1.04, ease: "none" },
          0
        );

      // ================= 3. CIRCUIT TO SECTION 2 CONDUIT & "PHYSICAL CIRCUITS. AI BRAIN." REVEAL =================
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 85%",
          end: "top 45%",
          scrub: isMobile ? 0.45 : 0.6,
        },
      });

      if (circuitToAboutConduitRef.current) {
        aboutTl.fromTo(
          circuitToAboutConduitRef.current,
          { strokeDasharray: 180, strokeDashoffset: 180 },
          { strokeDashoffset: 0, ease: "none" }
        );
      }

      if (neuralDistributorRef.current) {
        aboutTl.fromTo(
          neuralDistributorRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, ease: "back.out(1.5)" },
          "-=0.3"
        );
      }

      // Staggered illumination of the 3 monumental words as the signal branches
      aboutTl.fromTo(
        aboutWord1Ref.current,
        { y: isMobile ? 20 : 35, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" }
      );
      aboutTl.fromTo(
        aboutWord2Ref.current,
        { y: isMobile ? 20 : 35, opacity: 0.2 },
        { y: 0, opacity: 1, ease: "power2.out" },
        "-=0.2"
      );
      aboutTl.fromTo(
        aboutWord3Ref.current,
        { y: isMobile ? 20 : 35, opacity: 0.2 },
        { y: 0, opacity: 1, ease: "power2.out" },
        "-=0.2"
      );

      gsap.fromTo(
        aboutContentRef.current,
        { y: isMobile ? 20 : 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutSectionRef.current,
            start: "top 75%",
          },
        }
      );

      // ================= 4. SECTION 3: "HOW BLINKY WORKS" CONNECTED BUS =================
      const workflowTl = gsap.timeline({
        scrollTrigger: {
          trigger: howItWorksSectionRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: isMobile ? 0.45 : 0.65,
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
        { y: isMobile ? 20 : 35, opacity: 0.35, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: "top 78%",
          },
        }
      );

      // ================= 5. MONUMENTAL BOTTOM CTA (MASTER POWER TERMINAL) =================
      const bottomTl = gsap.timeline({
        scrollTrigger: {
          trigger: bottomCtaRef.current,
          start: "top 85%",
        },
      });

      bottomTl.fromTo(
        bottomCtaPowerRingRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)" }
      );

      bottomTl.fromTo(
        bottomCtaRef.current,
        { y: isMobile ? 20 : 35, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0.1
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
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

  return (
    <div
      ref={pageRef}
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#080709] text-zinc-100" : "bg-[#fbf9f6] text-zinc-900"
      } antialiased selection:bg-amber-500/30 selection:text-white flex flex-col w-full overflow-x-hidden`}
    >
      {/* ================= RESPONSIVE HEADER ================= */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? "bg-[#080709]/90 border-white/[0.08]"
            : "bg-[#fbf9f6]/90 border-amber-900/10 shadow-sm"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className={`flex items-center cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 ${
              isDark
                ? "py-0.5"
                : "bg-[#0d0a14] px-3 py-1.5 rounded-2xl shadow-md border border-amber-500/20"
            }`}
            onClick={() => scrollToSection("hero")}
          >
            <img
              src="/blinky-logo-text.png"
              alt="Blinky"
              className="h-7 sm:h-8.5 w-auto object-contain drop-shadow-[0_0_14px_rgba(245,158,11,0.4)]"
            />
          </div>

          {/* Desktop Narrative Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium tracking-wide">
            <button
              type="button"
              onClick={() => scrollToSection("circuit-story")}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Circuit Story</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              About
            </button>
            <button
              type="button"
              onClick={onOpenChat}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1 font-semibold"
            >
              <Bot className="w-3.5 h-3.5 text-amber-500" />
              <span>Circuit AI Chat</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
          </nav>

          {/* Right Header Actions (Responsive) */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
            {/* Day / Night View Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-zinc-400 hover:text-amber-400 active:scale-90 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg"
              title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              ) : (
                <Moon className="w-4 h-4 text-amber-600 hover:-rotate-45 transition-transform duration-500" />
              )}
            </button>

            {/* Star on GitHub (Desktop only) */}
            <a
              href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-bold font-outfit text-zinc-200 hover:text-amber-300 transition-all cursor-pointer hover:scale-105 active:scale-95 py-1"
            >
              <Star className="w-4 h-4 fill-amber-400/90 text-amber-400 group-hover:scale-125 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
              <span className="font-outfit">Star on GitHub</span>
            </a>

            {/* Desktop Launch Studio CTA */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="hidden sm:flex group relative flex-col items-start text-sm sm:text-base font-black font-outfit text-white hover:text-amber-200 transition-all py-1 cursor-pointer hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
              </div>
              <svg
                className="w-full h-2.5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all filter drop-shadow-[0_1px_6px_rgba(239,68,68,0.5)]"
                viewBox="0 0 110 10"
                fill="none"
              >
                <path
                  d="M2 6 C35 2, 75 8, 108 5"
                  stroke="#f59e0b"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Mobile Quick Studio Button (Compact Pill) */}
            <button
              type="button"
              onClick={onLaunchStudio}
              className="sm:hidden px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-outfit font-black text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>Studio</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-zinc-300 hover:text-white rounded-lg active:scale-90 transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-white/[0.08] bg-white/[0.03]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} className="text-amber-400" /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE NAVIGATION DRAWER ================= */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[57px] bg-[#0c0910]/95 backdrop-blur-2xl border-b border-amber-500/20 shadow-2xl p-5 space-y-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection("circuit-story")}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] text-left text-sm font-outfit font-bold text-zinc-200 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Zap size={14} />
                </div>
                <span>Live Circuit Story</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] text-left text-sm font-outfit font-bold text-zinc-200 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Cpu size={14} />
                </div>
                <span>About Blinky (Physical Circuits • AI Brain)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat?.();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] text-left text-sm font-outfit font-bold text-zinc-200 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bot size={14} />
                </div>
                <span>Circuit AI Chat</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] text-left text-sm font-outfit font-bold text-zinc-200 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Layers size={14} />
                </div>
                <span>Process Workflow</span>
              </button>

              <a
                href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] text-left text-sm font-outfit font-bold text-zinc-200 hover:text-amber-400 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                </div>
                <span>Star on GitHub</span>
              </a>
            </nav>

            <div className="pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchStudio();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-outfit font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Launch Blinky Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION (RECOMPOSED FOR MOBILE & DESKTOP) ================= */}
      <section
        ref={heroSectionRef}
        id="hero"
        className="relative w-full min-h-[580px] sm:min-h-[680px] lg:min-h-[800px] flex items-center overflow-hidden border-b border-white/[0.08]"
      >
        {/* Background Image Layer with Cinematic Parallax */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <img
            ref={heroBgRef}
            src="/images/blinky_hero_bg.png"
            alt="Blinky AI Electronics IoT Workbench"
            className="w-full h-full object-cover object-[75%_center] md:object-right lg:object-[80%_center] transform will-change-transform"
          />

          {/* Left-to-Right / Top-to-Bottom Gradient Fades for Flawless Text Legibility on all viewports */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-b from-[#080709]/75 via-[#080709]/90 to-[#080709] sm:bg-gradient-to-r sm:from-[#080709] sm:via-[#080709]/80 sm:to-transparent"
                : "bg-gradient-to-b from-[#fbf9f6]/80 via-[#fbf9f6]/92 to-[#fbf9f6] sm:bg-gradient-to-r sm:from-[#fbf9f6] sm:via-[#fbf9f6]/85 sm:to-transparent"
            }`}
          />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-amber-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-24 will-change-transform"
        >
          <div className="max-w-2xl space-y-5 sm:space-y-7">
            {/* Step 3: AI Assistant Tag */}
            <div
              ref={heroTagRef}
              className="inline-flex items-center text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase select-none"
            >
              <span className="tracking-[0.16em] sm:tracking-[0.2em] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                AI-POWERED ELECTRONICS ASSISTANT
              </span>
            </div>

            {/* Step 4: Main Headline - Fully Responsive from 320px to 4K */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black font-outfit tracking-tight leading-[1.1] select-none">
                <span
                  ref={heroTitlePart1Ref}
                  className={`inline-block ${isDark ? "text-white" : "text-zinc-950"}`}
                >
                  Point. Understand.
                </span>{" "}
                <span
                  ref={heroTitlePart2Ref}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 font-handwriting text-4xl sm:text-6xl lg:text-8xl font-normal drop-shadow-[0_2px_16px_rgba(239,68,68,0.4)]"
                >
                  Build.
                </span>
              </h1>

              {/* Step 5: Supporting Subhead */}
              <p
                ref={heroSubheadRef}
                className={`text-sm sm:text-xl font-medium font-outfit leading-relaxed ${
                  isDark ? "text-amber-200/90" : "text-amber-800"
                }`}
              >
                From physical circuit to working IoT project — powered by AI.
              </p>
            </div>

            {/* Step 6: Description Subtitle */}
            <p
              ref={heroDescRef}
              className={`text-xs sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Capture your components with your phone camera, describe what you want to build, and Blinky synthesizes verified circuit wiring with production Arduino C++ firmware.
            </p>

            {/* Step 7: CTAs - Stack cleanly on mobile, side-by-side on desktop */}
            <div
              ref={heroCtasRef}
              className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-10"
            >
              {/* Primary Callout: Bold Hand-Drawn Brush Underline CTA */}
              <button
                type="button"
                onClick={onLaunchStudio}
                className="group relative inline-flex flex-col items-start cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 text-xl sm:text-3xl lg:text-4xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  <span>Start New Project</span>
                  <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 text-red-500 group-hover:text-amber-400 group-hover:translate-x-2.5 transition-all drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                </div>

                {/* Bold Textured Organic Brush Stroke */}
                <svg
                  className="w-full max-w-[200px] sm:max-w-[240px] h-4 sm:h-5 -mt-0.5 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.55)]"
                  viewBox="0 0 220 18"
                  fill="none"
                >
                  <path
                    d="M4 10 C35 4, 85 14, 140 7 C175 3, 200 9, 216 7"
                    stroke="#f59e0b"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 13 C55 8, 120 15, 195 9"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </button>

              {/* Secondary Callout: Handwritten Link with Wavy Underline */}
              <button
                type="button"
                onClick={() => scrollToSection("circuit-story")}
                className="group flex items-center gap-2 text-base sm:text-2xl font-bold font-handwriting text-zinc-300 hover:text-white transition-all cursor-pointer py-1 hover:scale-105 active:scale-95"
              >
                <span className="underline decoration-amber-500/60 group-hover:decoration-amber-400 decoration-[2px] sm:decoration-[3px] decoration-wavy underline-offset-6 sm:underline-offset-8 transition-colors">
                  Explore Architecture
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
              </button>
            </div>

            {/* Hand-drawn style note with curved doodle arrow */}
            <div className="pt-1 sm:pt-2 flex items-center gap-2 sm:gap-3 text-sm sm:text-xl font-bold font-handwriting text-zinc-300/90 select-none">
              <span>Works with ESP32, Arduino, sensors and more.</span>
              <svg
                className="w-7 h-5 sm:w-10 sm:h-7 text-amber-400/90 -rotate-6 shrink-0"
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

      </section>

      {/* ================= INTERACTIVE STORY CHAPTER: WATCH YOUR CIRCUIT BUILD ITSELF ================= */}
      <section id="circuit-story" className="scroll-mt-16 w-full relative">
        <InteractiveCircuitStory
          isDark={isDark}
          onLaunchStudio={onLaunchStudio}
        />

        {/* Connective Conduit: Circuit Story down into Section 2 */}
        <div className="w-full flex flex-col items-center pointer-events-none -my-1 z-20">
          <svg className="w-4 sm:w-6 h-8 sm:h-12 overflow-visible" viewBox="0 0 24 48" fill="none">
            <path
              ref={circuitToAboutConduitRef}
              d="M 12 0 L 12 48"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="180"
              strokeDashoffset="180"
            />
          </svg>
        </div>
      </section>

      {/* ================= FULL-WIDTH MAIN CONTAINER ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-12 sm:pb-20 space-y-12 sm:space-y-20 overflow-x-hidden">

        {/* ================= SECTION 2: ABOUT BLINKY ("PHYSICAL CIRCUITS. AI BRAIN.") ================= */}
        <section ref={aboutSectionRef} id="about" className="scroll-mt-20 w-full">
          {/* Central AI Neural Distributor Node */}
          <div className="w-full flex justify-center mb-4 sm:mb-6 px-2">
            <div
              ref={neuralDistributorRef}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-[0_0_16px_rgba(245,158,11,0.2)] max-w-full truncate"
            >
              <Cpu size={13} className="text-amber-400 shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="truncate">AI Neural Netlist Distributor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
            {/* Left Massive Statement - Fully responsive without horizontal overflow */}
            <div className="lg:col-span-5 select-none space-y-1 overflow-hidden">
              <div ref={aboutWord1Ref}>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-400 to-red-500 break-words drop-shadow-[0_2px_15px_rgba(245,158,11,0.3)]">
                  PHYSICAL
                </h2>
              </div>
              <div
                ref={aboutWord2Ref}
                className={`text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] break-words transition-colors duration-300 ${
                  isDark ? "text-orange-400/90" : "text-zinc-600"
                }`}
              >
                CIRCUITS.
              </div>
              <div
                ref={aboutWord3Ref}
                className={`text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.95] break-words transition-colors duration-300 ${
                  isDark ? "text-red-500/90" : "text-zinc-700"
                }`}
              >
                AI BRAIN.
              </div>
            </div>

            {/* Right Editorial Copy */}
            <div ref={aboutContentRef} className="lg:col-span-7 space-y-4 sm:space-y-5 pt-1">
              <h3
                className={`text-lg sm:text-2xl font-bold font-outfit leading-snug ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                From a physical circuit to a working IoT project — powered by AI.
              </h3>

              <p
                className={`text-xs sm:text-base leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Blinky is an AI-powered electronics assistant that transforms real-world components into functional IoT projects. Users simply capture their circuit or available components using their phone camera and describe what they want to build.
              </p>

              <p
                className={`text-xs sm:text-base leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Blinky analyzes the visual input using AI and generates an accurate circuit diagram with component connections, pin mappings, and wiring guidance, along with the corresponding Arduino C++ code.
              </p>

              {/* Validation Note */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-500/25 bg-amber-500/[0.05] text-xs sm:text-sm text-amber-300/90 leading-relaxed flex items-start gap-2.5 sm:gap-3">
                <span className="font-mono font-bold text-amber-400 shrink-0">NOTE:</span>
                <span>
                  Automatic wiring and code generation is provided as AI-generated guidance until the system has validated those outputs against the actual hardware.
                </span>
              </div>
            </div>
          </div>

          {/* Connective Conduit: Section 2 down into Section 3 Workflow */}
          <div className="w-full flex justify-center mt-8 sm:mt-12 pointer-events-none">
            <svg className="w-4 sm:w-6 h-10 sm:h-16 overflow-visible" viewBox="0 0 24 64" fill="none">
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
        <section ref={howItWorksSectionRef} id="how-it-works" className="scroll-mt-20 w-full space-y-6 sm:space-y-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
                ✦ Continuous Execution Pipeline
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-white">
                How Blinky Works
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-zinc-400">
              <Activity size={13} className="text-emerald-400" />
              <span>4 STATIONS // SYNCHRONIZED</span>
            </div>
          </div>

          {/* Circuit Bus (Horizontal on desktop, clean vertical flow on mobile) */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1 sm:pt-2">
              {/* 01 Capture & Describe */}
              <div className={`workflow-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-4xl font-black font-outfit text-amber-500">01</div>
                  <Camera size={18} className="text-amber-400/80" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-outfit mb-1.5 text-white">Capture &amp; Describe</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Use the phone camera to capture components or an existing circuit and describe the desired project through voice or text.
                </p>
              </div>

              {/* 02 AI Understands */}
              <div className={`workflow-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-4xl font-black font-outfit text-orange-500">02</div>
                  <Bot size={18} className="text-orange-400/80" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-outfit mb-1.5 text-white">AI Understands</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Gemini Vision identifies components and interprets the user's requirements through the Blinky AI Agent, powered by Python and FastAPI.
                </p>
              </div>

              {/* 03 Circuit & Code Generation */}
              <div className={`workflow-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_8px_30px_rgba(239,68,68,0.12)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-4xl font-black font-outfit text-red-500">03</div>
                  <Terminal size={18} className="text-red-400/80" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-outfit mb-1.5 text-white">Circuit &amp; Code</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Blinky generates a circuit diagram with the required connections and pin mappings, along with Arduino C++ code for the intended setup.
                </p>
              </div>

              {/* 04 Flash & Execute */}
              <div className={`workflow-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] ${isDark ? "bg-[#0e0c10] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-4xl font-black font-outfit text-emerald-400">04</div>
                  <Flame size={18} className="text-emerald-400/80" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-outfit mb-1.5 text-white">Flash &amp; Execute</h3>
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
          className="py-12 sm:py-24 text-center flex flex-col items-center justify-center space-y-5 sm:space-y-6 select-none w-full relative px-2"
        >
          {/* Collector Power Ring */}
          <div
            ref={bottomCtaPowerRingRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[380px] lg:w-[480px] h-[260px] sm:h-[380px] lg:h-[480px] rounded-full border border-amber-500/20 bg-radial-gradient pointer-events-none blur-xl max-w-full"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.05) 50%, transparent 75%)",
            }}
          />

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Zap size={12} className="text-amber-400" />
            <span>Master Control Terminal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black font-outfit uppercase tracking-tighter text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Ready to dig in?
          </h2>

          {/* Big Monumental Bottom CTA */}
          <button
            type="button"
            onClick={onLaunchStudio}
            className="group relative inline-flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95 py-2 z-10 w-full max-w-xs sm:max-w-none"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-3xl lg:text-4xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-amber-400 group-hover:rotate-45 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span>Start Building Circuits</span>
              <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 text-red-500 group-hover:text-amber-400 group-hover:translate-x-2 transition-all drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
            </div>
            <svg
              className="w-full max-w-[200px] sm:max-w-[260px] h-4 sm:h-6 -mt-1 overflow-visible origin-left scale-x-95 group-hover:scale-x-105 transition-all filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.55)]"
              viewBox="0 0 260 20"
              fill="none"
            >
              <path
                d="M4 11 C45 4, 115 15, 185 8 C220 4, 245 10, 256 8"
                stroke="#f59e0b"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15 C75 9, 150 16, 235 10"
                stroke="#ef4444"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </button>

          <div className="font-handwriting text-amber-400 text-xl sm:text-3xl pt-1 sm:pt-2 -rotate-2 select-none">
            Keep building :)
          </div>
        </section>

        {/* ================= MINIMALIST RESPONSIVE FOOTER ================= */}
        <footer className="pt-6 sm:pt-8 pb-10 sm:pb-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3 sm:gap-4 w-full text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-bold text-amber-400 text-sm">Blinky</span>
            <span>&bull;</span>
            <span className="text-[11px] sm:text-xs">Capture &bull; Understand &bull; Connect &bull; Create</span>
          </div>

          <a
            href="https://github.com/Codewith-Yogita/Blinky-AI-Circuit-IOT-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Star on GitHub</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
