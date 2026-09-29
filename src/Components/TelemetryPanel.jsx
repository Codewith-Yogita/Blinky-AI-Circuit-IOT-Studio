import { useState, useEffect } from "react";
import { Database, Radio, Gauge, Lightbulb, Bell, Clock } from "lucide-react";

function TelemetryPanel() {
  const [distance, setDistance] = useState(14); // 14 cm from PPT slide 4
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subtle simulated sensor telemetry fluctuation when live
  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      setDistance((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        const next = Math.max(5, Math.min(40, prev + delta));
        return parseFloat(next.toFixed(1));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isLiveStream]);

  const isTriggered = distance < 15;

  return (
    <div className="telemetry-panel">
      {/* Telemetry Header */}
      <div className="telemetry-header">
        <div className="telemetry-header-title">
          <span className="telemetry-tag">
            <Radio size={12} className="text-amber-400" />
            09 TELEMETRY
          </span>
          <h3>Tiger Data / PostgreSQL Real-time Sensor Feed</h3>
        </div>
        <div className="telemetry-db-badge">
          <Database size={13} className="text-emerald-400" />
          <span className="live-dot" />
          <span>Live Database Sync (24ms)</span>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="telemetry-grid">
        {/* Metric 1: Distance Gauge */}
        <div className={`telemetry-card ${isTriggered ? "alert" : ""}`}>
          <div className="card-top">
            <div className="metric-icon-wrap amber">
              <Gauge size={16} />
            </div>
            <span className="metric-label">Ultrasonic Distance</span>
          </div>
          <div className="metric-value">
            {distance} <span className="metric-unit">cm</span>
          </div>
          <div className="metric-sub">
            Threshold: &lt; 15 cm • Status:{" "}
            <strong className={isTriggered ? "text-danger" : "text-success"}>
              {isTriggered ? "ALARM TRIGGERED" : "CLEAR"}
            </strong>
          </div>
          <div className="distance-slider-control">
            <span className="slider-label">Demo Sensor Sim:</span>
            <input
              type="range"
              min="5"
              max="40"
              value={distance}
              onChange={(e) => {
                setIsLiveStream(false);
                setDistance(parseFloat(e.target.value));
              }}
              className="distance-range"
            />
          </div>
        </div>

        {/* Metric 2: Alert LED Status */}
        <div className="telemetry-card">
          <div className="card-top">
            <div className={`metric-icon-wrap ${isTriggered ? "red" : "gray"}`}>
              <Lightbulb size={16} />
            </div>
            <span className="metric-label">Status LED (GPIO2)</span>
          </div>
          <div className="metric-value">
            <span className={`led-pill ${isTriggered ? "active" : "inactive"}`}>
              {isTriggered ? "● ON (HIGH)" : "○ OFF (LOW)"}
            </span>
          </div>
          <div className="metric-sub">Output State: {isTriggered ? "HIGH (3.3V)" : "LOW (0V)"}</div>
        </div>

        {/* Metric 3: Piezo Buzzer Status */}
        <div className="telemetry-card">
          <div className="card-top">
            <div className={`metric-icon-wrap ${isTriggered ? "red" : "gray"}`}>
              <Bell size={16} />
            </div>
            <span className="metric-label">Buzzer Alarm (GPIO16)</span>
          </div>
          <div className="metric-value">
            <span className={`buzzer-pill ${isTriggered ? "active" : "inactive"}`}>
              {isTriggered ? "⚡ ACTIVE" : "SILENT"}
            </span>
          </div>
          <div className="metric-sub">Frequency: {isTriggered ? "2.4 kHz Pulse" : "Muted"}</div>
        </div>

        {/* Metric 4: Tiger Data Sync Timestamp */}
        <div className="telemetry-card">
          <div className="card-top">
            <div className="metric-icon-wrap gray">
              <Clock size={16} />
            </div>
            <span className="metric-label">Database Record</span>
          </div>
          <div className="metric-value timestamp">{currentTime}</div>
          <div className="metric-sub">PostgreSQL Table: <code>esp32_telemetry</code></div>
        </div>
      </div>
    </div>
  );
}

export default TelemetryPanel;
