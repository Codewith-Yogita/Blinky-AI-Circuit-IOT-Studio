import { useRef, useLayoutEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Flame,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveCircuitStory({ isDark = true, onLaunchStudio }) {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);

  // Story phases indicators
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);

  // Status & Telemetry HUD elements
  const telemetryStatusRef = useRef(null);
  const telemetryNetsRef = useRef(null);
  const telemetryPowerRef = useRef(null);
  const progressFillRef = useRef(null);

  // Hardware elements on the canvas
  const esp32Ref = useRef(null);
  const esp32ReticleRef = useRef(null);
  const sensorRef = useRef(null);
  const resistorRef = useRef(null);
  const ledRef = useRef(null);
  const ledGlowRef = useRef(null);
  const ledLightBeamRef = useRef(null);

  // Wires and Solder Pads
  const wire1Ref = useRef(null); // 5V Power
  const wire2Ref = useRef(null); // GND Return
  const wire3Ref = useRef(null); // GPIO2 Signal
  const wire4Ref = useRef(null); // Resistor to LED Anode

  const pad1Ref = useRef(null);
  const pad2Ref = useRef(null);
  const pad3Ref = useRef(null);
  const pad4Ref = useRef(null);

  // Pulses and Badges
  const pulseNode1Ref = useRef(null);
  const pulseNode2Ref = useRef(null);
  const pulseNode3Ref = useRef(null);
  const verifiedBadgeRef = useRef(null);
  const terminalHudRef = useRef(null);
  const terminalLogRef = useRef(null);
  const launchCtaRef = useRef(null);
  const outgoingConduitRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Instant complete state for accessibility
        gsap.set(
          [
            esp32Ref.current,
            sensorRef.current,
            resistorRef.current,
            ledRef.current,
            ledGlowRef.current,
            ledLightBeamRef.current,
            verifiedBadgeRef.current,
            terminalHudRef.current,
            launchCtaRef.current,
            outgoingConduitRef.current,
          ],
          { opacity: 1, scale: 1, x: 0, y: 0 }
        );
        gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current], {
          strokeDashoffset: 0,
        });
        gsap.set(progressFillRef.current, { width: "100%" });
        return;
      }

      // ================= INITIAL DORMANT STATE =================
      gsap.set(esp32Ref.current, { opacity: 0, y: 40, scale: 0.92 });
      gsap.set(esp32ReticleRef.current, { opacity: 0, scale: 1.25 });
      gsap.set(sensorRef.current, { opacity: 0, y: -35, scale: 0.88 });
      gsap.set(resistorRef.current, { opacity: 0, y: 25, scale: 0.85 });
      gsap.set(ledRef.current, { opacity: 0, y: 25, scale: 0.85 });
      gsap.set([ledGlowRef.current, ledLightBeamRef.current], { opacity: 0, scale: 0.3 });

      // Solder pads & flash points
      gsap.set([pad1Ref.current, pad2Ref.current, pad3Ref.current, pad4Ref.current], {
        opacity: 0,
        scale: 0,
      });

      // SVG Wires initially un-routed
      gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current], {
        strokeDasharray: 260,
        strokeDashoffset: 260,
      });

      gsap.set([pulseNode1Ref.current, pulseNode2Ref.current, pulseNode3Ref.current], {
        opacity: 0,
      });
      gsap.set(verifiedBadgeRef.current, { opacity: 0, scale: 0.8, y: -10 });
      gsap.set(terminalHudRef.current, { opacity: 0.4, y: 0 });
      gsap.set(launchCtaRef.current, { opacity: 0, y: 15, scale: 0.95 });
      gsap.set(outgoingConduitRef.current, { strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 });

      // Story HUD phase initial emphasis
      gsap.set(phase1Ref.current, { opacity: 1, borderColor: "rgba(245, 158, 11, 0.4)" });
      gsap.set([phase2Ref.current, phase3Ref.current, phase4Ref.current], {
        opacity: 0.35,
        borderColor: "rgba(255, 255, 255, 0.06)",
      });
      gsap.set(progressFillRef.current, { width: "10%" });

      // ================= MASTER CHOREOGRAPHED SCROLL TIMELINE =================
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTargetRef.current,
          start: "top top",
          end: isMobile ? "+=180%" : "+=260%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // ---------- BEAT 1: SILICON CORE INITIALIZATION (Scroll 0% - 25%) ----------
      // Crosshair locks onto PCB socket
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        0
      );
      // ESP32 snaps into socket
      masterTl.to(
        esp32Ref.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.3)" },
        0.2
      );
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 0.3, duration: 0.4 },
        0.9
      );
      masterTl.to(
        progressFillRef.current,
        { width: "25%", duration: 0.8 },
        0.2
      );

      // ---------- BEAT 2: PERIPHERAL CLUSTER INGRESS (Scroll 25% - 50%) ----------
      // Phase 1 dims, Phase 2 ignites
      masterTl.to(
        phase1Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.3 },
        1.1
      );
      masterTl.to(
        phase2Ref.current,
        { opacity: 1, borderColor: "rgba(249, 115, 22, 0.5)", duration: 0.4 },
        1.1
      );
      // Ultrasonic Sonar docks
      masterTl.to(
        sensorRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
        1.1
      );
      // Resistor & LED dock into breadboard output rails
      masterTl.to(
        [resistorRef.current, ledRef.current],
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.7, ease: "power2.out" },
        1.3
      );
      masterTl.to(
        progressFillRef.current,
        { width: "50%", duration: 0.8 },
        1.2
      );

      // ---------- BEAT 3: DYNAMIC COPPER TRACE ROUTING (Scroll 50% - 75%) ----------
      // Phase 2 dims, Phase 3 ignites
      masterTl.to(
        phase2Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.3 },
        2.1
      );
      masterTl.to(
        phase3Ref.current,
        { opacity: 1, borderColor: "rgba(239, 68, 68, 0.5)", duration: 0.4 },
        2.1
      );

      // Wire 1: 5V DC Power Rail (Red) routes to Sensor VCC
      masterTl.to(
        wire1Ref.current,
        { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" },
        2.1
      );
      masterTl.to(
        pad1Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 },
        2.6
      );

      // Wire 2: Ground Return Rail (Slate) routes to Sensor GND
      masterTl.to(
        wire2Ref.current,
        { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" },
        2.4
      );
      masterTl.to(
        pad2Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 },
        2.9
      );

      // Wire 3: GPIO2 Signal (Amber) routes through 220Ω Resistor
      masterTl.to(
        wire3Ref.current,
        { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" },
        2.7
      );
      masterTl.to(
        pad3Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 },
        3.2
      );

      // Wire 4: Resistor to LED Anode (Gold)
      masterTl.to(
        wire4Ref.current,
        { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut" },
        3.0
      );
      masterTl.to(
        pad4Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 },
        3.4
      );

      masterTl.to(
        progressFillRef.current,
        { width: "75%", duration: 0.8 },
        2.3
      );

      // ---------- BEAT 4: POWER IGNITION, FIRMWARE & CONDUIT (Scroll 75% - 100%) ----------
      // Phase 3 dims, Phase 4 ignites
      masterTl.to(
        phase3Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.3 },
        3.5
      );
      masterTl.to(
        phase4Ref.current,
        { opacity: 1, borderColor: "rgba(16, 185, 129, 0.6)", duration: 0.4 },
        3.5
      );

      // Current pulse nodes ignite along copper paths
      masterTl.to(
        [pulseNode1Ref.current, pulseNode2Ref.current, pulseNode3Ref.current],
        { opacity: 1, duration: 0.3 },
        3.5
      );

      // LED Ignites with radiance
      masterTl.to(
        ledGlowRef.current,
        { opacity: 1, scale: 1.15, duration: 0.7, ease: "power2.out" },
        3.6
      );
      masterTl.to(
        ledLightBeamRef.current,
        { opacity: 0.85, scale: 1, duration: 0.7, ease: "power2.out" },
        3.6
      );

      // Terminal HUD transitions to full verified brightness
      masterTl.to(
        terminalHudRef.current,
        { opacity: 1, duration: 0.5 },
        3.7
      );

      // Synthesis Complete Badge stamps in
      masterTl.to(
        verifiedBadgeRef.current,
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
        3.8
      );

      // Launch Studio CTA unlocks
      masterTl.to(
        launchCtaRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
        4.0
      );

      // Outgoing energy conduit feeds downward into Section 2
      masterTl.to(
        outgoingConduitRef.current,
        { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: "power1.inOut" },
        4.1
      );

      masterTl.to(
        progressFillRef.current,
        { width: "100%", duration: 0.6 },
        3.8
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="w-full min-h-screen flex items-center justify-center py-6 sm:py-10 px-4 sm:px-8 lg:px-12 bg-[#070509] overflow-hidden border-t border-white/[0.08]"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* ================= LEFT STORY CHOREOGRAPHY HUD ================= */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 z-20">
            {/* Top Telemetry Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Scene 02 // Circuit Synthesis</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-zinc-400">
                  AUTO-ROUTER v2.4
                </div>
              </div>

              {/* Progress Scrubber Bar */}
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  ref={progressFillRef}
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full transition-all duration-150"
                  style={{ width: "15%" }}
                />
              </div>
            </div>

            {/* Title with Gradient */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-white leading-[1.08]">
                Watch Your Circuit{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 font-handwriting text-4xl sm:text-5xl lg:text-6xl font-normal drop-shadow-[0_2px_14px_rgba(245,158,11,0.3)]">
                  Build Itself.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                Scroll down to assemble hardware components, route copper netlists, and synthesize Arduino firmware in real-time.
              </p>
            </div>

            {/* 4 Interactive Story Phases */}
            <div className="space-y-3 pt-1">
              {/* Phase 1 */}
              <div
                ref={phase1Ref}
                className="p-3.5 sm:p-4 rounded-2xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-outfit">Silicon Core Identified</h4>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">ESP32 DevKit V1</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Dual Tensilica Xtensa LX6 cores seated with verified GPIO2 mapping.</p>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div
                ref={phase2Ref}
                className="p-3.5 sm:p-4 rounded-2xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-mono text-xs font-bold shrink-0">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-outfit">Peripheral Cluster Mounted</h4>
                      <span className="text-[10px] font-mono text-orange-400 font-semibold">Sonar + Emitter</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">HC-SR04 ultrasonic sensor, 220Ω current limiter, and 5mm LED aligned.</p>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div
                ref={phase3Ref}
                className="p-3.5 sm:p-4 rounded-2xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-mono text-xs font-bold shrink-0">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-outfit">Automated Netlist Routing</h4>
                      <span className="text-[10px] font-mono text-red-400 font-semibold">4 Nets • 0 DRC Errors</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Jumper traces dynamically etched between terminals without short-circuits.</p>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div
                ref={phase4Ref}
                className="p-3.5 sm:p-4 rounded-2xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                    04
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-outfit">Live Current &amp; Firmware Synced</h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">3.3V Rails Active</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Photons flow, LED dome ignites, and Arduino C++ compiles with 100% test pass.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA Revealed at Culmination */}
            <div ref={launchCtaRef} className="pt-1">
              <button
                type="button"
                onClick={onLaunchStudio}
                className="group relative inline-flex flex-col items-start cursor-pointer hover:scale-[1.03] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3 text-lg sm:text-xl font-black font-outfit text-white group-hover:text-amber-200 transition-colors">
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>Open This Live Circuit in Blinky Studio</span>
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
          <div className="lg:col-span-7 relative w-full h-[450px] sm:h-[490px] lg:h-[530px] rounded-3xl bg-[#0c0910] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.06),0_0_35px_rgba(245,158,11,0.1)] overflow-hidden">
            
            {/* Dot Grid Matrix Matrix Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.16)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

            {/* Top Workspace Bar */}
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

            {/* ================= THE SVG CIRCUIT TRACE LAYER ================= */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 600 480"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="circuitGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
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

              {/* Solder Contact Pads at Terminals */}
              <circle ref={pad1Ref} cx="360" cy="100" r="5" fill="#f87171" filter="url(#circuitGlow)" />
              <circle ref={pad2Ref} cx="480" cy="380" r="5" fill="#94a3b8" filter="url(#circuitGlow)" />
              <circle ref={pad3Ref} cx="310" cy="310" r="5" fill="#fbbf24" filter="url(#circuitGlow)" />
              <circle ref={pad4Ref} cx="460" cy="310" r="5" fill="#fb923c" filter="url(#circuitGlow)" />

              {/* Electrical Current Pulse Photons (Active in Phase 4) */}
              <circle
                ref={pulseNode1Ref}
                r="4.5"
                fill="#fef08a"
                filter="url(#circuitGlow)"
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
                filter="url(#circuitGlow)"
              >
                <animateMotion
                  path="M 390 310 C 420 310, 430 310, 460 310"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                ref={pulseNode3Ref}
                r="4.5"
                fill="#fca5a5"
                filter="url(#circuitGlow)"
              >
                <animateMotion
                  path="M 180 180 C 220 180, 240 100, 360 100"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Outgoing Conduit Path (Flows out of canvas into Section 2) */}
              <path
                ref={outgoingConduitRef}
                d="M 480 400 L 480 480"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#circuitGlow)"
              />
            </svg>

            {/* Socket Alignment Reticle (Phase 1) */}
            <div
              ref={esp32ReticleRef}
              className="absolute left-4 sm:left-8 top-20 sm:top-24 w-40 sm:w-44 h-64 border-2 border-dashed border-amber-400/60 rounded-3xl pointer-events-none flex items-center justify-center z-15"
            >
              <span className="text-[10px] font-mono text-amber-400 font-bold bg-[#0c0910] px-2 py-0.5 rounded border border-amber-500/40">
                [MCU SOCKET 01]
              </span>
            </div>

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

            {/* ================= COMPONENT 4: 5mm RED LED WITH GLOW & LIGHT BEAM ================= */}
            <div
              ref={ledRef}
              className="absolute right-12 sm:right-20 bottom-24 w-16 h-16 flex items-center justify-center select-none z-20"
            >
              {/* Dynamic Ambient Glow */}
              <div
                ref={ledGlowRef}
                className="absolute inset-0 rounded-full bg-red-500/40 blur-2xl pointer-events-none scale-125"
              />

              {/* Light Cone on Breadboard */}
              <div
                ref={ledLightBeamRef}
                className="absolute -top-12 -left-12 w-40 h-40 bg-radial-gradient rounded-full pointer-events-none opacity-0"
                style={{
                  background: "radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(245, 158, 11, 0.1) 40%, transparent 70%)",
                }}
              />

              {/* LED Bulb Dome */}
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-amber-300 border-2 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.95)] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/70 blur-[1px] -translate-y-1 -translate-x-1" />
              </div>
              <span className="absolute -bottom-5 text-[9px] font-mono font-bold text-amber-400 bg-[#130d19] px-2 py-0.5 rounded border border-amber-500/30">
                LED [ON]
              </span>
            </div>

            {/* Terminal Diagnostic HUD (Bottom) */}
            <div
              ref={terminalHudRef}
              className="absolute bottom-4 left-6 right-6 p-2.5 sm:p-3 rounded-2xl bg-[#140e1b]/95 border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-30 backdrop-blur-md"
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

            {/* Corner Verification Stamp */}
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
