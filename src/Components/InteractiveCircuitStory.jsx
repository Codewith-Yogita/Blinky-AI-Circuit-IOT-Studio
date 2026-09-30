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

  // Story phases indicators (Desktop)
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);

  // Mobile Active Phase Indicators
  const mobilePhase1Ref = useRef(null);
  const mobilePhase2Ref = useRef(null);
  const mobilePhase3Ref = useRef(null);
  const mobilePhase4Ref = useRef(null);

  // Progress bars
  const progressFillRef = useRef(null);
  const mobileProgressFillRef = useRef(null);

  // Hardware SVG groups
  const esp32Ref = useRef(null);
  const esp32ReticleRef = useRef(null);
  const sensorRef = useRef(null);
  const resistorRef = useRef(null);
  const ledRef = useRef(null);
  const ledGlowRef = useRef(null);
  const ledLightBeamRef = useRef(null);
  const ledCoreRef = useRef(null);

  // Wires and Solder Pads
  const wire1Ref = useRef(null); // 5V Power
  const wire2Ref = useRef(null); // GND Return
  const wire3Ref = useRef(null); // GPIO2 Signal
  const wire4Ref = useRef(null); // Resistor to LED Anode
  const wire5Ref = useRef(null); // LED Cathode to GND

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
  const launchCtaRef = useRef(null);
  const mobileLaunchCtaRef = useRef(null);
  const outgoingConduitRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;

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
            ledCoreRef.current,
            verifiedBadgeRef.current,
            terminalHudRef.current,
            launchCtaRef.current,
            mobileLaunchCtaRef.current,
            outgoingConduitRef.current,
          ],
          { opacity: 1, scale: 1, x: 0, y: 0 }
        );
        gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current, wire5Ref.current], {
          strokeDashoffset: 0,
        });
        gsap.set([progressFillRef.current, mobileProgressFillRef.current], { width: "100%" });
        return;
      }

      // ================= INITIAL DORMANT STATE =================
      gsap.set(esp32Ref.current, { opacity: 0, y: 35, scale: 0.94 });
      gsap.set(esp32ReticleRef.current, { opacity: 0, scale: 1.2 });
      gsap.set(sensorRef.current, { opacity: 0, y: -30, scale: 0.9 });
      gsap.set(resistorRef.current, { opacity: 0, y: 20, scale: 0.85 });
      gsap.set(ledRef.current, { opacity: 0, y: 20, scale: 0.85 });
      gsap.set([ledGlowRef.current, ledLightBeamRef.current], { opacity: 0, scale: 0.3 });
      gsap.set(ledCoreRef.current, { fill: "#7f1d1d" });

      // Solder pads
      gsap.set([pad1Ref.current, pad2Ref.current, pad3Ref.current, pad4Ref.current], {
        opacity: 0,
        scale: 0,
      });

      // SVG Wires initially un-routed
      gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current, wire5Ref.current], {
        strokeDasharray: 320,
        strokeDashoffset: 320,
      });

      gsap.set([pulseNode1Ref.current, pulseNode2Ref.current, pulseNode3Ref.current], {
        opacity: 0,
      });
      gsap.set(verifiedBadgeRef.current, { opacity: 0, scale: 0.8, y: -10 });
      gsap.set(terminalHudRef.current, { opacity: 0.4 });
      gsap.set([launchCtaRef.current, mobileLaunchCtaRef.current], { opacity: 0, y: 12, scale: 0.96 });
      gsap.set(outgoingConduitRef.current, { strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 });

      // Story HUD phase initial emphasis (Desktop)
      gsap.set(phase1Ref.current, { opacity: 1, borderColor: "rgba(245, 158, 11, 0.4)" });
      gsap.set([phase2Ref.current, phase3Ref.current, phase4Ref.current], {
        opacity: 0.35,
        borderColor: "rgba(255, 255, 255, 0.06)",
      });

      // Mobile active phase setup
      gsap.set(mobilePhase1Ref.current, { display: "block", opacity: 1 });
      gsap.set([mobilePhase2Ref.current, mobilePhase3Ref.current, mobilePhase4Ref.current], {
        display: "none",
        opacity: 0,
      });

      gsap.set([progressFillRef.current, mobileProgressFillRef.current], { width: "10%" });

      // ================= MASTER CHOREOGRAPHED SCROLL TIMELINE =================
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTargetRef.current,
          start: "top top",
          end: isMobile ? "+=110%" : "+=240%",
          pin: true,
          scrub: isMobile ? 0.5 : 0.75,
          anticipatePin: 1,
        },
      });

      // ---------- BEAT 1: SILICON CORE INITIALIZATION (Scroll 0% - 25%) ----------
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
        0
      );
      masterTl.to(
        esp32Ref.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
        0.15
      );
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 0.25, duration: 0.3 },
        0.8
      );
      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "25%", duration: 0.7 },
        0.15
      );

      // ---------- BEAT 2: PERIPHERAL CLUSTER INGRESS (Scroll 25% - 50%) ----------
      masterTl.to(
        phase1Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.25 },
        1.0
      );
      masterTl.to(
        phase2Ref.current,
        { opacity: 1, borderColor: "rgba(249, 115, 22, 0.5)", duration: 0.3 },
        1.0
      );

      masterTl.to(mobilePhase1Ref.current, { opacity: 0, duration: 0.2 }, 1.0);
      masterTl.set(mobilePhase1Ref.current, { display: "none" }, 1.2);
      masterTl.set(mobilePhase2Ref.current, { display: "block" }, 1.2);
      masterTl.to(mobilePhase2Ref.current, { opacity: 1, duration: 0.2 }, 1.2);

      // Sonar sensor docks
      masterTl.to(
        sensorRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" },
        1.0
      );
      // Resistor & LED dock
      masterTl.to(
        [resistorRef.current, ledRef.current],
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "power2.out" },
        1.2
      );
      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "50%", duration: 0.7 },
        1.1
      );

      // ---------- BEAT 3: DYNAMIC COPPER TRACE ROUTING (Scroll 50% - 75%) ----------
      masterTl.to(
        phase2Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.25 },
        2.0
      );
      masterTl.to(
        phase3Ref.current,
        { opacity: 1, borderColor: "rgba(239, 68, 68, 0.5)", duration: 0.3 },
        2.0
      );

      masterTl.to(mobilePhase2Ref.current, { opacity: 0, duration: 0.2 }, 2.0);
      masterTl.set(mobilePhase2Ref.current, { display: "none" }, 2.2);
      masterTl.set(mobilePhase3Ref.current, { display: "block" }, 2.2);
      masterTl.to(mobilePhase3Ref.current, { opacity: 1, duration: 0.2 }, 2.2);

      // Wire 1: 5V DC Power Rail (Red) routes to Sensor VCC
      masterTl.to(
        wire1Ref.current,
        { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" },
        2.0
      );
      masterTl.to(
        pad1Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 },
        2.5
      );

      // Wire 2: Ground Return Rail (Slate)
      masterTl.to(
        wire2Ref.current,
        { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" },
        2.2
      );
      masterTl.to(
        pad2Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 },
        2.7
      );

      // Wire 3: GPIO2 Signal (Amber)
      masterTl.to(
        wire3Ref.current,
        { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" },
        2.5
      );
      masterTl.to(
        pad3Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 },
        3.0
      );

      // Wire 4 & 5: Resistor to LED & LED return
      masterTl.to(
        [wire4Ref.current, wire5Ref.current],
        { strokeDashoffset: 0, stagger: 0.15, duration: 0.5, ease: "power1.inOut" },
        2.8
      );
      masterTl.to(
        pad4Ref.current,
        { opacity: 1, scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 },
        3.2
      );

      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "75%", duration: 0.7 },
        2.2
      );

      // ---------- BEAT 4: POWER IGNITION, FIRMWARE & CONDUIT (Scroll 75% - 100%) ----------
      masterTl.to(
        phase3Ref.current,
        { opacity: 0.35, borderColor: "rgba(255, 255, 255, 0.06)", duration: 0.25 },
        3.4
      );
      masterTl.to(
        phase4Ref.current,
        { opacity: 1, borderColor: "rgba(16, 185, 129, 0.6)", duration: 0.3 },
        3.4
      );

      masterTl.to(mobilePhase3Ref.current, { opacity: 0, duration: 0.2 }, 3.4);
      masterTl.set(mobilePhase3Ref.current, { display: "none" }, 3.6);
      masterTl.set(mobilePhase4Ref.current, { display: "block" }, 3.6);
      masterTl.to(mobilePhase4Ref.current, { opacity: 1, duration: 0.2 }, 3.6);

      // Current pulse nodes ignite
      masterTl.to(
        [pulseNode1Ref.current, pulseNode2Ref.current, pulseNode3Ref.current],
        { opacity: 1, duration: 0.25 },
        3.4
      );

      // LED Ignites into radiant emission
      masterTl.to(
        ledCoreRef.current,
        { fill: "url(#ledActiveGrad)", duration: 0.4 },
        3.5
      );
      masterTl.to(
        ledGlowRef.current,
        { opacity: 1, scale: 1.25, duration: 0.6, ease: "power2.out" },
        3.5
      );
      masterTl.to(
        ledLightBeamRef.current,
        { opacity: 0.85, scale: 1, duration: 0.6, ease: "power2.out" },
        3.5
      );

      // Terminal HUD transitions to full verified brightness
      masterTl.to(
        terminalHudRef.current,
        { opacity: 1, duration: 0.4 },
        3.6
      );

      // Verification Badge
      masterTl.to(
        verifiedBadgeRef.current,
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
        3.7
      );

      // Launch Studio CTA unlocks
      masterTl.to(
        [launchCtaRef.current, mobileLaunchCtaRef.current],
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
        3.8
      );

      // Outgoing energy conduit feeds downward
      masterTl.to(
        outgoingConduitRef.current,
        { strokeDashoffset: 0, opacity: 1, duration: 0.6, ease: "power1.inOut" },
        3.9
      );

      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "100%", duration: 0.5 },
        3.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="w-full min-h-[520px] sm:min-h-screen flex items-center justify-center py-4 sm:py-8 lg:py-12 px-3 sm:px-6 lg:px-12 bg-[#070509] overflow-hidden border-t border-white/[0.08]"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
          
          {/* ================= MOBILE / TABLET COMPACT HUD (< 1024px) ================= */}
          <div className="w-full lg:hidden space-y-3 z-20">
            {/* Header pill & Progress */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>02 // Circuit Synthesis</span>
              </div>
              <div className="text-[10px] font-mono font-bold text-zinc-400">
                REAL HARDWARE
              </div>
            </div>

            {/* Title & Active Step Card (Compact) */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-white tracking-tight leading-tight">
                Watch Your Circuit{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 font-handwriting text-2xl sm:text-3xl font-normal">
                  Build Itself.
                </span>
              </h2>

              {/* Dynamic Active Step Cards */}
              <div className="relative min-h-[54px] rounded-xl border border-amber-500/30 bg-[#120d18]/95 p-2.5 shadow-lg">
                <div ref={mobilePhase1Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">01</span>
                    <span>ESP32-WROOM-32 Placed</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Dual Xtensa LX6 SoC with gold header pins &amp; RF shield seated.
                  </p>
                </div>

                <div ref={mobilePhase2Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px]">02</span>
                    <span>HC-SR04 &amp; 220Ω Load Mounted</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Acoustic sonar cans, axial resistor &amp; ruby LED locked into grid.
                  </p>
                </div>

                <div ref={mobilePhase3Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px]">03</span>
                    <span>Dupont Jumper Wires Etched</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Physical copper jumpers routed with black terminal boots.
                  </p>
                </div>

                <div ref={mobilePhase4Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">04</span>
                    <span>3.3V Current &amp; C++ Code Verified</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    LED bulb illuminates, firmware compiled with zero short circuits.
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  ref={mobileProgressFillRef}
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
            </div>
          </div>

          {/* ================= DESKTOP STORY HUD (≥ 1024px) ================= */}
          <div className="hidden lg:block lg:col-span-5 space-y-6 z-20">
            {/* Top Telemetry Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Scene 02 // Circuit Synthesis</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-zinc-400">
                  REAL HARDWARE COMPONENTS
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
                Scroll down to assemble authentic physical hardware, route real Dupont jumpers, and synthesize Arduino firmware in real-time.
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
                      <h4 className="text-sm font-bold text-white font-outfit">ESP32-WROOM-32 Placed</h4>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">DevKit V1</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Obsidian PCB with brushed RF shield, MIFA antenna &amp; gold pin headers.</p>
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
                      <h4 className="text-sm font-bold text-white font-outfit">Peripherals Mounted</h4>
                      <span className="text-[10px] font-mono text-orange-400 font-semibold">Sonar + Resistor + LED</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Aluminum acoustic transducers, ceramic 220Ω resistor &amp; ruby LED placed.</p>
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
                      <h4 className="text-sm font-bold text-white font-outfit">Physical Dupont Wires Routed</h4>
                      <span className="text-[10px] font-mono text-red-400 font-semibold">4 Nets • 0 Short Circuits</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Colored jumper leads with crimp boots auto-route to pinout coordinates.</p>
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
                      <h4 className="text-sm font-bold text-white font-outfit">Live Current &amp; Firmware Verified</h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">3.3V Rails Active</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Electrons flow, LED filament illuminates, C++ firmware compiles 100% OK.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Launch CTA */}
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

          {/* ================= ULTRA-REALISTIC ELECTRONICS WORKBENCH CANVAS ================= */}
          <div className="w-full lg:col-span-7 relative h-[260px] sm:h-[330px] md:h-[400px] lg:h-[520px] rounded-2xl sm:rounded-3xl bg-[#09070c] border border-amber-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.08),0_0_40px_rgba(245,158,11,0.12)] overflow-hidden">
            
            {/* Top Workspace Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-9 sm:h-11 px-3 sm:px-6 bg-[#130d19]/90 border-b border-white/[0.08] flex items-center justify-between z-30 backdrop-blur-md">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 font-bold ml-1 sm:ml-2">WORKSPACE://CIRCUIT_PROTOTYPE_01</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono text-amber-400 font-bold">
                <Cpu size={12} className="text-amber-400" />
                <span>ESP32-WROOM-32</span>
              </div>
            </div>

            {/* ================= VECTOR HARDWARE & CIRCUIT CANVAS ================= */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 600 440"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Visual Shaders, Metallic Gradients & Glow Filters */}
                <filter id="circuitGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="componentShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
                </filter>

                {/* Brushed Aluminum Shield Gradient */}
                <linearGradient id="metalShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="25%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="75%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Gold Pin Plating Gradient */}
                <linearGradient id="goldPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Ultrasonic Aluminum Can Gradient */}
                <radialGradient id="transducerSilverGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="35%" stopColor="#cbd5e1" />
                  <stop offset="75%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </radialGradient>

                {/* Resistor Ceramic Body Gradient */}
                <linearGradient id="resistorBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="20%" stopColor="#d4a373" />
                  <stop offset="70%" stopColor="#a3704c" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>

                {/* Active Glowing Ruby LED Dome */}
                <radialGradient id="ledActiveGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="20%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="90%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#450a0a" />
                </radialGradient>

                {/* Breadboard Gold Via Dot Grid Pattern */}
                <pattern id="breadboardGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="11" cy="11" r="3" fill="#140f1c" stroke="#b45309" strokeWidth="0.8" strokeOpacity="0.4" />
                  <circle cx="11" cy="11" r="1.3" fill="#070509" />
                </pattern>
              </defs>

              {/* Prototyping Breadboard Dot Grid Background */}
              <rect width="600" height="440" fill="url(#breadboardGrid)" />

              {/* ================= DUPONT JUMPER WIRES WITH REAL SHADOW & SPECULAR HIGHLIGHT ================= */}
              
              {/* Wire 1: 5V DC Power Rail (Red) */}
              <path
                d="M 175 160 C 220 160, 270 95, 360 95"
                stroke="#000000"
                strokeWidth="7"
                strokeOpacity="0.6"
                fill="none"
                strokeLinecap="round"
                transform="translate(2, 4)"
              />
              <path
                ref={wire1Ref}
                d="M 175 160 C 220 160, 270 95, 360 95"
                stroke="#ef4444"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 2: Ground Return Rail (Dark Slate/Black) */}
              <path
                d="M 175 280 C 250 280, 330 380, 480 380 C 530 380, 530 140, 530 95"
                stroke="#000000"
                strokeWidth="7"
                strokeOpacity="0.6"
                fill="none"
                strokeLinecap="round"
                transform="translate(2, 4)"
              />
              <path
                ref={wire2Ref}
                d="M 175 280 C 250 280, 330 380, 480 380 C 530 380, 530 140, 530 95"
                stroke="#475569"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 3: Digital GPIO2 Signal to Resistor (Amber) */}
              <path
                d="M 175 220 C 200 220, 220 222, 260 222"
                stroke="#000000"
                strokeWidth="7"
                strokeOpacity="0.6"
                fill="none"
                strokeLinecap="round"
                transform="translate(2, 4)"
              />
              <path
                ref={wire3Ref}
                d="M 175 220 C 200 220, 220 222, 260 222"
                stroke="#f59e0b"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 4: Resistor to LED Anode (Orange/Gold) */}
              <path
                d="M 340 222 L 420 222"
                stroke="#000000"
                strokeWidth="7"
                strokeOpacity="0.6"
                fill="none"
                strokeLinecap="round"
                transform="translate(2, 4)"
              />
              <path
                ref={wire4Ref}
                d="M 340 222 L 420 222"
                stroke="#f97316"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 5: LED Cathode to GND rail */}
              <path
                d="M 460 242 C 460 380, 480 380, 480 380"
                stroke="#000000"
                strokeWidth="6"
                strokeOpacity="0.6"
                fill="none"
                strokeLinecap="round"
                transform="translate(2, 4)"
              />
              <path
                ref={wire5Ref}
                d="M 460 242 C 460 380, 480 380, 480 380"
                stroke="#64748b"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Black Dupont Crimp Connector Boots at Wire Ends */}
              {/* At ESP32 pins */}
              <rect x="170" y="153" width="10" height="14" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
              <rect x="170" y="213" width="10" height="14" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
              <rect x="170" y="273" width="10" height="14" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
              
              {/* At Sonar pins */}
              <rect x="355" y="88" width="10" height="14" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
              <rect x="525" y="88" width="10" height="14" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />

              {/* Solder Contact Pads at Terminals */}
              <circle ref={pad1Ref} cx="360" cy="95" r="4.5" fill="#f87171" filter="url(#circuitGlow)" />
              <circle ref={pad2Ref} cx="530" cy="95" r="4.5" fill="#94a3b8" filter="url(#circuitGlow)" />
              <circle ref={pad3Ref} cx="260" cy="222" r="4.5" fill="#fbbf24" filter="url(#circuitGlow)" />
              <circle ref={pad4Ref} cx="420" cy="222" r="4.5" fill="#fb923c" filter="url(#circuitGlow)" />

              {/* Electrical Current Pulse Photons (Active in Phase 4) */}
              <circle
                ref={pulseNode1Ref}
                r="4.5"
                fill="#fef08a"
                filter="url(#circuitGlow)"
              >
                <animateMotion
                  path="M 175 220 C 200 220, 220 222, 260 222"
                  dur="1.1s"
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
                  path="M 340 222 L 420 222"
                  dur="1.1s"
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
                  path="M 175 160 C 220 160, 270 95, 360 95"
                  dur="1.3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Outgoing Conduit Path (Flows out of canvas into Section 2) */}
              <path
                ref={outgoingConduitRef}
                d="M 480 380 L 480 440"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#circuitGlow)"
              />

              {/* ================= COMPONENT 1: REALISTIC ESP32 DEVKIT V1 ================= */}
              {/* Alignment Reticle */}
              <rect
                ref={esp32ReticleRef}
                x="30"
                y="80"
                width="150"
                height="240"
                rx="16"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.5"
              />

              <g ref={esp32Ref} id="esp32-mcu" transform="translate(35, 85)" filter="url(#componentShadow)">
                {/* Matte Obsidian Black PCB Substrate */}
                <rect width="140" height="230" rx="8" fill="#120e18" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.7" />
                
                {/* 4 Corner Screwholes with Gold Annular Rings */}
                <circle cx="8" cy="8" r="4.5" fill="#1c1917" stroke="#d97706" strokeWidth="1" />
                <circle cx="132" cy="8" r="4.5" fill="#1c1917" stroke="#d97706" strokeWidth="1" />
                <circle cx="8" cy="222" r="4.5" fill="#1c1917" stroke="#d97706" strokeWidth="1" />
                <circle cx="132" cy="222" r="4.5" fill="#1c1917" stroke="#d97706" strokeWidth="1" />

                {/* MIFA Meandering Copper PCB Antenna at Top */}
                <rect x="25" y="6" width="90" height="26" rx="3" fill="#241208" stroke="#78350f" strokeWidth="0.8" />
                {/* Serpentine Golden Copper Trace */}
                <path
                  d="M 32 26 L 32 12 L 40 12 L 40 26 L 48 26 L 48 12 L 56 12 L 56 26 L 64 26 L 64 12 L 72 12 L 72 26 L 80 26 L 80 12 L 88 12 L 88 26 L 96 26 L 96 12 L 108 12"
                  stroke="url(#goldPinGrad)"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Brushed Aluminum Metal RF Shield (ESP-WROOM-32) */}
                <rect x="20" y="38" width="100" height="100" rx="6" fill="url(#metalShieldGrad)" stroke="#64748b" strokeWidth="1.2" />
                <rect x="22" y="40" width="96" height="96" rx="4" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeOpacity="0.4" />
                
                {/* Laser-Etched Espressif Emblem & Markings */}
                <polygon points="70,48 76,51.5 76,58.5 70,62 64,58.5 64,51.5" fill="#f8fafc" opacity="0.8" />
                <text x="70" y="73" fill="#f1f5f9" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                  ESPRESSIF
                </text>
                <text x="70" y="87" fill="#f8fafc" fontSize="11" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  ESP-WROOM-32
                </text>
                <text x="70" y="100" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  FCC ID: 2AC7Z-ESPWROOM32
                </text>
                <text x="70" y="112" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  Wi-Fi + BT 4.2 + BLE SoC
                </text>

                {/* Mini 2D DataMatrix Security Square */}
                <rect x="30" y="118" width="12" height="12" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                <rect x="32" y="120" width="3" height="3" fill="#f8fafc" />
                <rect x="37" y="120" width="3" height="3" fill="#f8fafc" />
                <rect x="32" y="125" width="3" height="3" fill="#f8fafc" />
                <rect x="36" y="124" width="4" height="4" fill="#f8fafc" />

                {/* CE Stamped Mark */}
                <text x="105" y="128" fill="#e2e8f0" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  CE
                </text>

                {/* EN & BOOT Tactile Buttons with Metal Domes */}
                <g transform="translate(24, 148)">
                  <rect width="18" height="14" rx="2" fill="#1c1917" stroke="#78350f" strokeWidth="0.8" />
                  <circle cx="9" cy="7" r="4.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
                  <text x="9" y="21" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">EN</text>
                </g>

                <g transform="translate(98, 148)">
                  <rect width="18" height="14" rx="2" fill="#1c1917" stroke="#78350f" strokeWidth="0.8" />
                  <circle cx="9" cy="7" r="4.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
                  <text x="9" y="21" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">BOOT</text>
                </g>

                {/* Silicon CP2102 USB Bridge Chip (Center) */}
                <rect x="56" y="152" width="28" height="28" rx="2" fill="#09060d" stroke="#64748b" strokeWidth="0.8" />
                <circle cx="61" cy="157" r="1.2" fill="#f59e0b" />
                <text x="70" y="168" fill="#cbd5e1" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CP2102</text>

                {/* AMS1117-3.3 Voltage Regulator (SOT-223) */}
                <rect x="52" y="186" width="36" height="16" rx="2" fill="#1c1917" stroke="#475569" strokeWidth="0.8" />
                <rect x="62" y="184" width="16" height="3" fill="#cbd5e1" />
                <text x="70" y="197" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">AMS1117</text>

                {/* Micro-USB Receptacle at Bottom */}
                <rect x="50" y="212" width="40" height="18" rx="3" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="56" y="218" width="28" height="8" rx="1.5" fill="#0f172a" />

                {/* Left & Right 15-Pin Black Thermoplastic Header Strips */}
                {/* Left Header */}
                <rect x="3" y="20" width="11" height="190" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
                {Array.from({ length: 15 }).map((_, i) => (
                  <circle key={`lpin-${i}`} cx="8.5" cy={30 + i * 12} r="2.2" fill="url(#goldPinGrad)" stroke="#78350f" strokeWidth="0.6" />
                ))}

                {/* Right Header */}
                <rect x="126" y="20" width="11" height="190" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
                {Array.from({ length: 15 }).map((_, i) => (
                  <circle key={`rpin-${i}`} cx="131.5" cy={30 + i * 12} r="2.2" fill="url(#goldPinGrad)" stroke="#78350f" strokeWidth="0.6" />
                ))}

                {/* Output Labels at Key Terminals */}
                <text x="122" y="77" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">5V ●</text>
                <text x="122" y="137" fill="#fef08a" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">GPIO2 ●</text>
                <text x="122" y="197" fill="#cbd5e1" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">GND ●</text>
              </g>

              {/* ================= COMPONENT 2: REALISTIC HC-SR04 ULTRASONIC SENSOR ================= */}
              <g ref={sensorRef} id="sonar-sensor" transform="translate(345, 45)" filter="url(#componentShadow)">
                {/* Classic Royal Blue PCB Board */}
                <rect width="195" height="85" rx="8" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                
                {/* 4 Mounting Screwholes */}
                <circle cx="8" cy="8" r="3.5" fill="#0f172a" stroke="#93c5fd" strokeWidth="0.8" />
                <circle cx="187" cy="8" r="3.5" fill="#0f172a" stroke="#93c5fd" strokeWidth="0.8" />
                <circle cx="8" cy="77" r="3.5" fill="#0f172a" stroke="#93c5fd" strokeWidth="0.8" />
                <circle cx="187" cy="77" r="3.5" fill="#0f172a" stroke="#93c5fd" strokeWidth="0.8" />

                {/* Left Transducer (Transmitter "T") - 3D Aluminum Acoustic Can with Mesh */}
                <circle cx="50" cy="42" r="32" fill="url(#transducerSilverGrad)" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="50" cy="42" r="25" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                {/* Wire Mesh Acoustic Grille Crosshatching */}
                <path
                  d="M 28 42 H 72 M 50 20 V 64 M 34 30 L 66 54 M 34 54 L 66 30 M 30 36 L 70 48 M 30 48 L 70 36"
                  stroke="#334155"
                  strokeWidth="0.9"
                  opacity="0.8"
                />
                <circle cx="50" cy="42" r="12" fill="#1e293b" />
                <text x="50" y="47" fill="#f8fafc" fontSize="13" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  T
                </text>

                {/* Right Transducer (Receiver "R") */}
                <circle cx="145" cy="42" r="32" fill="url(#transducerSilverGrad)" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="145" cy="42" r="25" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                <path
                  d="M 123 42 H 167 M 145 20 V 64 M 129 30 L 161 54 M 129 54 L 161 30 M 125 36 L 165 48 M 125 48 L 165 36"
                  stroke="#334155"
                  strokeWidth="0.9"
                  opacity="0.8"
                />
                <circle cx="145" cy="42" r="12" fill="#1e293b" />
                <text x="145" y="47" fill="#f8fafc" fontSize="13" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">
                  R
                </text>

                {/* Metal Quartz Crystal Oscillator Package (HC-49/S) */}
                <rect x="89" y="32" width="18" height="24" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                <text x="98" y="46" fill="#334155" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  4.000
                </text>

                {/* Silkscreen Brand Label */}
                <text x="98" y="20" fill="#fef08a" fontSize="9.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  HC-SR04
                </text>

                {/* 4-Pin Right Angle Header at Bottom */}
                <rect x="74" y="70" width="48" height="12" fill="#1c1917" stroke="#44403c" strokeWidth="0.8" />
                <circle cx="80" cy="76" r="2.2" fill="url(#goldPinGrad)" />
                <circle cx="92" cy="76" r="2.2" fill="url(#goldPinGrad)" />
                <circle cx="104" cy="76" r="2.2" fill="url(#goldPinGrad)" />
                <circle cx="116" cy="76" r="2.2" fill="url(#goldPinGrad)" />

                <text x="80" y="66" fill="#fca5a5" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">VCC</text>
                <text x="92" y="66" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Trig</text>
                <text x="104" y="66" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Echo</text>
                <text x="116" y="66" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GND</text>
              </g>

              {/* ================= COMPONENT 3: REALISTIC 220Ω CERAMIC RESISTOR ================= */}
              <g ref={resistorRef} id="resistor-comp" transform="translate(255, 208)" filter="url(#componentShadow)">
                {/* Tinned Copper Wire Leads (Left & Right) */}
                <line x1="0" y1="14" x2="20" y2="14" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <line x1="72" y1="14" x2="92" y2="14" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />

                {/* Specular Highlight on Leads */}
                <line x1="0" y1="13.2" x2="20" y2="13.2" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="72" y1="13.2" x2="92" y2="13.2" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

                {/* Classical Dumbbell / Dog-Bone Ceramic Body */}
                <path
                  d="M 20 14 C 20 7, 24 5, 28 5 C 32 5, 34 8, 46 8 C 58 8, 60 5, 64 5 C 68 5, 72 7, 72 14 C 72 21, 68 23, 64 23 C 60 23, 58 20, 46 20 C 34 20, 32 23, 28 23 C 24 23, 20 21, 20 14 Z"
                  fill="url(#resistorBodyGrad)"
                  stroke="#78350f"
                  strokeWidth="1.2"
                />

                {/* Precision Color Bands (220Ω: Red - Red - Brown - Gold) */}
                <rect x="27" y="5.2" width="5.5" height="17.6" fill="#dc2626" rx="1" />
                <rect x="36" y="7.5" width="5.5" height="13" fill="#dc2626" rx="1" />
                <rect x="45" y="7.5" width="5.5" height="13" fill="#78350f" rx="1" />
                <rect x="61" y="5.2" width="5.5" height="17.6" fill="url(#goldPinGrad)" rx="1" />

                {/* Component Label */}
                <text x="46" y="34" fill="#fef08a" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  220Ω (±5%)
                </text>
              </g>

              {/* ================= COMPONENT 4: REALISTIC 5mm RED DIFFUSED LED ================= */}
              <g ref={ledRef} id="led-emitter" transform="translate(420, 195)" filter="url(#componentShadow)">
                {/* Physical Terminal Leads */}
                <line x1="0" y1="27" x2="22" y2="27" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <line x1="42" y1="48" x2="42" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

                {/* Ambient Radial Light Beam onto Breadboard */}
                <circle
                  ref={ledLightBeamRef}
                  cx="42"
                  cy="27"
                  r="75"
                  fill="url(#ledActiveGrad)"
                  opacity="0"
                  filter="url(#circuitGlow)"
                />

                {/* Ambient Radial Glowing Halo */}
                <circle
                  ref={ledGlowRef}
                  cx="42"
                  cy="27"
                  r="50"
                  fill="#ef4444"
                  opacity="0"
                  filter="url(#circuitGlow)"
                />

                {/* Lower Flanged Rim with Flat Cathode Notch */}
                <ellipse cx="42" cy="38" rx="22" ry="6" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
                <line x1="62" y1="34" x2="62" y2="42" stroke="#7f1d1d" strokeWidth="2.5" />

                {/* Ruby Red Translucent Epoxy Bulb Dome */}
                <circle
                  ref={ledCoreRef}
                  cx="42"
                  cy="27"
                  r="21"
                  fill="#b91c1c"
                  stroke="#ef4444"
                  strokeWidth="1.8"
                />

                {/* Visible Internal Metallic Leadframe (Anvil & Post) */}
                <path d="M 37 36 L 37 25 L 32 20 L 42 20" stroke="#fca5a5" strokeWidth="1.6" fill="#fca5a5" opacity="0.75" />
                <path d="M 47 36 L 47 22 L 43 20" stroke="#fca5a5" strokeWidth="1.2" fill="none" opacity="0.75" />

                {/* 3D Glass Specular Reflection Crescent */}
                <ellipse cx="35" cy="20" rx="8" ry="4" fill="#ffffff" opacity="0.65" transform="rotate(-30, 35, 20)" />

                <text x="42" y="60" fill="#fca5a5" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  5mm RED LED
                </text>
              </g>
            </svg>

            {/* Bottom Diagnostic HUD (Inside Canvas) */}
            <div
              ref={terminalHudRef}
              className="absolute bottom-2.5 sm:bottom-4 left-3 sm:left-6 right-3 sm:right-6 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#140e1b]/95 border border-amber-500/40 shadow-xl flex items-center justify-between gap-2 z-30 backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold truncate">
                  AUTONOMOUS NETLIST VERIFIED
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 hidden md:inline">
                  • 0 Short Circuits • Arduino C++ Firmware Ready
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold shrink-0">
                GPIO2 ➔ 220Ω ➔ LED • 3.3V
              </div>
            </div>

            {/* Corner Verification Stamp */}
            <div
              ref={verifiedBadgeRef}
              className="absolute top-11 sm:top-14 right-3 sm:right-6 px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] z-30"
            >
              <ShieldCheck size={12} />
              <span>AI SYNTHESIS READY</span>
            </div>
          </div>

          {/* ================= MOBILE BOTTOM CTA BUTTON (< 1024px) ================= */}
          <div ref={mobileLaunchCtaRef} className="w-full lg:hidden pt-1 flex justify-center z-20">
            <button
              type="button"
              onClick={onLaunchStudio}
              className="group relative inline-flex flex-col items-center cursor-pointer hover:scale-[1.03] active:scale-95 transition-all w-full max-w-sm"
            >
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-black font-outfit text-white group-hover:text-amber-200 transition-colors">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                <span>Open This Circuit in Blinky Studio</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
              </div>
              {/* Organic brush stroke underline */}
              <svg className="w-48 h-2.5 -mt-0.5 overflow-visible" viewBox="0 0 160 10" fill="none">
                <path d="M2 6 C40 2, 95 8, 158 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
