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
  Laptop,
  QrCode,
  Copy,
  Check,
  FlipHorizontal,
} from "lucide-react";
import { detectComponentsFromImage } from "../services/visionDetection";

export default function ComponentCameraScanner({ isOpen, onClose, onApplyToChat }) {
  // Tabs: 'phone' (default - Phone Link / QR / Snap / Upload) | 'webcam'
  const [activeTab, setActiveTab] = useState("phone");
  const [streamActive, setStreamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedResult, setDetectedResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Local Wi-Fi network link for phone
  const mobileUrl = `http://10.182.64.173:5173`;

  // Stop camera when modal closes or switching away from webcam tab
  useEffect(() => {
    if (!isOpen || activeTab !== "webcam") {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  // Global Paste (Ctrl+V) listener so users can copy photos from Phone Link and paste instantly
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

  const startWebcam = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Could not access laptop webcam. You can use the Phone Camera upload.");
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

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

  const handleCaptureWebcam = () => {
    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      handleImageReady(dataUrl);
    }
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
    if (activeTab === "webcam") {
      startWebcam();
    }
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
    navigator.clipboard.writeText(mobileUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Modal Card - Compact height guaranteed to fit at 100% zoom on 768p and scaled displays */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-[#100c16] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.18)] flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.08] flex items-center justify-between bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0">
              <Camera size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-outfit text-white tracking-tight">
                  Vision AI Component Scanner
                </h3>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                  Phone Link &bull; Mobile Camera
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Snap photos from your phone, paste via Phone Link, or use webcam.
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

        {/* Clean Mode Switcher: Phone Link (Default) vs Laptop Webcam */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#140f1d] border-b border-white/[0.06] text-xs font-outfit font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("phone");
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "phone"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Smartphone size={13} className="text-amber-400" />
            <span>📱 Phone Camera / Phone Link (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("webcam");
              startWebcam();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "webcam"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Laptop size={13} className="text-amber-400" />
            <span>💻 Laptop Webcam</span>
          </button>
        </div>

        {/* Center: Main Viewfinder & Interactive Area (Bounded Height) */}
        <div
          className="relative flex-1 bg-black flex items-center justify-center min-h-[200px] max-h-[300px] sm:max-h-[340px] overflow-y-auto select-none p-3 sm:p-4"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {/* TAB 1: PHONE / PHONE LINK CAPTURE (DEFAULT) */}
          {activeTab === "phone" && !capturedImage && (
            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-3 sm:gap-4 max-w-2xl mx-auto my-auto">
              
              {/* Option A: Direct Snap / Upload / Paste */}
              <div
                className={`flex-1 w-full flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 border-dashed transition-all text-center space-y-2.5 ${
                  dragOver
                    ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                    : "border-zinc-800 bg-[#140e1c]/80 hover:border-amber-500/40"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0">
                  <Smartphone size={22} />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">
                    Capture with Your Phone
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-xs leading-tight">
                    Tap to open phone camera, choose Phone Link photo, or press{" "}
                    <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-[10px]">
                      Ctrl+V
                    </kbd>{" "}
                    to paste.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs font-outfit shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Camera size={14} />
                  <span>Snap Photo / Choose File</span>
                </button>

                <div className="text-[10px] font-mono text-zinc-500">
                  Phone Link &bull; Drag &amp; Drop &bull; Ctrl+V Paste
                </div>
              </div>

              {/* Option B: Mobile Direct Link via Wi-Fi */}
              <div className="flex-1 w-full flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#120d18]/80 text-center space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <QrCode size={16} />
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-outfit">
                    Open Directly on Phone
                  </h4>
                  <p className="text-[10px] text-zinc-400 max-w-xs mt-0.5 leading-tight">
                    Scan with your phone to use the mobile camera live:
                  </p>
                </div>

                {/* QR Code (Compact 90x90) */}
                <div className="p-1.5 bg-white rounded-lg shadow-md shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
                      mobileUrl
                    )}`}
                    alt="Scan QR with Phone"
                    className="w-18 h-18 sm:w-20 sm:h-20 object-contain"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full max-w-xs">
                  <input
                    type="text"
                    readOnly
                    value={mobileUrl}
                    className="flex-1 bg-black/50 border border-zinc-800 rounded-md px-2 py-0.5 text-[11px] font-mono text-amber-300 text-center select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMobileUrl}
                    className="p-1 rounded-md bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBCAM STREAM */}
          {activeTab === "webcam" && !capturedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              {streamActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover max-h-[300px]"
                  />
                  {/* Cyber Viewfinder Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-amber-400/40 rounded-2xl relative flex items-center justify-center">
                      <div className="w-3 h-3 border-t-2 border-l-2 border-amber-400 absolute -top-1 -left-1" />
                      <div className="w-3 h-3 border-t-2 border-r-2 border-amber-400 absolute -top-1 -right-1" />
                      <div className="w-3 h-3 border-b-2 border-l-2 border-amber-400 absolute -bottom-1 -left-1" />
                      <div className="w-3 h-3 border-b-2 border-r-2 border-amber-400 absolute -bottom-1 -right-1" />
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-pulse" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Laptop size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Laptop Webcam</h4>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    {cameraError || "Click below if you wish to turn on your laptop webcam."}
                  </p>
                  <button
                    type="button"
                    onClick={startWebcam}
                    className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Start Laptop Webcam
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DISPLAY SCANNED IMAGE WITH BOUNDING BOXES */}
          {capturedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured circuit hardware"
                className="max-h-[300px] w-full object-contain"
              />

              {/* Bounding Boxes on Detected Components */}
              {detectedResult?.components && (
                <div className="absolute inset-0 pointer-events-none">
                  {detectedResult.components.map((comp, idx) => (
                    <div
                      key={idx}
                      className="absolute border-2 rounded-lg transition-all shadow-[0_0_12px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300"
                      style={{
                        borderColor: comp.color || "#10b981",
                        backgroundColor: `${comp.color}20` || "#10b98120",
                        left: `${comp.bbox.x}%`,
                        top: `${comp.bbox.y}%`,
                        width: `${comp.bbox.width}%`,
                        height: `${comp.bbox.height}%`,
                      }}
                    >
                      <div
                        className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                        style={{ backgroundColor: comp.color || "#10b981" }}
                      >
                        <CheckCircle2 size={9} />
                        <span>{comp.name}</span>
                        <span className="opacity-80">({Math.round(comp.confidence * 100)}%)</span>
                      </div>
                    </div>
                  ))}
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

        {/* Bottom Action Bar - shrink-0 so it ALWAYS remains visible on screen at 100% zoom */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#0e0a14] border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          {/* Left: Summary of Detected Parts */}
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
            ) : (
              <div className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                <Sparkles size={13} className="text-amber-400 shrink-0" />
                <span className="truncate">
                  Snap a photo on your phone or choose an image to identify circuit components.
                </span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
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

            {activeTab === "webcam" && streamActive && !capturedImage && (
              <button
                type="button"
                onClick={handleCaptureWebcam}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold text-xs font-outfit shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Camera size={14} />
                <span>Capture Frame</span>
              </button>
            )}

            {!capturedImage && activeTab === "phone" && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs font-outfit shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera size={14} />
                <span>Snap Photo with Phone</span>
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
