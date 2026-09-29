import { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight, AlertCircle, Info } from "lucide-react";

const SUGGESTIONS = [
  "Blink an LED every second on ESP32 GPIO2",
  "Control an LED with a push button on GPIO4",
  "Connect an LED with a 220-ohm resistor to GND",
];

function PromptBar({ onGenerate, isLoading, error, networkWarning }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  };

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    onGenerate(suggestion);
  };

  return (
    <div className="prompt-container rounded-3xl border border-amber-500/25 hover:border-amber-500/45 bg-gradient-to-b from-[#130f18] to-[#0c0910] p-6 sm:p-7 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.08)] backdrop-blur-xl transition-all">
      {/* Box Header for Visual Emphasis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-extrabold">
                AI HARDWARE SYNTHESIZER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">
              Describe your desired circuit or IoT functionality to synthesize schematics &amp; firmware code.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Agent Engine Ready</span>
        </div>
      </div>

      {/* Network Warning Banner if Backend is offline */}
      {networkWarning && (
        <div className="network-warning-banner">
          <Info size={16} className="warning-icon text-amber-400" />
          <span className="warning-text">
            <strong>Demo Resilience Mode:</strong> {networkWarning}
          </span>
        </div>
      )}

      {/* Main Prompt Input Bar */}
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-input-wrapper">
          <Sparkles size={18} className="prompt-icon text-amber-400" />
          <input
            type="text"
            className="prompt-input"
            placeholder="Describe an IoT project (e.g., 'Blink an LED on GPIO2 using ESP32')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          {prompt && !isLoading && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setPrompt("")}
              title="Clear input"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="generate-btn group"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <span className="btn-loading flex items-center gap-2.5">
              <div className="btn-icon-box">
                <Loader2 size={13} className="animate-spin text-amber-400" />
              </div>
              <span>Synthesizing...</span>
            </span>
          ) : (
            <span className="btn-content flex items-center gap-2.5">
              <div className="btn-icon-box">
                <Sparkles size={13} className="text-amber-400" />
              </div>
              <span>Generate Circuit &amp; Code</span>
              <ArrowRight size={13} className="btn-arrow text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="suggestion-chips pt-1">
        <span className="chips-label">Quick Ideas:</span>
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="chip-btn"
            onClick={() => handleChipClick(item)}
            disabled={isLoading}
          >
            <Sparkles size={11} className="chip-sparkle text-amber-400" />
            <span>{item}</span>
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="prompt-error-banner">
          <AlertCircle size={16} className="text-red-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default PromptBar;
