import React, { useState, useRef, useEffect } from "react";
import { Artwork, FrameType } from "../types";
import ArtworkCanvas from "./ArtworkCanvas";
import { Rotate3d, Maximize, RefreshCw } from "lucide-react";

interface ThreeDFrameMockupProps {
  artwork: Artwork;
  currentFrame: FrameType;
  onFrameChange: (frame: FrameType) => void;
}

export default function ThreeDFrameMockup({
  artwork,
  currentFrame,
  onFrameChange,
}: ThreeDFrameMockupProps) {
  // 3D rotation tracking state (X & Y angles)
  const [rotX, setRotX] = useState<number>(12);
  const [rotY, setRotY] = useState<number>(-16);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References for drag movement
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const relativeStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle pointer down for rotating
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    relativeStartRef.current = { x: rotY, y: rotX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Handle drag movement
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Sensitivity scale
    const scale = 0.45;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Calculate new rotation values in bounded safe zones
    let newY = relativeStartRef.current.x + deltaX * scale;
    let newX = relativeStartRef.current.y - deltaY * scale;

    // Cap dynamic rotation to prevent extreme canvas clipping
    newY = Math.min(Math.max(newY, -35), 35);
    newX = Math.min(Math.max(newX, -25), 25);

    setRotX(newX);
    setRotY(newY);
  };

  // Release dragging
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Preset Views helper
  const applyPreset = (preset: "front" | "gallery" | "dramatic") => {
    switch (preset) {
      case "front":
        setRotX(0);
        setRotY(0);
        break;
      case "gallery":
        setRotX(12);
        setRotY(-16);
        break;
      case "dramatic":
        setRotX(18);
        setRotY(24);
        break;
    }
  };

  // Material styled values
  const getFrameStyling = () => {
    switch (currentFrame) {
      case "Black":
        return {
          // Inner shadowbox frame structure
          moldingClass: "border-[14px] border-[#161618] bg-[#121213] rounded-lg shadow-xl ring-1 ring-black/80",
          recessClass: "bg-[#09090A] p-2 border border-black/50 shadow-inner",
          shadowColor: "rgba(0,0,0,0.45)"
        };
      case "White":
        return {
          moldingClass: "border-[14px] border-[#FFFDF8] bg-[#F1F0EC] rounded-lg shadow-lg ring-1 ring-slate-200/50",
          recessClass: "bg-[#EAE8E4] p-2 border border-stone-200/30 shadow-inner",
          shadowColor: "rgba(100,80,60,0.15)"
        };
      case "Oak":
        return {
          // Multi-toned natural wood styling with simulated CSS wood fibers
          moldingClass: "border-[14px] border-[#CD9662] bg-[#BA824E] rounded-lg shadow-xl ring-1 ring-[#5c3c20]/40",
          recessClass: "bg-[#2F1E12] p-2 border border-[#4E321F] shadow-inner",
          shadowColor: "rgba(50,30,10,0.38)",
          woodGrainStyle: {
            backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 15px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 3px, transparent 3px, transparent 20px)"
          }
        };
      case "None":
      default:
        return {
          // Wrapped Studio Stretcher look with exposed sides
          moldingClass: "border-[1.5px] border-black/20 bg-[#FAF9F6] rounded-sm ring-1 ring-black/5 shadow-inner",
          recessClass: "p-0",
          shadowColor: "rgba(0,0,0,0.22)"
        };
    }
  };

  const styling = getFrameStyling();

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. 3D Canvas Stage Container */}
      <div 
        className="w-full aspect-square flex items-center justify-center p-4 select-none relative"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isDragging) setIsDragging(false);
        }}
      >
        {/* Helper interaction label floating on desktop */}
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur text-[10px] tracking-widest font-mono text-stone-200 px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1.5 z-20 pointer-events-none ${isHovered && !isDragging ? "opacity-100 translate-y-2" : "opacity-0 translate-y-0"}`}>
          <Rotate3d className="w-3.5 h-3.5 animate-pulse" />
          CLICK & DRAG TO ROTATE
        </div>

        {/* The 3D Rotator Node */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full max-w-[280px] aspect-square cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out flex items-center justify-center relative touch-none"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Layer 3D Shadows behind the frame */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-300"
            style={{
              transform: "translateZ(-30px)",
              filter: "blur(20px)",
              opacity: 0.85,
              background: `radial-gradient(circle, ${styling.shadowColor} 20%, transparent 80%)`,
              boxShadow: `0 ${20 + rotX * 0.8}px ${35 + Math.abs(rotY) * 0.5}px ${styling.shadowColor}`
            }}
          />

          {/* Stretcher depth simulation for None (raw wrap) */}
          {currentFrame === "None" && (
            <>
              {/* Top side wrap */}
              <div 
                className="absolute left-0 right-0 h-4 bg-stone-300 shadow-inner border-b border-black/10 origin-top"
                style={{
                  top: 0,
                  transform: "rotateX(90deg) translateZ(8px)",
                  background: `linear-gradient(to right, ${artwork.primaryColor}, ${artwork.secondaryColor})`,
                  filter: "brightness(0.7)"
                }}
              />
              {/* Left side wrap */}
              <div 
                className="absolute top-0 bottom-0 w-4 bg-stone-300 shadow-inner origin-left"
                style={{
                  left: 0,
                  transform: "rotateY(-90deg) translateZ(8px)",
                  background: `linear-gradient(to bottom, ${artwork.primaryColor}, ${artwork.tertiaryColor})`,
                  filter: "brightness(0.6)"
                }}
              />
              {/* Right side wrap */}
              <div 
                className="absolute top-0 bottom-0 w-4 bg-stone-300 shadow-inner origin-right"
                style={{
                  right: 0,
                  transform: "rotateY(90deg) translateZ(8px)",
                  background: `linear-gradient(to bottom, ${artwork.secondaryColor}, ${artwork.tertiaryColor})`,
                  filter: "brightness(0.85)"
                }}
              />
            </>
          )}

          {/* The Outer Frame Molding */}
          <div 
            className={`w-full h-full relative flex flex-col overflow-hidden transition-all duration-300 ${styling.moldingClass}`}
            style={{ 
              transformStyle: "preserve-3d",
              ...("woodGrainStyle" in styling ? styling.woodGrainStyle : {}) 
            }}
          >
            {/* Inner Recessed Shadow box backing gap */}
            <div className={`w-full h-full flex items-center justify-center relative ${styling.recessClass}`}>
              
              {/* Floating Canvas Element */}
              <div 
                className="w-full h-full aspect-square relative transition-all duration-300 overflow-hidden"
                style={{
                  transform: currentFrame !== "None" ? "translateZ(12px)" : "translateZ(1px)",
                  boxShadow: currentFrame !== "None" 
                    ? "0 4px 15px -1px rgba(0, 0, 0, 0.45), 0 2px 5px -1px rgba(0, 0, 0, 0.3)" 
                    : "none"
                }}
              >
                <ArtworkCanvas artwork={artwork} showTexture={currentFrame !== "None"} />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Controls Toolbar */}
      <div className="w-full flex flex-col gap-3.5 mt-2 px-1">
        
        {/* Frame Material Selection Stack */}
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 block mb-1.5 text-center">
            MOLDING MATERIAL
          </span>
          <div className="grid grid-cols-4 gap-1.5 bg-stone-100 p-1.5 rounded-xl text-xs font-medium">
            {(["Black", "White", "Oak", "None"] as FrameType[]).map((f) => (
              <button
                key={f}
                id={`frame-btn-${f.toLowerCase()}`}
                onClick={() => onFrameChange(f)}
                className={`py-2 rounded-lg transition-all text-center ${currentFrame === f ? "bg-white text-slate-900 shadow-sm border border-stone-200" : "text-slate-500 hover:text-slate-900"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* PERSPECTIVE ROTATOR BAR */}
        <div className="flex items-center justify-between py-1 border-t border-stone-100">
          <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400">
            VIEW RIG:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              id="view-preset-front"
              onClick={() => applyPreset("front")}
              className={`px-2.5 py-1 text-[10px] rounded-full uppercase tracking-wider transition-all border ${rotX === 0 && rotY === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-stone-200 hover:text-slate-900"}`}
            >
              FRONTAL
            </button>
            <button
              id="view-preset-gallery"
              onClick={() => applyPreset("gallery")}
              className={`px-2.5 py-1 text-[10px] rounded-full uppercase tracking-wider transition-all border ${rotX === 12 && rotY === -16 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-stone-200 hover:text-slate-900"}`}
            >
              GALLERY TILT
            </button>
            <button
              id="view-preset-reset"
              onClick={() => {
                setRotX(12);
                setRotY(-16);
              }}
              title="Reset Rotation angles"
              className="p-1 rounded-full text-slate-400 hover:bg-stone-100 hover:text-slate-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
