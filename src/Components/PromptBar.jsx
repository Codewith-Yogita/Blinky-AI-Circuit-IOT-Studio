import { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight, AlertCircle, Info, Menu } from "lucide-react";

const SUGGESTIONS = {
  all: [
    "Blink an LED every second on ESP32 GPIO2",
    "Control an LED with a push button on GPIO4",
    "Connect an LED with a 220-ohm resistor to GND",
  ],
  iot: [
    "ESP32 Ultrasonic Distance Alarm with Buzzer & 4-Level LEDs",
    "Dual-Axis Analog Joystick Servo Motor Controller with ESP32",
    "PIR Motion Sensor Night Light with LDR Auto-Dimming",
  ],
  firmware: [
    "Arduino FreeRTOS Multi-Tasking Blink & Serial Telemetry",
    "ESP32 Wi-Fi HTTP Post Sensor Telemetry to REST Cloud",
    "Hardware Timer Interrupt Debounced Pushbutton Handler",
  ],
};

function PromptBar({ onGenerate, isLoading, error, networkWarning }) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  };

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    onGenerate(suggestion);
  };

  const currentSuggestions = SUGGESTIONS[activeTab] || SUGGESTIONS.all;

  return (
    <div className="clay-prompt-wrapper relative w-full rounded-[36px] bg-gradient-to-b from-[#18111f] via-[#120c18] to-[#0a070e] border border-amber-500/30 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.08),0_0_35px_rgba(245,158,11,0.08)] backdrop-blur-2xl transition-all">
      {/* Top Mini-Navigation Bar matching Image 2 */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
        <div className="flex items-center gap-5 sm:gap-7">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`relative pb-1.5 text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
              activeTab === "all" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>All Circuits</span>
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("iot")}
            className={`relative pb-1.5 text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
              activeTab === "iot" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>IoT Schematics</span>
            {activeTab === "iot" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("firmware")}
            className={`relative pb-1.5 text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
              activeTab === "firmware" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Firmware C++</span>
            {activeTab === "firmware" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Agent Engine Ready</span>
            <span className="sm:hidden">Ready</span>
          </div>
          <div
            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="IoT Synthesis Options"
          >
            <Menu size={16} />
          </div>
        </div>
      </div>

      {/* Prominent Aesthetic Title matching "Search." in Image 2 */}
      <div className="flex flex-col items-center justify-center text-center pt-1 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest text-amber-500 font-extrabold uppercase bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            AI HARDWARE SYNTHESIZER
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-bold uppercase tracking-wider">
            Gemini 2.5 Flash
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-500 drop-shadow-[0_4px_16px_rgba(245,158,11,0.25)] select-none">
          Synthesize<span className="text-red-500 font-black">.</span>
        </h2>
      </div>

      {/* 3D Embossed Search Pill Capsule matching Image 2 */}
      <form onSubmit={handleSubmit} className="clay-search-pill-container relative w-full mb-3">
        <div className="clay-search-pill flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full bg-[#110b17] border border-amber-500/30 shadow-[inset_0_3px_8px_rgba(0,0,0,0.85),0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.08)] focus-within:border-amber-400 focus-within:shadow-[inset_0_3px_8px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.25)] transition-all">
          
          {/* Left Circular Embossed Badge matching the search icon in Image 2 */}
          <div className="clay-pill-icon-badge w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 flex items-center justify-center text-black font-bold shadow-[0_4px_12px_rgba(245,158,11,0.45),inset_0_1px_2px_rgba(255,255,255,0.4)] shrink-0 select-none">
            <Sparkles className="w-5 h-5 text-black drop-shadow-sm" />
          </div>

          {/* Input with pre-existing placeholder */}
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm md:text-base placeholder-zinc-500 font-medium px-2 py-1 min-w-0"
            placeholder="Describe an IoT project (e.g., 'Blink an LED on GPIO2 using ESP32')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />

          {/* Clear button if prompt is entered */}
          {prompt && !isLoading && (
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
              onClick={() => setPrompt("")}
              title="Clear input"
            >
              <X size={16} />
            </button>
          )}

          {/* Right Action Button */}
          <button
            type="submit"
            className="clay-search-action-btn relative group px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            disabled={!prompt.trim() || isLoading}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-amber-200" />
                  <span className="font-extrabold tracking-wide">Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-200 group-hover:rotate-12 transition-transform hidden sm:inline" />
                  <span className="font-extrabold tracking-wide">Generate Circuit &amp; Code</span>
                  <ArrowRight size={14} className="text-amber-200 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 opacity-90 group-hover:opacity-100 transition-opacity shadow-[0_0_18px_rgba(245,158,11,0.5)]" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
          </button>
        </div>
      </form>

      {/* Connected Speech Bubble Card Below with Upward Notch matching Image 2 */}
      <div className="clay-speech-bubble relative rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#140e1a] to-[#0c0810] border border-amber-500/25 p-5 sm:p-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(245,158,11,0.06)]">
        {/* Upward Pointer Notch aligned directly below the search icon capsule */}
        <div className="absolute -top-[11px] left-7 sm:left-9 w-6 h-3 pointer-events-none">
          <svg viewBox="0 0 24 12" className="w-full h-full fill-[#140e1a] stroke-amber-500/30">
            <path d="M 0 12 L 10 2 Q 12 0 14 2 L 24 12 Z" strokeWidth="1" />
          </svg>
        </div>

        {/* Pre-existing description */}
        <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed pb-3.5 border-b border-white/[0.06]">
          Describe your desired circuit or IoT functionality to synthesize schematics &amp; firmware code.
        </p>

        {/* Network Warning Banner if Backend is offline */}
        {networkWarning && (
          <div className="network-warning-banner my-3.5">
            <Info size={16} className="warning-icon text-amber-400 shrink-0" />
            <span className="warning-text">
              <strong>Demo Resilience Mode:</strong> {networkWarning}
            </span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="prompt-error-banner my-3.5">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="pt-3.5">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Quick Ideas:</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {currentSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#191122] hover:bg-[#231730] border border-amber-500/20 hover:border-amber-400/60 text-zinc-300 hover:text-white text-xs font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_16px_rgba(245,158,11,0.22)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer text-left"
                onClick={() => handleChipClick(item)}
                disabled={isLoading}
              >
                <Sparkles size={11} className="text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptBar;
