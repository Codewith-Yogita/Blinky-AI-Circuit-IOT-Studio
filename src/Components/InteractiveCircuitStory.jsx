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

      // Solder pads
      gsap.set([pad1Ref.current, pad2Ref.current, pad3Ref.current, pad4Ref.current], {
        opacity: 0,
        scale: 0,
      });

      // SVG Wires initially un-routed
      gsap.set([wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current, wire5Ref.current], {
        strokeDasharray: 300,
        strokeDashoffset: 300,
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
      // Desktop phase transition
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

      // Mobile active phase transition
      masterTl.to(mobilePhase1Ref.current, { opacity: 0, duration: 0.2 }, 1.0);
      masterTl.set(mobilePhase1Ref.current, { display: "none" }, 1.2);
      masterTl.set(mobilePhase2Ref.current, { display: "block" }, 1.2);
      masterTl.to(mobilePhase2Ref.current, { opacity: 1, duration: 0.2 }, 1.2);

      // Sonar docks
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
      // Desktop phase transition
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

      // Mobile active phase transition
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
      // Desktop phase transition
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

      // Mobile active phase transition
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

      // LED Ignites
      masterTl.to(
        ledGlowRef.current,
        { opacity: 1, scale: 1.2, duration: 0.6, ease: "power2.out" },
        3.5
      );
      masterTl.to(
        ledLightBeamRef.current,
        { opacity: 0.8, scale: 1, duration: 0.6, ease: "power2.out" },
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
      {/* Pinned Viewport Container (Adaptive padding so fits 100% of mobile viewports) */}
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
                AUTO-ROUTER
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

              {/* Dynamic Active Step Cards (Only 1 shown at a time to preserve viewport height) */}
              <div className="relative min-h-[54px] rounded-xl border border-amber-500/30 bg-[#120d18]/95 p-2.5 shadow-lg">
                <div ref={mobilePhase1Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">01</span>
                    <span>Silicon Core Placed</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    ESP32 DevKit V1 seated with verified GPIO mapping.
                  </p>
                </div>

                <div ref={mobilePhase2Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px]">02</span>
                    <span>Peripherals Mounted</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    HC-SR04 sonar module, 220Ω resistor, and LED aligned.
                  </p>
                </div>

                <div ref={mobilePhase3Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px]">03</span>
                    <span>Netlist Traces Etched</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Copper jumpers dynamically routed with 0 short circuits.
                  </p>
                </div>

                <div ref={mobilePhase4Ref} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">04</span>
                    <span>Live Current &amp; Code Verified</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Signals flow, LED dome ignites, Arduino firmware ready.
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

          {/* ================= RESPONSIVE DYNAMIC VECTOR CANVAS ================= */}
          <div className="w-full lg:col-span-7 relative h-[250px] sm:h-[320px] md:h-[380px] lg:h-[500px] rounded-2xl sm:rounded-3xl bg-[#0c0910] border border-amber-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.06),0_0_35px_rgba(245,158,11,0.1)] overflow-hidden">
            
            {/* Dot Grid Matrix Matrix Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.16)_1px,transparent_1px)] [background-size:20px_20px] sm:[background-size:22px_22px] pointer-events-none" />

            {/* Top Workspace Bar */}
            <div className="absolute top-0 left-0 right-0 h-9 sm:h-11 px-3 sm:px-6 bg-[#130d19]/90 border-b border-white/[0.08] flex items-center justify-between z-30">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[9px] sm:text-[11px] font-mono text-zinc-400 font-bold ml-1 sm:ml-2">WORKSPACE://CIRCUIT_01</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono text-amber-400 font-bold">
                <Cpu size={12} className="text-amber-400" />
                <span>ESP32-WROOM-32</span>
              </div>
            </div>

            {/* ================= VECTOR HARDWARE & CIRCUIT TRACES ================= */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 600 440"
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
                <radialGradient id="ledBulbGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </radialGradient>
              </defs>

              {/* Wire 1: 5V DC Power Rail (Red) */}
              <path
                d="M 170 160 C 220 160, 270 95, 355 95"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire1Ref}
                d="M 170 160 C 220 160, 270 95, 355 95"
                stroke="#ef4444"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 2: Ground Return Rail (Slate) */}
              <path
                d="M 170 280 C 250 280, 330 380, 480 380 C 530 380, 530 140, 530 95"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire2Ref}
                d="M 170 280 C 250 280, 330 380, 480 380 C 530 380, 530 140, 530 95"
                stroke="#64748b"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 3: Digital GPIO2 Signal to Resistor (Amber) */}
              <path
                d="M 170 220 C 200 220, 220 222, 260 222"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire3Ref}
                d="M 170 220 C 200 220, 220 222, 260 222"
                stroke="#f59e0b"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 4: Resistor to LED Anode (Orange/Gold) */}
              <path
                d="M 340 222 L 420 222"
                stroke="#09060c"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire4Ref}
                d="M 340 222 L 420 222"
                stroke="#f97316"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Wire 5: LED Cathode to GND rail */}
              <path
                d="M 460 242 C 460 380, 480 380, 480 380"
                stroke="#09060c"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                ref={wire5Ref}
                d="M 460 242 C 460 380, 480 380, 480 380"
                stroke="#64748b"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />

              {/* Solder Contact Pads at Terminals */}
              <circle ref={pad1Ref} cx="355" cy="95" r="4.5" fill="#f87171" filter="url(#circuitGlow)" />
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
                  path="M 170 220 C 200 220, 220 222, 260 222"
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
                  path="M 170 160 C 220 160, 270 95, 355 95"
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

              {/* ================= COMPONENT 1: ESP32 MICROCONTROLLER ================= */}
              {/* Alignment Reticle */}
              <rect
                ref={esp32ReticleRef}
                x="35"
                y="85"
                width="140"
                height="230"
                rx="18"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.5"
              />

              <g ref={esp32Ref} id="esp32-mcu" transform="translate(40, 90)">
                {/* PCB Substrate */}
                <rect width="130" height="220" rx="14" fill="#140e1b" stroke="#f59e0b" strokeWidth="1.5" />
                
                {/* Antenna */}
                <rect x="25" y="8" width="80" height="22" rx="4" fill="#2b180d" stroke="#f59e0b" strokeWidth="0.8" opacity="0.8" />
                <text x="65" y="22" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  PCB_ANT
                </text>

                {/* Metal RF Shield */}
                <rect x="15" y="40" width="100" height="75" rx="8" fill="#0d0912" stroke="#d97706" strokeWidth="1" />
                <text x="65" y="75" fill="#fef3c7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  ESP-WROOM-32
                </text>
                <text x="65" y="90" fill="#f59e0b" fontSize="8" fontFamily="monospace" opacity="0.8" textAnchor="middle">
                  WiFi + BT 4.2
                </text>

                {/* Silkscreen Tag */}
                <rect x="20" y="180" width="90" height="20" rx="5" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.4" />
                <text x="65" y="193" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  ESP32 DevKit V1
                </text>

                {/* Right Edge Output Pins */}
                <circle cx="130" cy="70" r="3.5" fill="#ef4444" />
                <text x="122" y="73" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">5V ●</text>

                <circle cx="130" cy="130" r="3.5" fill="#f59e0b" />
                <text x="122" y="133" fill="#fef08a" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">GPIO2 ●</text>

                <circle cx="130" cy="190" r="3.5" fill="#94a3b8" />
                <text x="122" y="193" fill="#cbd5e1" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">GND ●</text>
              </g>

              {/* ================= COMPONENT 2: HC-SR04 ULTRASONIC SENSOR ================= */}
              <g ref={sensorRef} id="sonar-sensor" transform="translate(350, 50)">
                <rect width="185" height="75" rx="14" fill="#171020" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
                
                {/* Transducer Cylinders (T and R) */}
                <circle cx="48" cy="38" r="26" fill="#09060d" stroke="#f59e0b" strokeWidth="1.2" />
                <circle cx="48" cy="38" r="19" fill="#181320" stroke="#78350f" strokeWidth="0.8" />
                <text x="48" y="42" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>

                <circle cx="137" cy="38" r="26" fill="#09060d" stroke="#f59e0b" strokeWidth="1.2" />
                <circle cx="137" cy="38" r="19" fill="#181320" stroke="#78350f" strokeWidth="0.8" />
                <text x="137" y="42" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">R</text>

                {/* Sensor Name */}
                <text x="93" y="34" fill="#fbbf24" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HC-SR04</text>
                <text x="93" y="46" fill="#a1a1aa" fontSize="7" fontFamily="monospace" textAnchor="middle">Sonar 40kHz</text>

                {/* Terminals */}
                <circle cx="5" cy="45" r="3" fill="#ef4444" />
                <circle cx="180" cy="45" r="3" fill="#94a3b8" />
              </g>

              {/* ================= COMPONENT 3: 220Ω CURRENT LIMITING RESISTOR ================= */}
              <g ref={resistorRef} id="resistor-comp" transform="translate(260, 210)">
                {/* Leads */}
                <line x1="0" y1="12" x2="15" y2="12" stroke="#d4d4d8" strokeWidth="2" />
                <line x1="65" y1="12" x2="80" y2="12" stroke="#d4d4d8" strokeWidth="2" />

                {/* Resistor Body */}
                <rect x="15" y="3" width="50" height="18" rx="9" fill="#d4a373" stroke="#78350f" strokeWidth="1" />
                
                {/* Color Bands (Red, Red, Brown, Gold = 220Ω) */}
                <rect x="23" y="3" width="4" height="18" fill="#dc2626" />
                <rect x="31" y="3" width="4" height="18" fill="#dc2626" />
                <rect x="39" y="3" width="4" height="18" fill="#78350f" />
                <rect x="52" y="3" width="4" height="18" fill="#f59e0b" />

                <text x="40" y="32" fill="#fcd34d" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  220Ω
                </text>
              </g>

              {/* ================= COMPONENT 4: 5mm RED LED WITH AMBIENT GLOW ================= */}
              <g ref={ledRef} id="led-emitter" transform="translate(420, 200)">
                {/* Leads */}
                <line x1="0" y1="22" x2="22" y2="22" stroke="#d4d4d8" strokeWidth="2" />
                <line x1="40" y1="42" x2="40" y2="60" stroke="#94a3b8" strokeWidth="2" />

                {/* Ambient Radial Light Halo */}
                <circle
                  ref={ledGlowRef}
                  cx="40"
                  cy="22"
                  r="45"
                  fill="url(#ledBulbGrad)"
                  opacity="0"
                  filter="url(#circuitGlow)"
                />

                {/* LED Bulb Dome */}
                <circle cx="40" cy="22" r="18" fill="url(#ledBulbGrad)" stroke="#f87171" strokeWidth="1.5" />
                <ellipse cx="34" cy="16" rx="5" ry="3" fill="#ffffff" opacity="0.65" />

                <text x="40" y="55" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  LED [ON]
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
                  • 0 Short Circuits
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold shrink-0">
                GPIO2 ➔ LED • 3.3V
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
