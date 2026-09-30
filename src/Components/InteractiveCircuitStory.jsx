import { useRef, useLayoutEffect, useState, useEffect } from "react";
import "@wokwi/elements";
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
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveCircuitStory({ isDark = true, onLaunchStudio }) {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const workbenchContainerRef = useRef(null);

  // Responsive scale state for the 700x420 artboard
  const [artboardScale, setArtboardScale] = useState(1);

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

  // Pulses and Diagnostic Badges
  const pulseGroupRef = useRef(null);
  const verifiedBadgeRef = useRef(null);
  const terminalHudRef = useRef(null);
  const launchCtaRef = useRef(null);
  const mobileLaunchCtaRef = useRef(null);
  const outgoingConduitRef = useRef(null);

  // Calculate responsive scale for the 700x420 workbench
  useEffect(() => {
    if (!workbenchContainerRef.current) return;

    const handleResize = () => {
      if (!workbenchContainerRef.current) return;
      const { clientWidth, clientHeight } = workbenchContainerRef.current;
      // Logical canvas dimensions: 700w x 420h
      // Subtract header (~40px) and terminal hud (~45px)
      const availW = clientWidth - 20;
      const availH = clientHeight - 88;
      const s = Math.min(availW / 700, availH / 420);
      setArtboardScale(Math.min(Math.max(s, 0.38), 1.25));
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

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Complete static state for accessibility
        gsap.set(
          [
            esp32ContainerRef.current,
            sonarContainerRef.current,
            resistorContainerRef.current,
            ledContainerRef.current,
            ledRadialGlowRef.current,
            pulseGroupRef.current,
            verifiedBadgeRef.current,
            terminalHudRef.current,
            launchCtaRef.current,
            mobileLaunchCtaRef.current,
            outgoingConduitRef.current,
          ],
          { opacity: 1, scale: 1, x: 0, y: 0 }
        );
        gsap.set(
          [wire1Ref.current, wire2Ref.current, wire3Ref.current, wire4Ref.current, wire5Ref.current],
          { strokeDashoffset: 0 }
        );
        gsap.set([progressFillRef.current, mobileProgressFillRef.current], { width: "100%" });
        if (wokwiLedRef.current) wokwiLedRef.current.value = true;
        return;
      }

      // ================= INITIAL DORMANT STATE =================
      gsap.set(esp32ContainerRef.current, { opacity: 0, y: 30, scale: 0.94 });
      gsap.set(esp32ReticleRef.current, { opacity: 0, scale: 1.15 });
      gsap.set(sonarContainerRef.current, { opacity: 0, y: -25, scale: 0.92 });
      gsap.set(resistorContainerRef.current, { opacity: 0, y: 18, scale: 0.88 });
      gsap.set(ledContainerRef.current, { opacity: 0, y: 18, scale: 0.88 });
      gsap.set(ledRadialGlowRef.current, { opacity: 0, scale: 0.4 });

      // Solder pads
      gsap.set([pad1Ref.current, pad2Ref.current, pad3Ref.current, pad4Ref.current, pad5Ref.current], {
        opacity: 0,
        scale: 0,
      });

      // SVG Wires initially un-routed
      const wires = [
        { el: wire1Ref.current, len: 680 },
        { el: wire2Ref.current, len: 650 },
        { el: wire3Ref.current, len: 200 },
        { el: wire4Ref.current, len: 220 },
        { el: wire5Ref.current, len: 480 },
      ];
      wires.forEach(({ el, len }) => {
        if (el) {
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        }
      });

      gsap.set(pulseGroupRef.current, { opacity: 0 });
      gsap.set(verifiedBadgeRef.current, { opacity: 0, scale: 0.85, y: -8 });
      gsap.set(terminalHudRef.current, { opacity: 0.45 });
      gsap.set([launchCtaRef.current, mobileLaunchCtaRef.current], { opacity: 0, y: 10, scale: 0.96 });
      gsap.set(outgoingConduitRef.current, { strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 });

      // Story HUD phase initial emphasis (Desktop)
      gsap.set(phase1Ref.current, { opacity: 1, borderColor: "rgba(245, 158, 11, 0.4)" });
      gsap.set([phase2Ref.current, phase3Ref.current, phase4Ref.current], {
        opacity: 0.35,
        borderColor: "rgba(255, 255, 255, 0.06)",
      });

      // Mobile active phase setup
      gsap.set(mobilePhase1Ref.current, { opacity: 1 });
      gsap.set([mobilePhase2Ref.current, mobilePhase3Ref.current, mobilePhase4Ref.current], {
        opacity: 0,
      });

      gsap.set([progressFillRef.current, mobileProgressFillRef.current], { width: "10%" });

      // ================= MASTER CHOREOGRAPHED SCROLL TIMELINE =================
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTargetRef.current,
          start: "top top",
          end: isMobile ? "+=140%" : "+=220%",
          pin: true,
          scrub: 1.0, // Silky-smooth 1-second spring inertia
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // Dynamically power the official Wokwi LED in Phase 4
            if (wokwiLedRef.current) {
              wokwiLedRef.current.value = progress >= 0.76;
            }
          },
        },
      });

      // ---------- BEAT 1: SILICON CORE INITIALIZATION (Scroll 0% - 25%) ----------
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
        0
      );
      masterTl.to(
        esp32ContainerRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.2)" },
        0.15
      );
      masterTl.to(
        esp32ReticleRef.current,
        { opacity: 0.25, duration: 0.3 },
        0.75
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
      masterTl.to(mobilePhase2Ref.current, { opacity: 1, duration: 0.2 }, 1.15);

      // Sonar sensor docks
      masterTl.to(
        sonarContainerRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.2)" },
        1.0
      );
      // Resistor & LED dock
      masterTl.to(
        [resistorContainerRef.current, ledContainerRef.current],
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "power2.out" },
        1.2
      );
      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "50%", duration: 0.7 },
        1.1
      );

      // ---------- BEAT 3: DYNAMIC DUPONT TRACE ROUTING (Scroll 50% - 75%) ----------
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
      masterTl.to(mobilePhase3Ref.current, { opacity: 1, duration: 0.2 }, 2.15);

      // Wire 1: 5V DC Power Rail (Red) routes to Sensor VCC
      masterTl.to(
        wire1Ref.current,
        { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" },
        2.0
      );
      masterTl.to(
        pad1Ref.current,
        { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 },
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
        { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 },
        2.7
      );

      // Wire 3: GPIO2 Signal (Amber)
      masterTl.to(
        wire3Ref.current,
        { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" },
        2.4
      );
      masterTl.to(
        pad3Ref.current,
        { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 },
        2.85
      );

      // Wire 4 & 5: Resistor to LED & LED return
      masterTl.to(
        [wire4Ref.current, wire5Ref.current],
        { strokeDashoffset: 0, stagger: 0.15, duration: 0.55, ease: "power1.inOut" },
        2.7
      );
      masterTl.to(
        [pad4Ref.current, pad5Ref.current],
        { opacity: 1, scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 },
        3.15
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
        3.3
      );
      masterTl.to(
        phase4Ref.current,
        { opacity: 1, borderColor: "rgba(16, 185, 129, 0.6)", duration: 0.3 },
        3.3
      );

      masterTl.to(mobilePhase3Ref.current, { opacity: 0, duration: 0.2 }, 3.3);
      masterTl.to(mobilePhase4Ref.current, { opacity: 1, duration: 0.2 }, 3.45);

      // Current pulse nodes ignite
      masterTl.to(
        pulseGroupRef.current,
        { opacity: 1, duration: 0.25 },
        3.35
      );

      // LED Ignites into radiant emission bloom
      masterTl.to(
        ledRadialGlowRef.current,
        { opacity: 0.85, scale: 1.2, duration: 0.5, ease: "power2.out" },
        3.45
      );

      // Terminal HUD transitions to full verified brightness
      masterTl.to(
        terminalHudRef.current,
        { opacity: 1, duration: 0.35 },
        3.5
      );

      // Verification Badge
      masterTl.to(
        verifiedBadgeRef.current,
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" },
        3.6
      );

      // Launch Studio CTA unlocks
      masterTl.to(
        [launchCtaRef.current, mobileLaunchCtaRef.current],
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
        3.7
      );

      // Outgoing energy conduit feeds downward
      masterTl.to(
        outgoingConduitRef.current,
        { strokeDashoffset: 0, opacity: 1, duration: 0.5, ease: "power1.inOut" },
        3.8
      );

      masterTl.to(
        [progressFillRef.current, mobileProgressFillRef.current],
        { width: "100%", duration: 0.5 },
        3.6
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="w-full min-h-[520px] lg:min-h-screen flex items-center justify-center py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-12 bg-[#070509] border-t border-white/[0.08]"
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
                WOKWI REAL HARDWARE
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

              {/* Dynamic Active Step Cards (CSS Grid overlay for smooth zero-jank transitions) */}
              <div className="relative min-h-[56px] rounded-xl border border-amber-500/30 bg-[#120d18]/95 p-2.5 shadow-lg grid grid-cols-1 grid-rows-1">
                <div ref={mobilePhase1Ref} className="col-start-1 row-start-1 space-y-0.5 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">01</span>
                    <span>ESP32-WROOM-32 Placed</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Dual Xtensa LX6 SoC with gold header pins &amp; RF shield seated.
                  </p>
                </div>

                <div ref={mobilePhase2Ref} className="col-start-1 row-start-1 space-y-0.5 transition-opacity duration-300 pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px]">02</span>
                    <span>HC-SR04 &amp; 220Ω Load Mounted</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Acoustic sonar cans, axial resistor &amp; ruby LED locked into grid.
                  </p>
                </div>

                <div ref={mobilePhase3Ref} className="col-start-1 row-start-1 space-y-0.5 transition-opacity duration-300 pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-outfit">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px]">03</span>
                    <span>Dupont Jumper Wires Etched</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Physical copper jumpers routed with black terminal boots.
                  </p>
                </div>

                <div ref={mobilePhase4Ref} className="col-start-1 row-start-1 space-y-0.5 transition-opacity duration-300 pointer-events-none">
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

          {/* ================= DESKTOP STORY HUD & CHOREOGRAPHY (Left Column) ================= */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-3.5 xl:space-y-4.5 z-20">
            {/* Tagline Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Scene 02 // Circuit Synthesis</span>
              </span>
              <span className="text-xs font-mono text-zinc-400">
                WOKWI REAL HARDWARE
              </span>
            </div>

            {/* Narrative Headline */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black font-outfit text-white tracking-tight leading-tight">
                Watch Your Circuit{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 font-handwriting text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-normal block mt-0.5">
                  Build Itself.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-md">
                Scroll down to assemble authentic physical hardware, route real Dupont jumpers, and synthesize Arduino firmware in real-time.
              </p>
            </div>

            {/* Linear Phase Progress Track */}
            <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden my-0.5">
              <div
                ref={progressFillRef}
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full transition-all duration-100 ease-out"
                style={{ width: "10%" }}
              />
            </div>

            {/* 4 Sequential Choreography Beat Cards */}
            <div className="space-y-2">
              {/* Phase 1 */}
              <div
                ref={phase1Ref}
                className="p-2.5 sm:p-3 rounded-xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono text-xs font-bold shrink-0">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">ESP32-WROOM-32 Placed</h4>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">DevKit V1</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Obsidian PCB with brushed RF shield, MIFA antenna &amp; gold pin headers.</p>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div
                ref={phase2Ref}
                className="p-2.5 sm:p-3 rounded-xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-mono text-xs font-bold shrink-0">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">Peripherals Mounted</h4>
                      <span className="text-[10px] font-mono text-orange-400 font-semibold">Sonar + Resistor + LED</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Aluminum acoustic transducers, ceramic 220Ω resistor &amp; ruby LED placed.</p>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div
                ref={phase3Ref}
                className="p-2.5 sm:p-3 rounded-xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-mono text-xs font-bold shrink-0">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">Physical Dupont Wires Routed</h4>
                      <span className="text-[10px] font-mono text-red-400 font-semibold">4 Nets • 0 Short Circuits</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Colored jumper leads with crimp boots auto-route to pinout coordinates.</p>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div
                ref={phase4Ref}
                className="p-2.5 sm:p-3 rounded-xl border bg-[#100b16]/90 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                    04
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">Live Current &amp; Firmware Verified</h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">3.3V Rails Active</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Electrons flow, LED filament illuminates, C++ firmware compiles 100% OK.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Launch CTA */}
            <div ref={launchCtaRef} className="pt-0.5">
              <button
                type="button"
                onClick={onLaunchStudio}
                className="group relative inline-flex flex-col items-start cursor-pointer hover:scale-[1.03] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5 text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-200 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>Open This Live Circuit in Blinky Studio</span>
                  <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
                </div>
                {/* Organic brush stroke underline */}
                <svg className="w-full h-2.5 -mt-0.5 overflow-visible" viewBox="0 0 160 10" fill="none">
                  <path d="M2 6 C40 2, 95 8, 158 5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ================= ULTRA-REALISTIC WOKWI ELECTRONICS WORKBENCH CANVAS ================= */}
          <div
            ref={workbenchContainerRef}
            className="w-full lg:col-span-7 relative h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] xl:h-[490px] rounded-2xl sm:rounded-3xl bg-[#09070c] border border-amber-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.08),0_0_40px_rgba(245,158,11,0.12)] overflow-hidden flex flex-col"
          >
            {/* Top Workspace Header Bar */}
            <div className="h-9 sm:h-11 px-3 sm:px-6 bg-[#130d19]/90 border-b border-white/[0.08] flex items-center justify-between z-30 backdrop-blur-md shrink-0">
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

                {/* Subtle Silkscreen Blueprint Coordinate Grid Lines */}
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
                    <filter id="circuitGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="wireDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
                    </filter>
                  </defs>

                  {/* ---------------- WIRE 1: 5V DC POWER RAIL (RED) ---------------- */}
                  {/* Connects ESP32 VIN (60, 268.5) -> HC-SR04 VCC (441.3, 139.5) via top channel */}
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
                    filter="url(#wireDropShadow)"
                  />

                  {/* ---------------- WIRE 2: GROUND BUS (DARK SLATE) ---------------- */}
                  {/* Connects ESP32 GND (60, 259) -> HC-SR04 GND (471.3, 139.5) via upper channel */}
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
                    filter="url(#wireDropShadow)"
                  />

                  {/* ---------------- WIRE 3: GPIO2 DIGITAL SIGNAL (WARM AMBER) ---------------- */}
                  {/* Connects ESP32 GPIO2 (164, 240.4) -> Resistor Pin 1 (262, 257) */}
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
                    filter="url(#wireDropShadow)"
                  />

                  {/* ---------------- WIRE 4: RESISTOR TO LED ANODE (VIVID ORANGE) ---------------- */}
                  {/* Connects Resistor Pin 2 (317, 257) -> LED Anode (465, 274) */}
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
                    filter="url(#wireDropShadow)"
                  />

                  {/* ---------------- WIRE 5: LED CATHODE GROUND RETURN (SLATE) ---------------- */}
                  {/* Connects LED Cathode (455, 274) -> Curves down into lower bus -> ESP32 right GND (164, 259) */}
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
                    filter="url(#wireDropShadow)"
                  />

                  {/* ---------------- BLACK DUPONT TERMINAL CONNECTOR BOOTS ---------------- */}
                  {/* At ESP32 Left Pins */}
                  <rect x="54" y="263" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                  <rect x="54" y="253.5" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                  
                  {/* At ESP32 Right Pins */}
                  <rect x="158" y="235" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                  <rect x="158" y="253.5" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />

                  {/* At Sonar Bottom Pins */}
                  <rect x="437.3" y="134" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                  <rect x="467.3" y="134" width="8" height="11" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />

                  {/* ---------------- SOLDER TERMINAL EYELET PINS ---------------- */}
                  <circle ref={pad1Ref} cx="441.3" cy="139.5" r="4.5" fill="#f87171" filter="url(#circuitGlow)" />
                  <circle ref={pad2Ref} cx="471.3" cy="139.5" r="4.5" fill="#94a3b8" filter="url(#circuitGlow)" />
                  <circle ref={pad3Ref} cx="262" cy="257" r="4.5" fill="#fbbf24" filter="url(#circuitGlow)" />
                  <circle ref={pad4Ref} cx="465" cy="274" r="4.5" fill="#fb923c" filter="url(#circuitGlow)" />
                  <circle ref={pad5Ref} cx="455" cy="274" r="4.5" fill="#94a3b8" filter="url(#circuitGlow)" />

                  {/* ---------------- PHASE 4: ANIMATED ELECTRON CURRENT FLOW PHOTONS ---------------- */}
                  <g ref={pulseGroupRef}>
                    {/* Photon 1: GPIO2 -> Resistor */}
                    <circle r="4" fill="#fef08a" filter="url(#circuitGlow)">
                      <animateMotion
                        path="M 164 240.4 C 195 240.4, 225 257, 262 257"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Photon 2: Resistor -> LED Anode */}
                    <circle r="4" fill="#fef08a" filter="url(#circuitGlow)">
                      <animateMotion
                        path="M 317 257 C 365 257, 415 274, 465 274"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Photon 3: 5V Power -> Sonar */}
                    <circle r="4" fill="#fca5a5" filter="url(#circuitGlow)">
                      <animateMotion
                        path="M 60 268.5 C 20 268.5, 20 72, 175 72 C 290 72, 390 72, 441.3 139.5"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Photon 4: LED Cathode -> Ground return loop */}
                    <circle r="3.5" fill="#93c5fd" filter="url(#circuitGlow)">
                      <animateMotion
                        path="M 455 274 C 455 350, 250 350, 164 259"
                        dur="1.3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Outgoing Conduit Path (Flows out of canvas downward into Section 2) */}
                  <path
                    ref={outgoingConduitRef}
                    d="M 455 350 L 455 420"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#circuitGlow)"
                  />
                </svg>

                {/* ================= AUTHENTIC @wokwi/elements HARDWARE COMPONENTS LAYER ================= */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  
                  {/* ---------------- 1. ESP32 DEVKIT V1 ---------------- */}
                  {/* Footprint Reticle */}
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
                    
                    {/* Silkscreen Brand Chip */}
                    <div className="mt-1.5 px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-300 tracking-wider shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ESP32 DEVKIT V1</span>
                    </div>

                    {/* Pin Label Callouts */}
                    <span className="absolute -left-7 top-[154px] text-[8px] font-mono font-bold text-red-400 bg-black/70 px-1 rounded">5V</span>
                    <span className="absolute -left-9 top-[144px] text-[8px] font-mono font-bold text-zinc-400 bg-black/70 px-1 rounded">GND</span>
                    <span className="absolute -right-11 top-[125px] text-[8px] font-mono font-bold text-amber-300 bg-black/70 px-1 rounded">GPIO2</span>
                    <span className="absolute -right-9 top-[144px] text-[8px] font-mono font-bold text-zinc-400 bg-black/70 px-1 rounded">GND</span>
                  </div>

                  {/* ---------------- 2. HC-SR04 ULTRASONIC SENSOR ---------------- */}
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

                    {/* Silkscreen Pin Indicators at Sensor Pins */}
                    <div className="absolute -bottom-4 flex items-center gap-2 text-[8px] font-mono font-bold">
                      <span className="text-red-400">VCC</span>
                      <span className="text-zinc-500">TRIG</span>
                      <span className="text-zinc-500">ECHO</span>
                      <span className="text-zinc-400">GND</span>
                    </div>
                  </div>

                  {/* ---------------- 3. 220Ω CERAMIC RESISTOR ---------------- */}
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

                  {/* ---------------- 4. 5mm RED DIFFUSED LED ---------------- */}
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
                    {/* Ambient Radiant Glow Beam */}
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

                    {/* Component Label */}
                    <span className="absolute -bottom-4 text-[8px] font-mono font-bold text-red-300 bg-black/75 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">
                      5mm RED LED
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Diagnostic HUD (Inside Canvas) */}
            <div
              ref={terminalHudRef}
              className="h-10 sm:h-12 px-3 sm:px-6 bg-[#130d19]/95 border-t border-amber-500/30 flex items-center justify-between gap-2 z-30 backdrop-blur-md shrink-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
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
              className="absolute top-12 sm:top-14 right-3 sm:right-6 px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] z-30"
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
