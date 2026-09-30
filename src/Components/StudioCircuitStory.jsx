import { useRef, useLayoutEffect, useState, useEffect } from "react";
import "@wokwi/elements";
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Check,
  Layers,
  Activity,
} from "lucide-react";
import { gsap } from "gsap";

const STEPS = [
  {
    num: "01",
    time: 0.8,
    progress: 0.25,
    title: "ESP32-WROOM-32 Placed",
    tag: "DevKit V1",
    desc: "Obsidian PCB with brushed RF shield, MIFA antenna & gold pin headers seated.",
    color: "amber",
  },
  {
    num: "02",
    time: 1.8,
    progress: 0.5,
    title: "Peripherals Mounted",
    tag: "Sonar + Resistor + LED",
    desc: "Aluminum acoustic transducers, ceramic 220Ω resistor & ruby LED placed.",
    color: "orange",
  },
  {
    num: "03",
    time: 3.1,
    progress: 0.75,
    title: "Physical Dupont Wires Routed",
    tag: "4 Nets • 0 Shorts",
    desc: "Colored jumper leads with crimp boots auto-routed to exact pinout coordinates.",
    color: "red",
  },
  {
    num: "04",
    time: 4.0,
    progress: 1.0,
    title: "Live Current & Firmware Verified",
    tag: "3.3V Rails Active",
    desc: "Electrons flow, LED illuminates, Arduino C++ firmware compiles 100% OK.",
    color: "emerald",
  },
];

