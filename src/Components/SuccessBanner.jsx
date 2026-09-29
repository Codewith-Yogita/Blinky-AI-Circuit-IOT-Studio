import { Trophy, Sparkles, Activity, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";

function SuccessBanner({ onRestart, onOpenTelemetry }) {
  return (
    <div className="success-showcase-card">
      <div className="success-icon-glow">
        <Trophy size={42} className="text-amber-400" />
      </div>
      <div className="success-content">
        <span className="success-badge">
          <Sparkles size={12} className="inline mr-1 text-amber-400" />
          CIRCUIT DESIGN VERIFIED • HARDWARE READY
        </span>
        <h2>Hardware Circuit Generated &amp; Verified!</h2>
        <p className="success-desc">
          Blinky has generated the circuit according to backend specifications, mapped all pin connections, and validated the ESP32 hardware configuration.
        </p>

        <div className="success-metrics-row">
          <div className="metric-pill">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span><strong>Circuit Connections:</strong> 100% Verified</span>
          </div>
          <div className="metric-pill">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span><strong>ESP32 Pinout:</strong> Validated</span>
          </div>
          <div className="metric-pill">
            <Activity size={14} className="text-amber-400" />
            <span><strong>Telemetry Feed:</strong> Active &amp; Ready</span>
          </div>
        </div>

        <div className="success-actions">
          {onOpenTelemetry && (
            <button type="button" className="telemetry-cta-btn group" onClick={onOpenTelemetry}>
              <div className="w-5 h-5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Activity size={12} />
              </div>
              <span className="font-outfit">View Real-Time Telemetry Feed</span>
              <ArrowRight size={13} className="text-zinc-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
          {onRestart && (
            <button type="button" className="restart-btn group" onClick={onRestart}>
              <div className="w-5 h-5 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
                <RotateCcw size={12} />
              </div>
              <span className="font-outfit">Re-run Circuit Verification</span>
              <ArrowRight size={13} className="text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuccessBanner;
