import { useState, useEffect, useRef } from "react";

export default function LivingCircuitLayer({ isDark = true }) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Subtle floating offset based on scroll
  const probeOffset = Math.sin(scrollY * 0.005) * 8;
  const crawlerPos = Math.min(100, Math.max(0, (scrollY * 0.1) % 120));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15 select-none" aria-hidden="true">
      {/* =========================================================================
          1. CIRCUIT CREATURE: "AeroProbe" (Airborne Micro Sensor Drone)
          Hovering in the upper-right open region of the Hero.
          On mobile: smaller and positioned neatly away from text.
          ========================================================================= */}
      <div
        className="absolute transition-transform duration-700 ease-out"
        style={{
          top: isMobile ? "8%" : "14%",
          right: isMobile ? "4%" : "12%",
          transform: `translateY(${probeOffset}px)`,
          opacity: isDark ? 0.85 : 0.6,
        }}
      >
        <svg
          width={isMobile ? "32" : "44"}
          height={isMobile ? "32" : "44"}
          viewBox="0 0 44 44"
          fill="none"
          className="overflow-visible drop-shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
        >
          <defs>
            <filter id="heroProbeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="probeWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Micro Sensor Antennae Prongs */}
          <path
            d="M17 9 L13 2.5 M25 9 L29 2.5"
            stroke="#d97706"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="13" cy="2.5" r="1.3" fill="#fbbf24" />
          <circle cx="29" cy="2.5" r="1.3" fill="#fbbf24" />

          {/* Left and Right Micro Stabilizer Wings */}
          <path
            d="M7 16 L2 13 L2 21 L7 18 Z"
            fill="url(#probeWingGrad)"
            stroke="#b45309"
            strokeWidth="0.8"
          />
          <path
            d="M35 16 L40 13 L40 21 L35 18 Z"
            fill="url(#probeWingGrad)"
            stroke="#b45309"
            strokeWidth="0.8"
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

          {/* Center Illuminated Optical Eye (LED) */}
          <circle
            cx="21"
            cy="18.5"
            r="3.2"
            fill="#f59e0b"
            filter="url(#heroProbeGlow)"
          />
          <circle cx="21" cy="18.5" r="1.2" fill="#fffbeb" />
        </svg>
      </div>

      {/* =========================================================================
          2. CIRCUIT CREATURE: "TraceCrawler" (Desktop only, walks on trace)
          Hidden on mobile so it never interferes with mobile viewport width.
          ========================================================================= */}
      {!isMobile && (
        <div className="absolute right-[22%] bottom-[16%] hidden lg:block opacity-70">
          {/* Hairline PCB Copper Bus Route on which crawler walks */}
          <svg
            width="140"
            height="24"
            viewBox="0 0 140 24"
            fill="none"
            className="overflow-visible"
          >
            <path
              d="M 0 12 H 140"
              stroke="#f59e0b"
              strokeWidth="0.8"
              strokeDasharray="4 3"
              opacity="0.3"
            />
            <circle cx="0" cy="12" r="2" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="140" cy="12" r="2" fill="#140f1a" stroke="#d97706" strokeWidth="0.8" />

            {/* The Crawler Bug */}
            <g transform={`translate(${crawlerPos}, 0)`}>
              {/* SMD Insect Legs */}
              <path
                d="M7 5 L2 3 M7 12 L1 12 M7 19 L2 21 M27 5 L32 3 M27 12 L33 12 M27 19 L32 21"
                stroke="#b45309"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              {/* IC Body */}
              <rect x="7" y="6" width="20" height="12" rx="2.5" fill="#130d1a" stroke="#451a03" strokeWidth="1" />
              <rect x="8.5" y="7.5" width="17" height="9" rx="1.5" fill="#09060d" />
              {/* Silkscreen text */}
              <text x="17" y="13.5" fill="#92400e" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                BLNK
              </text>
              {/* Dual forward eyes */}
              <circle cx="25.5" cy="9.5" r="1.6" fill="#f59e0b" filter="url(#heroProbeGlow)" />
              <circle cx="25.5" cy="14.5" r="1.6" fill="#f59e0b" filter="url(#heroProbeGlow)" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
