import { useState, useEffect, useRef } from "react";
import { Terminal, Zap, Loader2, CheckCircle2, AlertCircle, Trash2, Cpu, X } from "lucide-react";
import { checkDeviceStatus, flashFirmware } from "../services/hardwareApi";

function HardwarePanel({ code }) {
  const [device, setDevice] = useState({
    connected: true,
    port: "COM3",
    board: "ESP32 DevKit V1",
  });

  const [flashingState, setFlashingState] = useState({
    isFlashing: false,
    progress: 0,
    stage: "",
    status: "idle", // 'idle', 'flashing', 'success', 'error'
    errorMsg: null,
  });

  const [showSerial, setShowSerial] = useState(false);
  const [serialLogs, setSerialLogs] = useState([
    { time: "12:00:01", type: "system", text: "Serial monitor connected at 115200 baud." },
    { time: "12:00:02", type: "boot", text: "rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)" },
    { time: "12:00:02", type: "ready", text: "ESP32 DevKit V1 ready for firmware flashing." },
  ]);

  const terminalContainerRef = useRef(null);

  // Auto-scroll serial monitor strictly inside terminal without jumping the page
  useEffect(() => {
    if (showSerial && terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [serialLogs, showSerial]);

  // Initial device check
  useEffect(() => {
    checkDeviceStatus().then((status) => {
      if (status) setDevice(status);
    });
  }, []);

  const handleFlash = async () => {
    if (!code || flashingState.isFlashing) return;

    setFlashingState({
      isFlashing: true,
      progress: 0,
      stage: "Initializing compiler...",
      status: "flashing",
      errorMsg: null,
    });

    try {
      const result = await flashFirmware({
        code,
        port: device.port,
        onProgress: ({ step, progress }) => {
          setFlashingState((prev) => ({
            ...prev,
            progress,
            stage: step,
          }));
        },
      });

      if (result.success) {
        setFlashingState({
          isFlashing: false,
          progress: 100,
          stage: "Upload Complete!",
          status: "success",
          errorMsg: null,
        });

        // Append realistic execution logs to serial monitor
        const now = new Date().toLocaleTimeString();
        setSerialLogs((prev) => [
          ...prev,
          { time: now, type: "system", text: `--- Flashed firmware successfully to ${device.port} ---` },
          { time: now, type: "boot", text: "rst:0x10 (RTCWDT_RTC_RESET),boot:0x13" },
          { time: now, type: "app", text: "⚡ Blinky: ESP32 Hardware execution started." },
          { time: now, type: "app", text: "GPIO pins configured. Loop running." },
        ]);
        setShowSerial(true);
      }
    } catch (err) {
      setFlashingState({
        isFlashing: false,
        progress: 0,
        stage: "Flash failed",
        status: "error",
        errorMsg: err.message || "Failed to communicate with ESP32.",
      });
    }
  };

  const handleClearSerial = () => {
    setSerialLogs([]);
  };

  return (
    <div className="hardware-panel">
      {/* Hardware Device Status Bar */}
      <div className="hardware-status-bar">
        <div className="device-info">
          <span className={`status-indicator ${device.connected ? "connected" : "disconnected"}`} />
          <div className="device-text">
            <span className="device-name">
              <Cpu size={14} className="text-amber-400" />
              {device.board}
            </span>
            <span className="device-port">
              {device.connected ? `Connected (${device.port} • 115200 baud)` : "No device detected"}
            </span>
          </div>
        </div>

        <div className="hardware-actions">
          <button
            type="button"
            className={`serial-toggle-btn ${showSerial ? "active" : ""}`}
            onClick={() => setShowSerial((prev) => !prev)}
          >
            <Terminal size={14} />
            <span>{showSerial ? "Hide Serial Monitor" : "Serial Monitor"}</span>
          </button>

          <button
            type="button"
            className="flash-btn"
            onClick={handleFlash}
            disabled={!device.connected || !code || flashingState.isFlashing}
          >
            {flashingState.isFlashing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Zap size={15} className="fill-amber-400" />
                <span>Flash to ESP32</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Flashing Progress Bar */}
      {flashingState.isFlashing && (
        <div className="flash-progress-box">
          <div className="progress-labels">
            <span className="stage-text">{flashingState.stage}</span>
            <span className="percent-text">{flashingState.progress}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${flashingState.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Banner */}
      {flashingState.status === "success" && !flashingState.isFlashing && (
        <div className="flash-alert success">
          <div className="alert-left">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>Firmware uploaded successfully! Running on {device.port}.</span>
          </div>
          <button
            type="button"
            className="alert-dismiss"
            onClick={() => setFlashingState((p) => ({ ...p, status: "idle" }))}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error Banner with Troubleshooting Tips */}
      {flashingState.status === "error" && (
        <div className="flash-alert error">
          <div className="error-title">
            <AlertCircle size={18} className="text-red-400" />
            <span>Upload Failed: {flashingState.errorMsg}</span>
          </div>
          <div className="troubleshoot-tips">
            <strong>Troubleshooting tips for ESP32:</strong>
            <ul>
              <li>Hold down the <strong>BOOT</strong> button on your ESP32 board until flashing begins.</li>
              <li>Ensure your Micro-USB cable supports data transfer (not just power charging).</li>
              <li>Verify that the correct COM port ({device.port}) is selected.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Serial Monitor Terminal Drawer */}
      {showSerial && (
        <div className="serial-monitor">
          <div className="serial-header">
            <div className="serial-header-title">
              <Terminal size={14} className="text-amber-400" />
              <span className="serial-title">ESP32 Live Serial Console (115200 baud)</span>
            </div>
            <button type="button" className="clear-serial-btn" onClick={handleClearSerial} title="Clear terminal">
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
          <div className="serial-terminal" ref={terminalContainerRef}>
            {serialLogs.map((log, idx) => (
              <div key={idx} className={`serial-line line-${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-text">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HardwarePanel;
