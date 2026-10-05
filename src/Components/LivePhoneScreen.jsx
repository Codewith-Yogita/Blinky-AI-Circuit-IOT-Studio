import React from "react";
import { Smartphone, Radio, CheckCircle2, Wifi, Sparkles } from "lucide-react";

export const COMPONENT_COLORS = {
  microcontroller: "#10b981", // Emerald green (ESP32)
  sensor: "#06b6d4",          // Cyber Cyan
  led: "#ef4444",             // Bright Red
  actuator: "#f59e0b",        // Amber / Orange
  resistor: "#eab308",        // Yellow
  infrastructure: "#64748b",  // Slate / Gray
  display: "#3b82f6",         // Electric Blue
  input: "#8b5cf6",           // Purple
};

export function getComponentColor(item) {
  if (item?.color) return item.color;
  const label = (item?.label || item?.name || "").toLowerCase();
  const type = (item?.type || "").toLowerCase();
  if (type && COMPONENT_COLORS[type]) return COMPONENT_COLORS[type];
  if (label.includes("led")) return COMPONENT_COLORS.led;
  if (label.includes("esp32") || label.includes("arduino") || label.includes("devkit")) return COMPONENT_COLORS.microcontroller;
  if (label.includes("dht") || label.includes("sensor") || label.includes("sr04") || label.includes("sonar")) return COMPONENT_COLORS.sensor;
  if (label.includes("resistor")) return COMPONENT_COLORS.resistor;
  if (label.includes("oled") || label.includes("display") || label.includes("lcd")) return COMPONENT_COLORS.display;
  return "#10b981";
}

export function normalizeBbox(bbox) {
  if (!bbox) return { left: 0, top: 0, width: 0, height: 0 };
  const rawX = bbox.x1 ?? bbox.x ?? 0;
  const rawY = bbox.y1 ?? bbox.y ?? 0;
  const rawW = bbox.width ?? 0;
  const rawH = bbox.height ?? 0;

  return {
    left: rawX <= 1 && rawX > 0 ? rawX * 100 : rawX,
    top: rawY <= 1 && rawY > 0 ? rawY * 100 : rawY,
    width: rawW <= 1 && rawW > 0 ? rawW * 100 : rawW,
    height: rawH <= 1 && rawH > 0 ? rawH * 100 : rawH,
  };
}

/**
 * LivePhoneScreen - Exact mirror of the mobile app camera screen with real-time bounding boxes.
 */
export default function LivePhoneScreen({
  frameData,
  maxHeight = "420px",
  onCapture,
  captureLabel,
  showControls = true,
  className = "",
}) {
  const hasFrame = Boolean(frameData?.image);
  const detections = Array.isArray(frameData?.detections) ? frameData.detections : [];
  const latency = frameData?.latency_ms || 15;

  return (
    <div className={`relative w-full flex flex-col items-center justify-center ${className}`}>
      {/* Phone Screen Container matching phone dimensions */}
      <div
        className="relative inline-flex items-center justify-center max-w-full overflow-hidden rounded-2xl bg-black border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.15)] select-none"
        style={{ maxHeight }}
      >
        {hasFrame ? (
          <div className="relative inline-block max-w-full h-auto">
            {/* The Live Video Image Frame */}
            <img
              src={frameData.image}
              alt="Live Phone Feed"
              style={{ maxHeight }}
              className="block w-auto max-w-full object-contain mx-auto pointer-events-none"
            />

            {/* Top Floating Status Pill (Identical to Mobile Screen) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-xl text-[11px] font-mono whitespace-nowrap pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300">
                {detections.length > 0
                  ? `⚡ Live Stream • ${detections.map((d) => d.label || d.name).join(", ")}`
                  : "🟢 Live Streaming to PC Studio"}
              </span>
              <span className="text-[10px] text-zinc-400 pl-1 border-l border-white/20">
                {latency}ms
              </span>
            </div>

            {/* Bounding Box Overlay Layer (Exact 1:1 on top of image) */}
            <div className="absolute inset-0 pointer-events-none">
              {detections.map((item, idx) => {
                const { left, top, width, height } = normalizeBbox(item.bbox);
                const color = getComponentColor(item);
                const confPercent = Math.round((item.confidence || 0.95) * 100);
                const label = item.label || item.name || "Component";

                // Ensure boxes don't overflow edges
                const clampedWidth = Math.min(width, 100 - left);
                const clampedHeight = Math.min(height, 100 - top);

                return (
                  <div
                    key={item.id || idx}
                    className="absolute border-2 rounded-lg pointer-events-none transition-all duration-75"
                    style={{
                      borderColor: color,
                      backgroundColor: `${color}18`,
                      boxShadow: `0 0 10px ${color}50, inset 0 0 8px ${color}20`,
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${clampedWidth}%`,
                      height: `${clampedHeight}%`,
                    }}
                  >
                    {/* Corner Reticle Accents */}
                    <div
                      className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2"
                      style={{ borderColor: color }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2"
                      style={{ borderColor: color }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2"
                      style={{ borderColor: color }}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2"
                      style={{ borderColor: color }}
                    />

                    {/* Header Label Pill on top */}
                    <div
                      className={`absolute left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-lg flex items-center gap-1.5 ${
                        top < 8 ? "top-1" : "-top-6"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      <CheckCircle2 size={10} className="text-white" />
                      <span>{label}</span>
                      <span className="opacity-90 font-normal">({confPercent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Connecting / Waiting State */
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3 min-w-[320px] sm:min-w-[460px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Smartphone size={32} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 animate-ping" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white font-outfit">
                Waiting for Phone Camera Stream...
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed">
                Open the Expo Go app on your phone. It connects automatically to{" "}
                <span className="text-amber-300 font-mono font-semibold">192.168.1.11:8000</span> and streams
                your live desk hardware right here.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <Wifi size={13} className="text-amber-400" />
              <span>Listening on: http://192.168.1.11:8000</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Bar */}
      {showControls && hasFrame && (
        <div className="mt-2.5 w-full flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
          <div className="flex items-center gap-1.5">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">
              {detections.length > 0
                ? `${detections.length} components detected live`
                : "Tracking physical electronics on desk"}
            </span>
          </div>

          {onCapture && (
            <button
              type="button"
              onClick={onCapture}
              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>{captureLabel || "Use Current View in Prompt"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