export default function StudioCircuitStory({ circuit, onProceedToCode, onSwitchToWokwi }) {
  const containerRef = useRef(null);
  const workbenchContainerRef = useRef(null);
  const [artboardScale, setArtboardScale] = useState(1);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressVal, setProgressVal] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Master GSAP timeline reference
  const tlRef = useRef(null);

  // Hardware Elements
  const esp32ContainerRef = useRef(null);
  const esp32ReticleRef = useRef(null);
  const esp32ElementRef = useRef(null);

  const sonarContainerRef = useRef(null);
  const resistorContainerRef = useRef(null);
  const ledContainerRef = useRef(null);
  const wokwiLedRef = useRef(null);
  const ledRadialGlowRef = useRef(null);

  // Wires and Solder Eyelets
  const wire1Ref = useRef(null); // 5V Power (Red)
  const wire2Ref = useRef(null); // GND Upper (Slate)
  const wire3Ref = useRef(null); // GPIO2 Signal (Amber)
  const wire4Ref = useRef(null); // Resistor to LED (Orange)
  const wire5Ref = useRef(null); // LED Ground Return (Slate)

  const pad1Ref = useRef(null);
  const pad2Ref = useRef(null);
  const pad3Ref = useRef(null);
  const pad4Ref = useRef(null);
  const pad5Ref = useRef(null);

  // Pulses and Badges
  const pulseGroupRef = useRef(null);
  const verifiedBadgeRef = useRef(null);
  const terminalHudRef = useRef(null);

  // Calculate responsive scale for the 700x420 workbench
  useEffect(() => {
    if (!workbenchContainerRef.current) return;

    const handleResize = () => {
      if (!workbenchContainerRef.current) return;
      const { clientWidth, clientHeight } = workbenchContainerRef.current;
      const availW = clientWidth - 24;
      const availH = clientHeight - 88;
      const s = Math.min(availW / 700, availH / 420);
      setArtboardScale(Math.min(Math.max(s, 0.4), 1.2));
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(workbenchContainerRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Build the interactive timeline
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Dormant initial setup
      gsap.set(esp32ContainerRef.current, { opacity: 0, y: 30, scale: 0.94 });
      gsap.set(esp32ReticleRef.current, { opacity: 0, scale: 1.15 });
      gsap.set(sonarContainerRef.current, { opacity: 0, y: -25, scale: 0.92 });
      gsap.set(resistorContainerRef.current, { opacity: 0, y: 18, scale: 0.88 });
      gsap.set(ledContainerRef.current, { opacity: 0, y: 18, scale: 0.88 });
      gsap.set(ledRadialGlowRef.current, { opacity: 0, scale: 0.4 });

      gsap.set(
        [pad1Ref.current, pad2Ref.current, pad3Ref.current, pad4Ref.current, pad5Ref.current],
        { opacity: 0, scale: 0 }
      );

      const wires = [
        { el: wire1Ref.current, len: 680 },
        { el: wire2Ref.current, len: 650 },
        { el: wire3Ref.current, len: 200 },
        { el: wire4Ref.current, len: 220 },
        { el: wire5Ref.current, len: 480 },
      ];
      wires.forEach(({ el, len }) => {
        if (el) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap.set(pulseGroupRef.current, { opacity: 0 });
      gsap.set(verifiedBadgeRef.current, { opacity: 0, scale: 0.85, y: -8 });
      gsap.set(terminalHudRef.current, { opacity: 0.45 });

      // Create timeline (total 4.0s duration)
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
        onUpdate: () => {
          const p = tl.progress();
          setProgressVal(p);

          // Update active step indicator
          if (p < 0.25) setActiveStepIndex(0);
          else if (p < 0.55) setActiveStepIndex(1);
          else if (p < 0.82) setActiveStepIndex(2);
          else setActiveStepIndex(3);

          // Light up Wokwi LED when current is reached
          if (wokwiLedRef.current) {
            wokwiLedRef.current.value = p >= 0.78;
          }
        },
        onComplete: () => {
          setIsPlaying(false);
        },
      });

      // ========== BEAT 1: SILICON CORE (0s - 1.0s) ==========
      tl.to(esp32ReticleRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0);
      tl.to(
        esp32ContainerRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.2)" },
        0.15
      );
      tl.to(esp32ReticleRef.current, { opacity: 0.25, duration: 0.3 }, 0.75);

      // ========== BEAT 2: PERIPHERAL CLUSTER (1.0s - 2.0s) ==========
      tl.to(
        sonarContainerRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.2)" },
        1.0
      );
      tl.to(
        [resistorContainerRef.current, ledContainerRef.current],
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.6, ease: "power2.out" },
        1.2
      );

      // ========== BEAT 3: DUPONT WIRE ROUTING (2.0s - 3.2s) ==========
      // Wire 1: 5V Power (Red)
      tl.to(wire1Ref.current, { strokeDashoffset: 0, duration: 0.6 }, 2.0);
      tl.to(pad1Ref.current, { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, 2.5);

      // Wire 2: Ground Bus (Slate)
      tl.to(wire2Ref.current, { strokeDashoffset: 0, duration: 0.6 }, 2.2);
      tl.to(pad2Ref.current, { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, 2.7);

      // Wire 3: GPIO2 Signal (Amber)
      tl.to(wire3Ref.current, { strokeDashoffset: 0, duration: 0.5 }, 2.4);
      tl.to(pad3Ref.current, { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, 2.85);

      // Wire 4 & 5: Resistor to LED & Ground Return
      tl.to([wire4Ref.current, wire5Ref.current], { strokeDashoffset: 0, stagger: 0.15, duration: 0.55 }, 2.7);
      tl.to([pad4Ref.current, pad5Ref.current], { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, 3.15);

      // ========== BEAT 4: POWER IGNITION & VERIFICATION (3.2s - 4.0s) ==========
      tl.to(pulseGroupRef.current, { opacity: 1, duration: 0.25 }, 3.35);
      tl.to(ledRadialGlowRef.current, { opacity: 0.85, scale: 1.2, duration: 0.45, ease: "power2.out" }, 3.45);
      tl.to(terminalHudRef.current, { opacity: 1, duration: 0.3 }, 3.5);
      tl.to(verifiedBadgeRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }, 3.6);

      tlRef.current = tl;

      // Start playing automatically after a gentle 350ms delay
      const timer = setTimeout(() => {
        tl.timeScale(0.8); // Relaxed, elegant speed
        tl.play();
        setIsPlaying(true);
      }, 350);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Controls handlers
  const handleTogglePlay = () => {
    if (!tlRef.current) return;
    if (isPlaying) {
      tlRef.current.pause();
      setIsPlaying(false);
    } else {
      if (tlRef.current.progress() >= 0.99) {
        tlRef.current.restart();
      } else {
        tlRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!tlRef.current) return;
    tlRef.current.restart();
    setIsPlaying(true);
  };

  const handleScrub = (e) => {
    if (!tlRef.current) return;
    const val = parseFloat(e.target.value) / 100;
    tlRef.current.pause();
    setIsPlaying(false);
    tlRef.current.progress(val);
  };

  const handleJumpToStep = (index) => {
    if (!tlRef.current) return;
    const step = STEPS[index];
    tlRef.current.pause();
    setIsPlaying(false);
    gsap.to(tlRef.current, {
      progress: step.progress,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col space-y-4">
      {/* ================= TOP STORY CONTROL DECK ================= */}
      <div className="w-full px-4 py-3 rounded-xl bg-[#110c17]/90 border border-amber-500/25 shadow-lg flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Status Pill */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <Sparkles size={12} className="text-amber-400" />
            <span>Circuit Build Story</span>
          </span>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Step {activeStepIndex + 1}/4:{" "}
            <strong className="text-zinc-200">{STEPS[activeStepIndex].title}</strong>
          </span>
        </div>

        {/* Center: Play/Pause/Restart & Scrubber Slider */}
        <div className="flex items-center gap-3 flex-1 max-w-md min-w-[240px]">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title={isPlaying ? "Pause timeline" : "Play timeline"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-300 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title="Restart from Step 1"
          >
            <RotateCcw size={13} />
          </button>

          {/* Interactive Scrub Bar */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={Math.round(progressVal * 100)}
              onChange={handleScrub}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f59e0b ${progressVal * 100}%, #27272a ${progressVal * 100}%)`,
              }}
              title="Drag to scrub circuit assembly"
            />
          </div>

          <span className="text-xs font-mono font-bold text-amber-400 w-10 text-right shrink-0">
            {Math.round(progressVal * 100)}%
          </span>
        </div>

        {/* Right: Quick Step Jump Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isDone = progressVal >= step.progress;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => handleJumpToStep(idx)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isActive
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    : isDone
                    ? "bg-zinc-800/80 border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-zinc-200"
                }`}
                title={`Jump to ${step.title}`}
              >
                <span>{step.num}</span>
                {isDone && <Check size={10} className="text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2-COLUMN STORY STAGE ================= */}
      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ================= LEFT COLUMN: CHOREOGRAPHY BEATS & ACTIONS ================= */}
        <div className="w-full lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Headline */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-extrabold">
                  SCENE 01 // CIRCUIT SYNTHESIS
                </span>
                <span className="text-[10px] font-mono text-zinc-500">•</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {circuit?.title || "ESP32 Sensor Prototype"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-white tracking-tight leading-tight">
                Watch Your Circuit{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 font-handwriting text-2xl sm:text-3xl font-normal">
                  Build Itself.
                </span>
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Hit play or scrub the timeline above to observe silicon docking, Dupont trace routing, and firmware validation.
              </p>
            </div>

            {/* 4 Interactive Beat Cards */}
            <div className="space-y-2">
              {STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const isPassed = progressVal >= step.progress;
                return (
                  <div
                    key={step.num}
                    onClick={() => handleJumpToStep(idx)}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#160f1e] border-amber-500/60 shadow-[0_0_16px_rgba(245,158,11,0.2)] scale-[1.01]"
                        : isPassed
                        ? "bg-[#110d16]/80 border-emerald-500/25 hover:border-emerald-500/50"
                        : "bg-[#0d0912]/60 border-white/[0.06] hover:border-white/15 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border ${
                          isActive
                            ? "bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            : isPassed
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {isPassed && !isActive ? <Check size={12} /> : step.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs sm:text-sm font-bold font-outfit ${
                              isActive ? "text-amber-200" : isPassed ? "text-white" : "text-zinc-300"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span
                            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "text-zinc-500"
                            }`}
                          >
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Call to Action for Stage 2 */}
          <div className="pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onProceedToCode}
              className="group w-full sm:w-auto relative inline-flex flex-col items-start cursor-pointer hover:scale-[1.02] active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors">
                <Zap size={15} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Synthesize Firmware Code (Stage 2)</span>
                <ArrowRight size={15} className="text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
              </div>
              <svg className="w-full h-2.5 -mt-0.5 overflow-visible" viewBox="0 0 160 10" fill="none">
                <path d="M2 6 C40 2, 95 8, 158 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            {onSwitchToWokwi && (
              <button
                type="button"
                onClick={onSwitchToWokwi}
                className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-mono transition-colors"
                title="View in full interactive Wokwi canvas"
              >
                <span>Full Circuit Diagram</span>
                <Layers size={12} />
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: REALISTIC WOKWI WORKBENCH ================= */}
        <div
          ref={workbenchContainerRef}
          className="w-full lg:col-span-7 relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] rounded-2xl bg-[#09070c] border border-amber-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.08),0_0_30px_rgba(245,158,11,0.1)] overflow-hidden flex flex-col"
        >
          {/* Top Workspace Header Bar */}
          <div className="h-9 sm:h-10 px-3 sm:px-5 bg-[#130d19]/90 border-b border-white/[0.08] flex items-center justify-between z-30 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-bold ml-1.5">
                WORKSPACE://ESP32_STUDIO_STORY
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-amber-400 font-bold">
              <Cpu size={12} className="text-amber-400" />
              <span>ESP32-WROOM-32</span>
            </div>
          </div>

          {/* Responsive Scaling Artboard Viewport */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
            <div
              className="relative shrink-0 select-none"
              style={{
                width: "700px",
                height: "420px",
                transform: `scale(${artboardScale})`,
                transformOrigin: "center center",
              }}
            >
              {/* Authentic Wokwi Prototyping Dot Grid Background */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: "#0d0a14",
                  backgroundImage: `
                    radial-gradient(circle at center, rgba(245, 158, 11, 0.22) 1.5px, transparent 1.5px),
                    radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 3.5px, transparent 3.5px)
                  `,
                  backgroundSize: "20px 20px, 20px 20px",
                  backgroundPosition: "0 0, 0 0",
                }}
              />

              {/* Silkscreen Coordinate Grid Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="55" y1="20" x2="55" y2="400" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="645" y1="20" x2="645" y2="400" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="20" y1="360" x2="680" y2="360" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x="65" y="32" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">SEC_01: MCU CORE</text>
                <text x="380" y="32" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">SEC_02: SENSOR CLUSTER</text>
              </svg>

              {/* ================= SVG DUPONT WIRES & PIN CONNECTIONS LAYER ================= */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 700 420"
              >
                <defs>
                  <filter id="studioCircuitGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="studioWireDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* ---------------- WIRE 1: 5V DC POWER RAIL (RED) ---------------- */}
                <path
                  d="M 60 268.5 C 20 268.5, 20 72, 175 72 C 290 72, 390 72, 441.3 139.5"
                  stroke="#09060f"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeOpacity="0.85"
                />
                <path
                  ref={wire1Ref}
                  d="M 60 268.5 C 20 268.5, 20 72, 175 72 C 290 72, 390 72, 441.3 139.5"
                  stroke="#ef4444"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#studioWireDropShadow)"
                />

                {/* ---------------- WIRE 2: GROUND BUS (DARK SLATE) ---------------- */}
                <path
                  d="M 60 259 C 32 259, 32 86, 180 86 C 300 86, 410 86, 471.3 139.5"
                  stroke="#09060f"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeOpacity="0.85"
                />
                <path
                  ref={wire2Ref}
                  d="M 60 259 C 32 259, 32 86, 180 86 C 300 86, 410 86, 471.3 139.5"
                  stroke="#475569"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#studioWireDropShadow)"
                />

                {/* ---------------- WIRE 3: GPIO2 DIGITAL SIGNAL (WARM AMBER) ---------------- */}
                <path
                  d="M 164 240.4 C 195 240.4, 225 257, 262 257"
                  stroke="#09060f"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeOpacity="0.85"
                />
                <path
                  ref={wire3Ref}
                  d="M 164 240.4 C 195 240.4, 225 257, 262 257"
                  stroke="#f59e0b"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#studioWireDropShadow)"
                />

                {/* ---------------- WIRE 4: RESISTOR TO LED ANODE (VIVID ORANGE) ---------------- */}
                <path
                  d="M 317 257 C 365 257, 415 274, 465 274"
                  stroke="#09060f"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeOpacity="0.85"
                />
                <path
                  ref={wire4Ref}
                  d="M 317 257 C 365 257, 415 274, 465 274"
                  stroke="#f97316"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#studioWireDropShadow)"
                />

                {/* ---------------- WIRE 5: LED CATHODE GROUND RETURN (SLATE) ---------------- */}
                <path
                  d="M 455 274 C 455 350, 250 350, 164 259"
                  stroke="#09060f"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeOpacity="0.85"
                />
                <path
                  ref={wire5Ref}
                  d="M 455 274 C 455 350, 250 350, 164 259"
                  stroke="#64748b"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#studioWireDropShadow)"
                />

                {/* ---------------- DUPONT CONNECTOR BOOTS ---------------- */}
                <rect x="54" y="263" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                <rect x="54" y="253.5" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                <rect x="158" y="235" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                <rect x="158" y="253.5" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                <rect x="437.3" y="134" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                <rect x="467.3" y="134" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />

                {/* ---------------- SOLDER TERMINAL EYELETS ---------------- */}
                <circle ref={pad1Ref} cx="441.3" cy="139.5" r="4.5" fill="#f87171" filter="url(#studioCircuitGlow)" />
                <circle ref={pad2Ref} cx="471.3" cy="139.5" r="4.5" fill="#94a3b8" filter="url(#studioCircuitGlow)" />
                <circle ref={pad3Ref} cx="262" cy="257" r="4.5" fill="#fbbf24" filter="url(#studioCircuitGlow)" />
                <circle ref={pad4Ref} cx="465" cy="274" r="4.5" fill="#fb923c" filter="url(#studioCircuitGlow)" />
                <circle ref={pad5Ref} cx="455" cy="274" r="4.5" fill="#94a3b8" filter="url(#studioCircuitGlow)" />

                {/* ---------------- PHASE 4: CURRENT FLOW PULSES ---------------- */}
                <g ref={pulseGroupRef}>
                  <circle r="4" fill="#fef08a" filter="url(#studioCircuitGlow)">
                    <animateMotion
                      path="M 164 240.4 C 195 240.4, 225 257, 262 257"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="4" fill="#fef08a" filter="url(#studioCircuitGlow)">
                    <animateMotion
                      path="M 317 257 C 365 257, 415 274, 465 274"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="4" fill="#fca5a5" filter="url(#studioCircuitGlow)">
                    <animateMotion
                      path="M 60 268.5 C 20 268.5, 20 72, 175 72 C 290 72, 390 72, 441.3 139.5"
                      dur="1.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="3.5" fill="#93c5fd" filter="url(#studioCircuitGlow)">
                    <animateMotion
                      path="M 455 274 C 455 350, 250 350, 164 259"
                      dur="1.3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>

              {/* ================= AUTHENTIC @wokwi/elements HARDWARE ================= */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {/* 1. ESP32 DevKit V1 */}
                <div
                  ref={esp32ReticleRef}
                  className="absolute border-2 border-dashed border-amber-500/60 rounded-xl pointer-events-none"
                  style={{
                    left: "50px",
                    top: "105px",
                    width: "119px",
                    height: "175px",
                  }}
                />

                <div
                  ref={esp32ContainerRef}
                  className="absolute flex flex-col items-center pointer-events-auto"
                  style={{
                    left: "55px",
                    top: "110px",
                    width: "109px",
                    height: "165px",
                  }}
                >
                  <wokwi-esp32-devkit-v1
                    ref={esp32ElementRef}
                    ledPower=""
                    style={{ transformOrigin: "top left" }}
                  />

                  <div className="mt-1.5 px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-300 tracking-wider shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ESP32 DEVKIT V1</span>
                  </div>

                  <span className="absolute -left-7 top-[154px] text-[8px] font-mono font-bold text-red-400 bg-black/70 px-1 rounded">5V</span>
                  <span className="absolute -left-9 top-[144px] text-[8px] font-mono font-bold text-zinc-400 bg-black/70 px-1 rounded">GND</span>
                  <span className="absolute -right-11 top-[125px] text-[8px] font-mono font-bold text-amber-300 bg-black/70 px-1 rounded">GPIO2</span>
                  <span className="absolute -right-9 top-[144px] text-[8px] font-mono font-bold text-zinc-400 bg-black/70 px-1 rounded">GND</span>
                </div>

                {/* 2. HC-SR04 Ultrasonic Sensor */}
                <div
                  ref={sonarContainerRef}
                  className="absolute flex flex-col items-center pointer-events-auto"
                  style={{
                    left: "370px",
                    top: "45px",
                    width: "170px",
                    height: "95px",
                  }}
                >
                  <wokwi-hc-sr04 style={{ transformOrigin: "top left" }} />
                  <div className="absolute -bottom-4 flex items-center gap-2 text-[8px] font-mono font-bold">
                    <span className="text-red-400">VCC</span>
                    <span className="text-zinc-500">TRIG</span>
                    <span className="text-zinc-500">ECHO</span>
                    <span className="text-zinc-400">GND</span>
                  </div>
                </div>

                {/* 3. 220Ω Resistor */}
                <div
                  ref={resistorContainerRef}
                  className="absolute flex flex-col items-center pointer-events-auto"
                  style={{
                    left: "260px",
                    top: "250px",
                    width: "60px",
                    height: "14px",
                  }}
                >
                  <wokwi-resistor value="220" />
                  <span className="absolute -bottom-4 text-[8px] font-mono font-bold text-amber-300 bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/25 whitespace-nowrap">
                    220Ω (±5%)
                  </span>
                </div>

                {/* 4. 5mm Red LED */}
                <div
                  ref={ledContainerRef}
                  className="absolute flex flex-col items-center pointer-events-auto"
                  style={{
                    left: "440px",
                    top: "230px",
                    width: "40px",
                    height: "50px",
                  }}
                >
                  <div
                    ref={ledRadialGlowRef}
                    className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(239, 68, 68, 0.25) 45%, transparent 70%)",
                      filter: "blur(4px)",
                    }}
                  />

                  <wokwi-led
                    ref={wokwiLedRef}
                    color="red"
                    style={{ transformOrigin: "top left" }}
                  />

                  <span className="absolute -bottom-4 text-[8px] font-mono font-bold text-red-300 bg-black/75 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">
                    5mm RED LED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostic HUD */}
          <div
            ref={terminalHudRef}
            className="h-10 sm:h-11 px-3 sm:px-5 bg-[#130d19]/95 border-t border-amber-500/30 flex items-center justify-between gap-2 z-30 backdrop-blur-md shrink-0"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold truncate">
                AUTONOMOUS NETLIST VERIFIED
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 hidden md:inline">
                • 0 Short Circuits • Arduino C++ Ready
              </span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold shrink-0">
              GPIO2 ➔ 220Ω ➔ LED • 3.3V
            </div>
          </div>

          {/* Corner Verification Stamp */}
          <div
            ref={verifiedBadgeRef}
            className="absolute top-12 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] z-30"
          >
            <ShieldCheck size={12} />
            <span>AI SYNTHESIS READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
