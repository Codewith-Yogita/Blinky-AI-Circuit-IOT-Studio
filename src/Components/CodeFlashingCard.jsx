import { useState } from "react";
import { Zap, Play, Code2, X, Maximize2, Minimize2, Radio, Terminal, Cpu } from "lucide-react";
import HardwarePanel from "./HardwarePanel";

/**
 * Dedicated, standalone Code Flashing Component.
 * Only rendered when the user requests flashing / hardware upload from the AI.
 */
export default function CodeFlashingCard({
  code,
  circuit,
  onClose,
  onOpenCircuit,
  onOpenCode,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!code) return null;

  const boardModel = circuit?.board?.model || "ESP32 DevKit V1";

  return (
    <div
      className={`rounded-3xl bg-[#140b0f]/95 border border-orange-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(249,115,22,0.15)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        isExpanded ? "fixed inset-4 sm:inset-8 z-50 flex flex-col" : "w-full my-6"
      }`}
    >
      {/* Component Header Bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#1e0f16]/90 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Identity Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]">
            <Zap size={16} className="fill-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold font-outfit text-white tracking-wide">
                Hardware Flasher & Serial Monitor
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                WebSerial Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Direct USB browser-to-chip connection • 115200 Baud rate
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenCircuit && (
            <button
              type="button"
              onClick={onOpenCircuit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Show Circuit Simulation"
            >
              <Play size={12} className="fill-amber-400 text-amber-400" />
              <span>Show Circuit</span>
            </button>
          )}

          {onOpenCode && (
            <button
              type="button"
              onClick={onOpenCode}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="View Arduino Code"
            >
              <Code2 size={13} className="text-cyan-400" />
              <span>Show Code</span>
            </button>
          )}

          {/* Expand / Minimize Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer"
            title={isExpanded ? "Collapse view" : "Expand to fullscreen"}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Close Component Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer"
              title="Close Hardware Flasher"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Component Content Body */}
      <div className={`p-3 sm:p-5 ${isExpanded ? "flex-1 overflow-auto" : ""}`}>
        <HardwarePanel code={code} />
      </div>
    </div>
  );
}
