import { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  Sparkles,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Cpu,
  ArrowRight,
  Smartphone,
  QrCode,
  Copy,
  Check,
  Radio,
  Wifi,
} from "lucide-react";
import {
  detectComponentsFromImage,
  subscribeToLivePhoneStream,
  API_BASE_URL,
} from "../services/visionDetection";
import LivePhoneScreen, { normalizeBbox, getComponentColor } from "./LivePhoneScreen";

export default function ComponentCameraScanner({ isOpen, onClose, onApplyToChat }) {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedResult, setDetectedResult] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Live Phone (Expo Go) Streaming State
  const [livePhoneFrame, setLivePhoneFrame] = useState(null);
  const [phoneStreamStatus, setPhoneStreamStatus] = useState({
    connected: false,
    isLive: false,
    latency_ms: 0,
    mode: "connecting",
  });

  const fileInputRef = useRef(null);
  const mobileStudioUrl = `http://192.168.1.11:5173`;

  // Subscribe to live phone stream from Expo Go
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToLivePhoneStream(
      (frameData) => {
        if (frameData && frameData.image) {
          setLivePhoneFrame(frameData);
        }
      },
      (status) => {
        setPhoneStreamStatus(status);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Global Paste (Ctrl+V) listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result;
              handleImageReady(dataUrl);
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  const handleImageReady = async (imageSrc) => {
    setCapturedImage(imageSrc);
    setIsScanning(true);
    setDetectedResult(null);

    try {
      const result = await detectComponentsFromImage(imageSrc);
      setDetectedResult(result);
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUseLivePhoneFrame = () => {
    if (!livePhoneFrame?.image) return;

    setCapturedImage(livePhoneFrame.image);
    const detections = livePhoneFrame.detections || [];
    setDetectedResult({
      success: true,
      model: "Blinky YOLO26 (Expo Go Live)",
      components: detections.map((d) => ({
        ...d,
        name: d.label || d.name || "Component",
        confidence: d.confidence || 0.95,
        bbox: {
          x: d.bbox?.x1 ?? d.bbox?.x ?? 20,
          y: d.bbox?.y1 ?? d.bbox?.y ?? 20,
          width: d.bbox?.width ?? 30,
          height: d.bbox?.height ?? 30,
        },
      })),
      totalCount: detections.length,
      summary: `Detected ${detections.length} components streamed live from Expo Go.`,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      handleImageReady(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        handleImageReady(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedResult(null);
  };

  const handleApply = () => {
    if (!detectedResult || !detectedResult.components) return;

    onApplyToChat({
      components: detectedResult.components,
      summary: detectedResult.summary,
    });
    onClose();
  };

  const handleCopyMobileUrl = () => {
    navigator.clipboard.writeText(mobileStudioUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-[#100c16] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.18)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.08] flex items-center justify-between bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0">
              <Smartphone size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-outfit text-white tracking-tight">
                  Phone Camera Scanner
                </h3>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${
                    livePhoneFrame
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      livePhoneFrame ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  {livePhoneFrame ? "Expo Go Live Stream Active" : "Waiting for Expo Go"}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Point your phone camera running Expo Go at physical electronics on your desk.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Center: Live Phone Stream or Captured Preview */}
        <div
          className="relative flex-1 bg-black flex items-center justify-center min-h-[220px] max-h-[340px] sm:max-h-[380px] overflow-hidden select-none p-3 sm:p-4"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {!capturedImage && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <LivePhoneScreen
                frameData={livePhoneFrame}
                maxHeight="280px"
                onCapture={handleUseLivePhoneFrame}
                captureLabel="Use Live Frame"
                showControls={Boolean(livePhoneFrame?.image)}
              />
            </div>
          )}

          {/* STATE B: DISPLAY SCANNED IMAGE WITH BOUNDING BOXES */}
          {capturedImage && (
            <div className="relative inline-block max-w-full max-h-[300px] overflow-hidden rounded-xl bg-black border border-white/20">
              <img
                src={capturedImage}
                alt="Captured circuit hardware"
                className="block max-h-[300px] w-auto max-w-full object-contain mx-auto select-none pointer-events-none"
              />

              {detectedResult?.components && (
                <div className="absolute inset-0 pointer-events-none">
                  {detectedResult.components.map((comp, idx) => {
                    const { left, top, width, height } = normalizeBbox(comp.bbox);
                    const color = getComponentColor(comp);
                    const confPercent = Math.round((comp.confidence || 0.95) * 100);
                    const clampedW = Math.min(width, 100 - left);
                    const clampedH = Math.min(height, 100 - top);

                    return (
                      <div
                        key={idx}
                        className="absolute border-2 rounded-lg transition-all"
                        style={{
                          borderColor: color,
                          backgroundColor: `${color}20`,
                          boxShadow: `0 0 10px ${color}60`,
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${clampedW}%`,
                          height: `${clampedH}%`,
                        }}
                      >
                        <div
                          className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                          style={{ backgroundColor: color }}
                        >
                          <CheckCircle2 size={9} />
                          <span>{comp.name || comp.label}</span>
                          <span className="opacity-80">({confPercent}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Scanning In-Progress Laser Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-30 animate-in fade-in">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-amber-500/20 border-t-amber-400 animate-spin" />
                <Sparkles size={16} className="text-amber-400 absolute" />
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-white font-outfit">
                  Neural Component Recognition in Progress...
                </span>
                <p className="text-[10px] font-mono text-amber-300">
                  Identifying microcontrollers, sensors, pinouts, and breadboard wiring
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#0e0a14] border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <div className="flex-1 text-left min-w-0">
            {detectedResult ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {detectedResult.totalCount} Components Identified:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-[38px] overflow-y-auto">
                  {detectedResult.components.map((c, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                      style={{
                        borderColor: `${c.color}50`,
                        backgroundColor: `${c.color}15`,
                        color: c.color || "#fff",
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : livePhoneFrame?.detections?.length > 0 ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                <Radio size={13} className="animate-pulse" />
                <span>
                  Live from Phone: {livePhoneFrame.detections.map((d) => d.label).join(", ")}
                </span>
              </div>
            ) : (
              <div className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                <Sparkles size={13} className="text-amber-400 shrink-0" />
                <span className="truncate">
                  {livePhoneFrame
                    ? "Phone camera streaming. Click 'Use Live Frame' to analyze."
                    : "Open Expo Go on your phone to stream camera footage."}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {capturedImage && (
              <button
                type="button"
                onClick={handleRetake}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-xs font-bold font-outfit transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Retake</span>
              </button>
            )}

            {!capturedImage && livePhoneFrame && (
              <button
                type="button"
                onClick={handleUseLivePhoneFrame}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs font-outfit shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Camera size={14} />
                <span>Use Live Frame ({livePhoneFrame.detections?.length || 0} Parts)</span>
              </button>
            )}

            {!capturedImage && !livePhoneFrame && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs font-outfit shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera size={14} />
                <span>Snap / Upload Photo</span>
              </button>
            )}

            {detectedResult && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm font-outfit shadow-[0_4px_18px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_22px_rgba(16,185,129,0.5)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Sparkles size={14} />
                <span>Apply to Chat &amp; Synthesize</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
