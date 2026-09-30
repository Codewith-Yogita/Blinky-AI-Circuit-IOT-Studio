import { useRef, useLayoutEffect } from "react";
import { Sparkles, ArrowRight, Zap, CheckCircle2, Cpu, Eye, Radio, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveCircuitStory({ isDark = true, onLaunchStudio }) {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);

  // Story step indicators
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  // Hardware elements on the canvas
  const esp32Ref = useRef(null);
  const sensorRef = useRef(null);
  const resistorRef = useRef(null);
  const ledRef = useRef(null);
  const wire1Ref = useRef(null);
  const wire2Ref = useRef(null);
  const wire3Ref = useRef(null);
  const wire4Ref = useRef(null);
  const ledGlowRef = useRef(null);
  const pulseNode1Ref = useRef(null);
  const pulseNode2Ref = useRef(null);
  const verifiedBadgeRef = useRef(null);
  const terminalHudRef = useRef(null);
  const launchCtaRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // If reduced motion is requested, reveal all elements in their completed state
        gsap.set([esp32Ref.current, sensorRef.current, resistorRef.current, ledRef.current], {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
        });
        gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current], {
          strokeDashoffset: 0,
        });
        gsap.set([ledGlowRef.current, verifiedBadgeRef.current, terminalHudRef.current, launchCtaRef.current], {
          opacity: 1,
        });
        return;
      }

      // Initial resting state before scroll enters
      gsap.set(esp32Ref.current, { opacity: 0, x: -50, scale: 0.94 });
      gsap.set(sensorRef.current, { opacity: 0, y: -40, scale: 0.9 });
      gsap.set(resistorRef.current, { opacity: 0, scale: 0.8, y: 30 });
      gsap.set(ledRef.current, { opacity: 0, scale: 0.8, y: 30 });

      // Wires stroke dash setup (drawn dynamically from length to 0)
      gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current], {
        strokeDasharray: 240,
        strokeDashoffset: 240,
      });

      gsap.set(ledGlowRef.current, { opacity: 0, scale: 0.5 });
      gsap.set([pulseNode1Ref.current, pulseNode2Ref.current], { opacity: 0 });
      gsap.set(verifiedBadgeRef.current, { opacity: 0, y: 15, scale: 0.95 });
      gsap.set(terminalHudRef.current, { opacity: 0, y: 10 });
      gsap.set(launchCtaRef.current, { opacity: 0, scale: 0.96 });

      // Story Step Text Opacities
      gsap.set([step2Ref.current, step3Ref.current, step4Ref.current], { opacity: 0.35 });
      gsap.set(step1Ref.current, { opacity: 1 });

      // Master Scroll-Scrubbed Construction Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTargetRef.current,
          start: "top top",
          end: isMobile ? "+=150%" : "+=240%",
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      });

      // ================= BEAT 1: (0% - 25%) Board Materializes =================
      tl.to(
        esp32Ref.current,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      );

      // ================= BEAT 2: (25% - 50%) Components Arrive =================
      tl.to(
        step1Ref.current,
        { opacity: 0.35, duration: 0.4 },
        1
      );
      tl.to(
        step2Ref.current,
        { opacity: 1, duration: 0.4 },
        1
      );
      tl.to(
        sensorRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.4)",
        },
        1
      );
      tl.to(
        [resistorRef.current, ledRef.current],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1,
          ease: "back.out(1.4)",
        },
        1.2
      );

      // ================= BEAT 3: (50% - 75%) Connections Drawn =================
      tl.to(
        step2Ref.current,
        { opacity: 0.35, duration: 0.4 },
        2.2
      );
      tl.to(
        step3Ref.current,
        { opacity: 1, duration: 0.4 },
        2.2
      );
      // Draw wires dynamically along SVG paths
      tl.to(
        wire1Ref.current,
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        2.2
      );
      tl.to(
        wire2Ref.current,
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        2.4
      );
      tl.to(
        wire3Ref.current,
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        2.6
      );
      tl.to(
        wire4Ref.current,
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        2.8
      );

      // ================= BEAT 4: (75% - 100%) Current Flows & Synthesis Verifies =================
      tl.to(
        step3Ref.current,
        { opacity: 0.35, duration: 0.4 },
        3.6
      );
      tl.to(
        step4Ref.current,
        { opacity: 1, duration: 0.4 },
        3.6
      );
      // Current pulse & LED activation
      tl.to(
        [pulseNode1Ref.current, pulseNode2Ref.current],
        { opacity: 1, duration: 0.3 },
        3.6
      );
      tl.to(
        ledGlowRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        3.8
      );
      tl.to(
        terminalHudRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        4.0
      );
      tl.to(
        verifiedBadgeRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.5)",
        },
        4.2
      );
      tl.to(
        launchCtaRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        4.4
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="w-full min-h-screen flex items-center justify-center py-8 sm:py-12 px-6 sm:px-10 lg:px-14 bg-[#070509] overflow-hidden border-y border-white/[0.08]"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT STORY NARRATIVE COLUMN ================= */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7 z-20">
            {/* Live Synthesis Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Scroll-Driven Synthesis</span>
            </div>

            {/* Title with Gradient */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-white leading-[1.1]">
                Watch Your Circuit{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                  Build Itself.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                Scroll down to assemble hardware components, route electrical nets, and verify Arduino firmware in real-time.
              </p>
            </div>

            {/* 4 Interactive Story Beats */}
            <div className="space-y-3.5 pt-1">
              {/* Step 1 */}
              <div
                ref={step1Ref}
                className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#110c17]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">Hardware Microcontroller Recognized</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">ESP32 DevKit V1 placed on dot grid with verified GPIO mapping.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                ref={step2Ref}
                className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#110c17]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono text-xs font-bold shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">Sensors &amp; Peripherals Arranged</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">HC-SR04 sonar module, 5mm LED, and 220Ω resistor materialized.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                ref={step3Ref}
                className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#110c17]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-mono text-xs font-bold shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">Automated Netlist Routing</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Verified copper jumper paths drawn between terminals without short-circuits.</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div
                ref={step4Ref}
                className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#110c17]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shrink-0">
                    04
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-outfit">Live Current &amp; Firmware Verified</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Signals propagate, LED powers on, and C++ code compiles with 100% test pass.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA Revealed at End of Scroll */}
            <div ref={launchCtaRef} className="pt-2">
              <button
                type="button"
                onClick={onLaunchStudio}
                className="group relative inline-flex flex-col items-start cursor-pointer hover:scale-[1.03] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3 text-lg sm:text-xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors">
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>Open This Circuit in Blinky Studio</span>
                  <ArrowRight className="w-5 h-5 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
                </div>
                {/* Organic brush stroke underline */}
                <svg className="w-full h-3 -mt-0.5 overflow-visible" viewBox="0 0 160 10" fill="none">
                  <path d="M2 6 C40 2, 95 8, 158 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ================= RIGHT DYNAMIC CONSTRUCTION CANVAS ================= */}
          <div className="lg:col-span-7 relative w-full h-[440px] sm:h-[480px] lg:h-[520px] rounded-3xl bg-[#0c0910] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.06),0_0_35px_rgba(245,158,11,0.08)] overflow-hidden">
            {/* Dot Grid Matrix Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.15)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Top Canvas Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 px-4 sm:px-6 bg-[#130d19]/90 border-b border-white/[0.08] flex items-center justify-between z-30">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-zinc-400 font-bold ml-2">WORKSPACE://CIRCUIT_STAGE_01</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 font-bold">
                <Cpu size={13} className="text-amber-400" />
                <span>ESP32-WROOM-32</span>
              </div>
            </div>

            {/* The SVG Layer containing interactive jumper wires & current pulses */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 600 480"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="storyGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wire 1: 5V DC Power Rail (Red) */}
              <path
                d="M 180 180 C 220 180, 240 100, 360 100"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire1Ref}
                d="M 180 180 C 220 180, 240 100, 360 100"
                stroke="#ef4444"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 2: Ground Return Rail (Slate/Black) */}
              <path
                d="M 180 260 C 240 260, 260 380, 480 380"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire2Ref}
                d="M 180 260 C 240 260, 260 380, 480 380"
                stroke="#64748b"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 3: Digital GPIO2 Signal to Resistor (Amber) */}
              <path
                d="M 180 220 C 230 220, 250 310, 310 310"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire3Ref}
                d="M 180 220 C 230 220, 250 310, 310 310"
                stroke="#f59e0b"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 4: Resistor to LED Anode (Orange/Gold) */}
              <path
                d="M 390 310 C 420 310, 430 310, 460 310"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire4Ref}
                d="M 390 310 C 420 310, 430 310, 460 310"
                stroke="#f97316"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Electrical Current Pulse Photons (Stage 4) */}
              <circle
                ref={pulseNode1Ref}
                r="4.5"
                fill="#fef08a"
                filter="url(#storyGlow)"
              >
                <animateMotion
                  path="M 180 220 C 230 220, 250 310, 310 310"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                ref={pulseNode2Ref}
                r="4.5"
                fill="#fef08a"
                filter="url(#storyGlow)"
              >
                <animateMotion
                  path="M 390 310 C 420 310, 430 310, 460 310"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* ================= COMPONENT 1: ESP32 MICROCONTROLLER ================= */}
            <div
              ref={esp32Ref}
              className="absolute left-6 sm:left-10 top-24 sm:top-28 w-36 sm:w-40 h-56 rounded-2xl bg-[#140e1b] border-2 border-amber-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center justify-between p-3 select-none z-20"
            >
              {/* Antenna */}
              <div className="w-16 h-6 rounded bg-[#2b180d] border border-amber-500/40 flex items-center justify-center">
                <span className="text-[8px] font-mono text-amber-400 font-bold tracking-widest">PCB_ANT</span>
              </div>

              {/* Metal Shield */}
              <div className="w-24 sm:w-28 h-20 rounded-xl bg-[#0d0912] border border-amber-500/40 p-2 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] font-mono font-bold text-amber-200">ESP-WROOM-32</span>
                <span className="text-[8px] font-mono text-amber-500/80">WiFi + BT 4.2</span>
              </div>

              {/* Pin Labels along right edge */}
              <div className="w-full flex justify-between items-center text-[9px] font-mono px-1">
                <span className="text-zinc-500">USB-C</span>
                <div className="flex flex-col items-end gap-1 text-[8px] font-bold text-amber-400">
                  <span>5V ●</span>
                  <span>GPIO2 ●</span>
                  <span>GND ●</span>
                </div>
              </div>

              {/* Silkscreen Tag */}
              <div className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                ESP32 DevKit V1
              </div>
            </div>

            {/* ================= COMPONENT 2: HC-SR04 ULTRASONIC SENSOR ================= */}
            <div
              ref={sensorRef}
              className="absolute right-8 sm:right-14 top-16 w-44 sm:w-48 h-20 rounded-2xl bg-[#171020] border-2 border-amber-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.7)] flex items-center justify-around px-3 select-none z-20"
            >
              <div className="w-12 h-12 rounded-full bg-[#0a070e] border-2 border-amber-500/50 flex items-center justify-center shadow-inner">
                <span className="text-[10px] font-bold text-amber-300 font-mono">T</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-amber-400 font-bold">HC-SR04</span>
                <span className="text-[7px] font-mono text-zinc-400">Sonar 40kHz</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#0a070e] border-2 border-amber-500/50 flex items-center justify-center shadow-inner">
                <span className="text-[10px] font-bold text-amber-300 font-mono">R</span>
              </div>
            </div>

            {/* ================= COMPONENT 3: 220Ω CURRENT LIMITING RESISTOR ================= */}
            <div
              ref={resistorRef}
              className="absolute left-64 sm:left-72 top-72 w-20 h-8 rounded-full bg-[#d4a373] border border-[#78350f] flex items-center justify-around px-2 shadow-md select-none z-20"
            >
              <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
              <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
              <span className="w-1.5 h-6 bg-amber-900 rounded-sm" />
              <span className="w-1.5 h-6 bg-amber-400 rounded-sm" />
            </div>

            {/* ================= COMPONENT 4: 5mm RED LED WITH GLOW ================= */}
            <div
              ref={ledRef}
              className="absolute right-12 sm:right-20 bottom-24 w-16 h-16 flex items-center justify-center select-none z-20"
            >
              {/* Dynamic Glow Halo */}
              <div
                ref={ledGlowRef}
                className="absolute inset-0 rounded-full bg-red-500/30 blur-xl pointer-events-none"
              />

              {/* LED Bulb Dome */}
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-amber-300 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.9)] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/60 blur-[1px] -translate-y-1 -translate-x-1" />
              </div>
              <span className="absolute -bottom-5 text-[9px] font-mono font-bold text-amber-400 bg-[#130d19] px-2 py-0.5 rounded border border-amber-500/30">
                LED [ON]
              </span>
            </div>

            {/* Verified Circuit Stamp HUD (Bottom) */}
            <div
              ref={terminalHudRef}
              className="absolute bottom-4 left-6 right-6 p-2.5 sm:p-3 rounded-2xl bg-[#140e1b]/95 border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-30"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  AUTONOMOUS NETLIST VERIFIED
                </span>
                <span className="text-[11px] font-mono text-zinc-400 hidden md:inline">
                  • 0 Short Circuits • Arduino C++ Ready
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-amber-400 font-bold">
                <span>GPIO2 ➔ 220Ω ➔ LED</span>
                <span>• 3.3V VCC</span>
              </div>
            </div>

            {/* Corner Verification Medallion */}
            <div
              ref={verifiedBadgeRef}
              className="absolute top-14 right-4 sm:right-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] z-30"
            >
              <ShieldCheck size={13} />
              <span>AI SYNTHESIS COMPLETE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
