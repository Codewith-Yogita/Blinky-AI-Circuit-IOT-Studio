import { useState, useEffect } from "react";
import { Bot, AlertTriangle, Wrench, CheckCircle2, RotateCw, Terminal, GitCommit, Sparkles } from "lucide-react";

/**
 * AI Autonomous Testing & Self-Healing Loop Component
 * Demonstrates Blinky's "Agentic AI" capability:
 * 1. AI runs automated hardware tests on ESP32
 * 2. Detects pin or timing anomaly
 * 3. Autonomous AI reasons and applies a code fix
 * 4. Re-flashes & verifies until 100% operational
 */
function AiSelfHealingCard({ onComplete }) {
  const [phase, setPhase] = useState("testing"); // 'testing', 'error_detected', 'healing', 'verified'
  const [logs, setLogs] = useState([
    { time: "00:01", type: "info", text: "🤖 Blinky Agent: Initializing post-flash hardware test suite..." },
    { time: "00:02", type: "info", text: "Testing GPIO16 (Buzzer): Signal HIGH acknowledged." },
    { time: "00:03", type: "info", text: "Pinging HC-SR04 on GPIO5 (TRIG) & GPIO18 (ECHO)..." },
  ]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase("error_detected");
      setLogs((prev) => [
        ...prev,
        { time: "00:04", type: "warn", text: "⚠️ Anomaly Detected: ECHO pulse duration timing out on GPIO18." },
        { time: "00:04", type: "error", text: "Diagnostics: triggerMicroseconds(2) too short for sensor stabilization." },
        { time: "00:05", type: "agent", text: "🧠 Agentic Reasoning: Code timing needs 4μs delay before 10μs trigger pulse." },
      ]);
    }, 2400);

    const timer2 = setTimeout(() => {
      setPhase("healing");
      setLogs((prev) => [
        ...prev,
        { time: "00:06", type: "agent", text: "🔧 Blinky Agent: Auto-patching Arduino C++ sketch in memory..." },
        { time: "00:07", type: "info", text: "Diff applied: updated pulse timing & added input pull-down." },
        { time: "00:08", type: "info", text: "⚡ Hot-flashing patched firmware to ESP32 on COM3..." },
      ]);
    }, 5200);

    const timer3 = setTimeout(() => {
      setPhase("verified");
      setLogs((prev) => [
        ...prev,
        { time: "00:10", type: "success", text: "✓ Re-test passed! Distance reading confirmed at 14.2 cm." },
        { time: "00:11", type: "success", text: "✓ GPIO16 Buzzer & GPIO2 LED responding to threshold events." },
        { time: "00:11", type: "success", text: "🎉 Circuit & Firmware autonomously verified and ready!" },
      ]);
      if (onComplete) onComplete();
    }, 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`ai-healing-container phase-${phase}`}>
      <div className="healing-header">
        <div className="healing-title-group">
          <span className="agent-badge">
            <Bot size={13} className="text-amber-400" />
            <span>AGENTIC AI LOOP</span>
          </span>
          <h3>Autonomous Verification & Self-Healing Engine</h3>
        </div>
        <div className="phase-pill">
          {phase === "testing" && (
            <span className="pill-testing">
              <RotateCw size={12} className="animate-spin text-amber-400" />
              <span>Running Hardware Tests...</span>
            </span>
          )}
          {phase === "error_detected" && (
            <span className="pill-error">
              <AlertTriangle size={12} className="text-red-400" />
              <span>Anomaly Detected</span>
            </span>
          )}
          {phase === "healing" && (
            <span className="pill-healing">
              <Wrench size={12} className="text-amber-400" />
              <span>AI Auto-Fixing Code...</span>
            </span>
          )}
          {phase === "verified" && (
            <span className="pill-verified">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Self-Healing Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Diagnostic Progress Steps */}
      <div className="diagnostic-stepper">
        <div className={`diag-step ${phase !== "testing" ? "completed" : "active"}`}>
          <span className="diag-icon">
            {phase === "testing" ? <RotateCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} className="text-emerald-400" />}
          </span>
          <span className="diag-label">1. Hardware Test</span>
        </div>
        <div className={`diag-step ${phase === "error_detected" ? "alert" : phase === "healing" || phase === "verified" ? "completed" : "pending"}`}>
          <span className="diag-icon">
            {phase === "error_detected" ? <AlertTriangle size={14} className="text-red-400" /> : phase === "healing" || phase === "verified" ? <CheckCircle2 size={14} className="text-emerald-400" /> : "○"}
          </span>
          <span className="diag-label">2. Detect Anomaly</span>
        </div>
        <div className={`diag-step ${phase === "healing" ? "active" : phase === "verified" ? "completed" : "pending"}`}>
          <span className="diag-icon">
            {phase === "healing" ? <Wrench size={14} className="text-amber-400 animate-bounce" /> : phase === "verified" ? <CheckCircle2 size={14} className="text-emerald-400" /> : "○"}
          </span>
          <span className="diag-label">3. AI Self-Fix</span>
        </div>
        <div className={`diag-step ${phase === "verified" ? "completed success" : "pending"}`}>
          <span className="diag-icon">
            {phase === "verified" ? <Sparkles size={14} className="text-amber-400" /> : "○"}
          </span>
          <span className="diag-label">4. Verified OK</span>
        </div>
      </div>

      {/* Agent Reasoning & Patch Diff Box */}
      {(phase === "healing" || phase === "verified") && (
        <div className="ai-patch-box">
          <div className="patch-title">
            <span className="flex items-center gap-1.5">
              <GitCommit size={14} className="text-amber-400" />
              Autonomous Code Patch Generated by Blinky Agent
            </span>
            <span className="diff-badge">+2 lines, -1 line</span>
          </div>
          <pre className="patch-diff">
            <code>
              <span className="diff-context"> digitalWrite(TRIG_PIN, LOW);</span>{"\n"}
              <span className="diff-del">- delayMicroseconds(2);</span>{"\n"}
              <span className="diff-add">+ delayMicroseconds(4); // Extended pulse stabilization</span>{"\n"}
              <span className="diff-context"> digitalWrite(TRIG_PIN, HIGH);</span>{"\n"}
              <span className="diff-context"> delayMicroseconds(10);</span>{"\n"}
              <span className="diff-add">+ pinMode(ECHO_PIN, INPUT_PULLDOWN); // Signal noise filter</span>
            </code>
          </pre>
        </div>
      )}

      {/* Terminal Diagnostic Feed */}
      <div className="healing-terminal">
        <div className="terminal-bar">
          <div className="terminal-bar-left">
            <Terminal size={13} className="text-amber-400" />
            <span>ESP32 Agent Test Console</span>
          </div>
          <span className="blink-dot">● LIVE</span>
        </div>
        <div className="terminal-logs">
          {logs.map((log, i) => (
            <div key={i} className={`healing-log line-${log.type}`}>
              <span className="log-timestamp">[{log.time}]</span>
              <span className="log-msg">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiSelfHealingCard;
