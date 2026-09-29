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
    <div className="prompt-container">
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
          className="generate-btn"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <span className="btn-loading">
              <Loader2 size={16} className="animate-spin" />
              Synthesizing...
            </span>
          ) : (
            <span className="btn-content">
              <span>Generate Circuit & Code</span>
              <ArrowRight size={15} />
            </span>
          )}
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="suggestion-chips">
        <span className="chips-label">Quick Ideas:</span>
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="chip-btn"
            onClick={() => handleChipClick(item)}
            disabled={isLoading}
          >
            <Sparkles size={11} className="chip-sparkle" />
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
