import { useState, useEffect, useRef } from "react";

/**
 * LivingCircuitLayer
 * 
 * Subtle, aesthetic electronic micro-creatures for the Blinky hero section.
 * - Miniature autonomous PCB organisms with amber/orange glow
 * - Gentle, organic 60fps floating & crawling motions
 * - Subtle cursor awareness (looking toward mouse, slight 6-8px movement, brighter LED)
 * - Complete non-interference (pointer-events: none, z-index between bg and content)
 * - Respects prefers-reduced-motion
 */
export default function LivingCircuitLayer({ isDark = true }) {
  const containerRef = useRef(null);
  const heroCreatureRef = useRef(null);
  const crawlerCreatureRef = useRef(null);

  // Hero creature subtle cursor reaction state
  const [heroReaction, setHeroReaction] = useState({
    x: 0,
    y: 0,
    rotate: 0,
    isAware: false,
  });

  // Crawler creature subtle cursor reaction state
  const [crawlerReaction, setCrawlerReaction] = useState({
    x: 0,
    y: 0,
    rotate: 0,
    isAware: false,
  });

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Cursor position relative to hero viewport
        const cursorX = e.clientX;
        const cursorY = e.clientY;

        // 1. Hero Creature Reaction Calculation
        if (heroCreatureRef.current) {
          const cRect = heroCreatureRef.current.getBoundingClientRect();
          const centerX = cRect.left + cRect.width / 2;
          const centerY = cRect.top + cRect.height / 2;

          const dx = cursorX - centerX;
          const dy = cursorY - centerY;
          const dist = Math.hypot(dx, dy);

          // Proximity threshold ~220px
          if (dist < 220 && dist > 1) {
            const influence = Math.max(0, 1 - dist / 220);
            const moveAmt = influence * 7.5; // Max 7.5px movement
            const angleRad = Math.atan2(dy, dx);
            const rawDeg = (angleRad * 180) / Math.PI;

            // Clamped subtle gaze tilt (-14deg to +14deg)
            let tilt = rawDeg > 90 || rawDeg < -90 ? -10 * influence : 10 * influence;

            setHeroReaction({
              x: Math.cos(angleRad) * moveAmt,
              y: Math.sin(angleRad) * moveAmt,
              rotate: tilt,
              isAware: true,
            });
          } else {
            setHeroReaction((prev) => (prev.isAware ? { x: 0, y: 0, rotate: 0, isAware: false } : prev));
          }
        }

        // 2. Crawler Creature Reaction Calculation
        if (crawlerCreatureRef.current) {
          const cRect = crawlerCreatureRef.current.getBoundingClientRect();
          const centerX = cRect.left + cRect.width / 2;
          const centerY = cRect.top + cRect.height / 2;

          const dx = cursorX - centerX;
          const dy = cursorY - centerY;
          const dist = Math.hypot(dx, dy);

          // Proximity threshold ~160px
          if (dist < 160 && dist > 1) {
            const influence = Math.max(0, 1 - dist / 160);
            const moveAmt = influence * 4.5; // Max 4.5px nudge
            const angleRad = Math.atan2(dy, dx);
            const tilt = dy < 0 ? -8 * influence : 6 * influence;

            setCrawlerReaction({
              x: Math.cos(angleRad) * moveAmt,
              y: Math.sin(angleRad) * moveAmt,
              rotate: tilt,
              isAware: true,
            });
          } else {
            setCrawlerReaction((prev) => (prev.isAware ? { x: 0, y: 0, rotate: 0, isAware: false } : prev));
          }
        }
      });
    };

    const handleMouseLeave = () => {
      setHeroReaction({ x: 0, y: 0, rotate: 0, isAware: false });
      setCrawlerReaction({ x: 0, y: 0, rotate: 0, isAware: false });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-[5] overflow-hidden"
    >
      {/* =========================================================================
          1. HERO CREATURE: "VoltProbe"
          Placed in the open right-hand area of the hero section, away from headline & CTA.
          Gently floats up and down with an amber eye that breathes and blinks.
          ========================================================================= */}
      <div
        ref={heroCreatureRef}
        className="absolute hidden sm:block right-[10%] md:right-[15%] lg:right-[18%] top-[24%] sm:top-[26%] lg:top-[28%]"
        style={{
          transform: `translate(${heroReaction.x}px, ${heroReaction.y}px) rotate(${heroReaction.rotate}deg)`,
          transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="living-hero-probe-float relative">
          <svg
            width="42"
            height="34"
            viewBox="0 0 42 34"
            fill="none"
            className="overflow-visible drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
          >
            <defs>
              <filter id="heroProbeGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="probeWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1424" />
                <stop offset="100%" stopColor="#0c0811" />
              </linearGradient>
            </defs>

            {/* Subtle anti-gravity propulsion aura */}
            <ellipse
              cx="21"
              cy="28"
              rx="6.5"
              ry="2"
              fill="#f59e0b"
              className={heroReaction.isAware ? "opacity-60 scale-125" : "opacity-30"}
              style={{ transition: "all 0.6s ease" }}
              filter="url(#heroProbeGlow)"
            />

            {/* Micro Sensor Antennae Prongs */}
            <path
              d="M17 9 L13 2.5 M25 9 L29 2.5"
              stroke="#d97706"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <circle cx="13" cy="2.5" r="1.3" fill="#fbbf24" />
            <circle cx="29" cy="2.5" r="1.3" fill="#fbbf24" />

            {/* Left and Right Micro PCB Stabilizer Wings */}
            <path
              d="M7 16 L2 13 L2 21 L7 18 Z"
              fill="url(#probeWingGrad)"
              stroke="#b45309"
              strokeWidth="0.8"
              opacity="0.9"
            />
            <path
              d="M35 16 L40 13 L40 21 L35 18 Z"
              fill="url(#probeWingGrad)"
              stroke="#b45309"
              strokeWidth="0.8"
              opacity="0.9"
            />

            {/* Main Chassis: Matte Obsidian Hexagonal Micro-Core */}
            <polygon
              points="21,7 32,13.5 32,23.5 21,29 10,23.5 10,13.5"
              fill="#130d1a"
              stroke="#451a03"
              strokeWidth="1.2"
            />
            <polygon
              points="21,9.5 29.5,14.5 29.5,22.5 21,27 12.5,22.5 12.5,14.5"
              fill="#0a060e"
              stroke="#f59e0b"
              strokeWidth="0.6"
              strokeDasharray="2.5 1.5"
              opacity="0.8"
            />

            {/* Copper PCB Silkscreen Bus Traces */}
            <path
              d="M15 18.5 L19 18.5 M23 18.5 L27 18.5 M21 11.5 L21 15.5"
              stroke="#92400e"
              strokeWidth="0.75"
              strokeLinecap="round"
            />

            {/* Center Illuminated Optical Eye (LED) */}
            <circle
              cx="21"
              cy="18.5"
              r={heroReaction.isAware ? "3.8" : "3.1"}
              fill="#f59e0b"
              filter="url(#heroProbeGlow)"
              className="living-probe-eye"
              style={{ transition: "r 0.4s ease" }}
            />
            <circle cx="21" cy="18.5" r="1.5" fill="#fffbeb" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          2. CIRCUIT CREATURE: "TraceCrawler"
          Positioned around the lower hero region above the Architecture transition.
          Crawls along an ultra-faint copper PCB trace line, pauses, and blinks.
          ========================================================================= */}
      <div className="absolute hidden md:block right-[24%] lg:right-[30%] bottom-[13%] sm:bottom-[15%]">
        {/* Subtle Hairline PCB Copper Bus Route on which the crawler walks */}
        <svg
          width="180"
          height="32"
          viewBox="0 0 180 32"
          fill="none"
          className="absolute -top-3 -left-12 overflow-visible opacity-25"
        >
          <path
            d="M 0 16 H 140 L 160 2 M 140 16 L 160 30"
            stroke="#f59e0b"
            strokeWidth="0.7"
            strokeDasharray="4 3"
          />
          {/* Solder junction pad vias */}
          <circle cx="0" cy="16" r="2" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="140" cy="16" r="2" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="160" cy="2" r="1.6" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="160" cy="30" r="1.6" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />
        </svg>

        {/* The Crawler Bug */}
        <div
          ref={crawlerCreatureRef}
          className="living-crawler-patrol relative"
          style={{
            transform: `translate(${crawlerReaction.x}px, ${crawlerReaction.y}px) rotate(${crawlerReaction.rotate}deg)`,
            transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <svg
            width="36"
            height="24"
            viewBox="0 0 36 24"
            fill="none"
            className="overflow-visible drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          >
            <defs>
              <filter id="crawlerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 6 SMD Metallic Pin Leads / Insect Legs */}
            <path
              d="M7 6.5 L2.5 4.5 M7 12 L1.5 12 M7 17.5 L2.5 19.5 M29 6.5 L33.5 4.5 M29 12 L34.5 12 M29 17.5 L33.5 19.5"
              stroke="#b45309"
              strokeWidth="1.1"
              strokeLinecap="round"
            />

            {/* IC Package Body (Matte Obsidian SMD Microcontroller) */}
            <rect
              x="7"
              y="6"
              width="22"
              height="12"
              rx="2.5"
              fill="#130d1a"
              stroke="#451a03"
              strokeWidth="1"
            />
            <rect x="8.5" y="7.5" width="19" height="9" rx="1.5" fill="#09060d" />

            {/* Pin 1 orientation index dot */}
            <circle cx="11" cy="9.5" r="0.85" fill="#78350f" />

            {/* Micro laser-engraved silkscreen */}
            <text
              x="18"
              y="13"
              fill="#92400e"
              fontSize="4.8"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              letterSpacing="0.2"
            >
              BLNK
            </text>

            {/* Dual Forward Optical Sensor Eyes */}
            <circle
              cx="27.5"
              cy="9.5"
              r={crawlerReaction.isAware ? "2.1" : "1.6"}
              fill="#f59e0b"
              filter="url(#crawlerGlow)"
              className="living-crawler-eye"
              style={{ transition: "r 0.3s ease" }}
            />
            <circle cx="27.5" cy="9.5" r="0.75" fill="#fffbeb" />

            <circle
              cx="27.5"
              cy="14.5"
              r={crawlerReaction.isAware ? "2.1" : "1.6"}
              fill="#f59e0b"
              filter="url(#crawlerGlow)"
              className="living-crawler-eye"
              style={{ transition: "r 0.3s ease" }}
            />
            <circle cx="27.5" cy="14.5" r="0.75" fill="#fffbeb" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          3. OPTIONAL ELECTRON SIGNAL PARTICLE
          An electrical impulse travelling silently along a diagonal circuit trace.
          Super subtle, looks like genuine voltage propagating in copper.
          ========================================================================= */}
      <div className="absolute hidden lg:block right-[6%] md:right-[9%] top-[38%] opacity-35">
        <svg width="140" height="90" viewBox="0 0 140 90" fill="none" className="overflow-visible">
          {/* Hairline circuit track */}
          <path
            d="M 10 10 L 60 10 L 100 50 L 130 50"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            opacity="0.35"
          />
          <circle cx="10" cy="10" r="1.8" fill="#130d1a" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="130" cy="50" r="1.8" fill="#130d1a" stroke="#d97706" strokeWidth="0.8" />

          {/* Gliding Electron Light Pulse */}
          <circle r="2.2" fill="#fbbf24" filter="url(#heroProbeGlow)">
            <animateMotion
              path="M 10 10 L 60 10 L 100 50 L 130 50"
              dur="6.5s"
              repeatCount="indefinite"
              keyTimes="0; 0.15; 0.55; 0.85; 1"
              keyPoints="0; 0.35; 0.75; 1; 1"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}
