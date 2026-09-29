import { useState, useEffect, useRef } from "react";
import { RotateCcw, Play, Pause, Move3d, Cloud, Sparkles } from "lucide-react";

export default function Interactive3DHeadline() {
  const [rot, setRot] = useState({ x: -4, y: 8 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rotX: rot.x,
      rotY: rot.y,
    };
    lastPosRef.current = { x: clientX, y: clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  // Drag listeners on window to ensure uninterrupted 360 degree drag
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;

      velocityRef.current = {
        x: clientX - lastPosRef.current.x,
        y: clientY - lastPosRef.current.y,
      };
      lastPosRef.current = { x: clientX, y: clientY };

      setRot({
        x: dragStartRef.current.rotX - dy * 0.45,
        y: dragStartRef.current.rotY + dx * 0.45,
      });
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  // Inertia momentum and auto-spin loop
  useEffect(() => {
    let animId;
    const updateMomentum = () => {
      if (!isDragging) {
        if (isAutoSpin) {
          setRot((prev) => ({
            x: prev.x * 0.98,
            y: (prev.y + 0.8) % 360,
          }));
        } else if (
          Math.abs(velocityRef.current.x) > 0.05 ||
          Math.abs(velocityRef.current.y) > 0.05
        ) {
          velocityRef.current.x *= 0.94;
          velocityRef.current.y *= 0.94;
          setRot((prev) => ({
            x: prev.x - velocityRef.current.y * 0.4,
            y: prev.y + velocityRef.current.x * 0.4,
          }));
        }
      }
      animId = requestAnimationFrame(updateMomentum);
    };

    animId = requestAnimationFrame(updateMomentum);
    return () => cancelAnimationFrame(animId);
  }, [isDragging, isAutoSpin]);

  const handleReset = () => {
    setIsAutoSpin(false);
    velocityRef.current = { x: 0, y: 0 };
    setRot({ x: 0, y: 0 });
  };

  return (
    <div className="w-full relative mb-10 pt-4 select-none">
      {/* 3D Interactive Helper Badge / Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap relative z-20">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium border border-sky-400/30 bg-sky-500/10 text-sky-300 backdrop-blur-md shadow-xs shadow-sky-500/10"
        >
          <Cloud size={12} className="text-sky-300 animate-pulse" />
          <span>Floating in Sky • Drag to rotate 360°</span>
        </span>

        {/* Auto-Spin Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
            isAutoSpin
              ? "bg-amber-500/25 border border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20"
              : "bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-amber-500/30"
          }`}
          title="Toggle 360-degree automatic spin"
        >
          {isAutoSpin ? (
            <>
              <Pause size={10} className="text-amber-400" />
              <span>Spinning</span>
            </>
          ) : (
            <>
              <Play size={10} className="text-zinc-400" />
              <span>Auto-Spin</span>
            </>
          )}
        </button>

        {/* Reset Angle Button */}
        {(Math.abs(rot.x) > 0.1 || Math.abs(rot.y) > 0.1) && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-amber-500/30 transition-all cursor-pointer active:scale-95"
            title="Reset 3D angle"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Atmospheric Sky Cloud Backlight & Aura */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-sky-500/15 via-amber-500/15 to-orange-600/10 blur-[90px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute -bottom-6 left-10 w-96 h-28 bg-white/[0.03] blur-[50px] pointer-events-none -z-10 rounded-full sky-cloud-mist" />

      {/* Floating Starlight Particles */}
      <div className="absolute top-2 left-12 text-amber-300/60 star-sparkle-1 pointer-events-none text-xs">✦</div>
      <div className="absolute top-8 right-24 text-sky-300/70 star-sparkle-2 pointer-events-none text-sm">✦</div>
      <div className="absolute bottom-12 left-1/3 text-orange-400/50 star-sparkle-3 pointer-events-none text-xs">✧</div>
      <div className="absolute -top-4 right-1/3 text-white/50 star-sparkle-4 pointer-events-none text-sm">✦</div>

      {/* Main Levitation Rig (Continuous Zero-Gravity Floating Bobbing) */}
      <div className="sky-floating-rig relative z-10">
        {/* 3D Canvas Box Container (User 360-degree rotation) */}
        <div
          onPointerDown={handlePointerDown}
          className={`headline-3d-wrapper select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          title="Click and drag to rotate 360° in the sky"
        >
          <div
            className="headline-3d-box"
            style={{
              transform: `perspective(1400px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.03] m-0 p-0 pointer-events-none">
              <span className="text-3d-white block">
                BUILD HARDWARE
              </span>
              <span className="text-3d-magma block mt-1">
                AUTONOMOUSLY.
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Ground Atmospheric Sky Shadow (Expands & Contracts in sync with Floating Rig) */}
      <div className="w-4/5 max-w-xl h-8 mx-auto -mt-3 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent rounded-[100%] sky-shadow pointer-events-none -z-10" />
    </div>
  );
}

