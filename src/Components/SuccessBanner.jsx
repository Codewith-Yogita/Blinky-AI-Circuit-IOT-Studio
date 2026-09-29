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
            <button type="button" className="telemetry-cta-btn" onClick={onOpenTelemetry}>
              <Activity size={15} />
              <span>View Real-Time Telemetry Feed</span>
              <ArrowRight size={15} />
            </button>
          )}
          {onRestart && (
            <button type="button" className="restart-btn" onClick={onRestart}>
              <RotateCcw size={15} />
              <span>Re-run Circuit Verification</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuccessBanner;
