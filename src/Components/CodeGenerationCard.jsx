import { useState } from "react";
import { Code2, Play, Zap, X, Maximize2, Minimize2, Copy, Check, Download, FileCode } from "lucide-react";
import CodePanel from "./CodePanel";

/**
 * Dedicated, standalone Code Generation Component.
 * Only rendered when the user requests code / firmware from the AI.
 */
export default function CodeGenerationCard({
  code,
  circuit,
  boardModel = "ESP32 DevKit V1",
  onClose,
  onOpenCircuit,
  onOpenFlash,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  const handleDownloadIno = () => {
    const filename = `${(circuit?.id || "blinky_sketch").replace(/\s+/g, "_")}.ino`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-3xl bg-[#0b0f19]/95 border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.12)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        isExpanded ? "fixed inset-4 sm:inset-8 z-50 flex flex-col" : "w-full my-6"
      }`}
    >
      {/* Component Header Bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#101726]/90 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Identity Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Code2 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold font-outfit text-white tracking-wide">
                Arduino C++ Firmware
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                {boardModel}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Ready-to-flash non-blocking code • .ino sketch format
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Copy */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all cursor-pointer"
            title="Copy Arduino code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          {/* Download .ino */}
          <button
            type="button"
            onClick={handleDownloadIno}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Download .ino file"
          >
            <Download size={13} />
            <span>Download .ino</span>
          </button>

          {onOpenCircuit && (
            <button
              type="button"
              onClick={onOpenCircuit}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Show Circuit Simulation"
            >
              <Play size={12} className="fill-amber-400 text-amber-400" />
              <span>Show Circuit</span>
            </button>
          )}

          {onOpenFlash && (
            <button
              type="button"
              onClick={onOpenFlash}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
              title="Flash firmware to ESP32"
            >
              <Zap size={13} className="fill-white" />
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
              title="Close Code View"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Component Content Body */}
      <div className={`p-3 sm:p-5 ${isExpanded ? "flex-1 overflow-auto" : ""}`}>
        <CodePanel
          code={code}
          boardModel={boardModel}
          circuit={circuit}
        />
      </div>
    </div>
  );
}
