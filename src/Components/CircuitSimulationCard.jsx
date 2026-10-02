import { useState } from "react";
import { Play, Code2, Zap, X, Maximize2, Minimize2, Check, Sparkles, Layers } from "lucide-react";
import CircuitDiagram from "./circuitDiagram";

/**
 * Dedicated, standalone Circuit Simulation Component.
 * Only rendered when the user requests circuit / simulation from the AI.
 */
export default function CircuitSimulationCard({
  circuit,
  onClose,
  onOpenCode,
  onOpenFlash,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!circuit) return null;

  const componentCount = circuit.components?.length || 0;
  const connectionCount = circuit.connections?.length || 0;
  const boardModel = circuit.board?.model || "ESP32 DevKit V1";

  return (
    <div
      className={`rounded-3xl bg-[#0e0b16]/95 border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.12)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        isExpanded ? "fixed inset-4 sm:inset-8 z-50 flex flex-col" : "w-full my-6"
      }`}
    >
      {/* Component Header Bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#140f20]/90 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Identity Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Play size={15} className="fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold font-outfit text-white tracking-wide">
                Circuit Simulation & Blueprint
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                Wokwi Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {circuit.title || "Custom ESP32 Schematic"} • {componentCount} Components • {connectionCount} Wires
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenCode && (
            <button
              type="button"
              onClick={onOpenCode}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Switch to Arduino C++ code"
            >
              <Code2 size={13} className="text-cyan-400" />
              <span>Show Code</span>
            </button>
          )}

          {onOpenFlash && (
            <button
              type="button"
              onClick={onOpenFlash}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Flash firmware to ESP32"
            >
              <Zap size={13} className="text-orange-400 fill-orange-400" />
              <span>Flash ESP32</span>
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
              title="Close Circuit Simulation"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Component Content Body */}
      <div className={`p-3 sm:p-5 ${isExpanded ? "flex-1 overflow-auto" : ""}`}>
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-black/50 shadow-inner">
          <CircuitDiagram circuit={circuit} />
        </div>
      </div>
    </div>
  );
}
