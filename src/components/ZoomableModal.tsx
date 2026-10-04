import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function ZoomableModal({
  isOpen,
  onClose,
  children,
  title
}: ZoomableModalProps) {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Gesture state refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);

  // Reset transforms whenever the modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsTransitioning(false);
    }
  }, [isOpen]);

  // Prevent background scroll while magnified
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getDistance = (t1: React.Touch, t2: React.Touch): number => {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  };

  const handleResetZoom = useCallback(() => {
    setIsTransitioning(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 250);
  }, []);

  const handleZoomIn = useCallback(() => {
    setIsTransitioning(true);
    setScale(prev => Math.min(prev + 0.75, 4.5));
    setTimeout(() => setIsTransitioning(false), 200);
  }, []);

  const handleZoomOut = useCallback(() => {
    setIsTransitioning(true);
    setScale(prev => {
      const next = Math.max(prev - 0.75, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 200);
  }, []);

  // Clamp pan position within reasonable bounds
  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (currentScale <= 1) return { x: 0, y: 0 };
    const maxPanX = (window.innerWidth * (currentScale - 1)) / 1.8;
    const maxPanY = (window.innerHeight * (currentScale - 1)) / 1.8;
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y))
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch to zoom initiated
      isDraggingRef.current = false;
      setIsTransitioning(false);
      initialPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      // Single touch: either pan (if zoomed) or potential double-tap
      const touch = e.touches[0];
      const now = Date.now();
      const timeSinceLast = now - lastTapRef.current;

      if (timeSinceLast < 300) {
        // Double-tap detected: toggle between 1x and 2.5x
        setIsTransitioning(true);
        if (scale > 1.2) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        } else {
          setScale(2.5);
          // Center zoom on double-tap position relative to viewport
          const offsetX = (window.innerWidth / 2 - touch.clientX) * 0.8;
          const offsetY = (window.innerHeight / 2 - touch.clientY) * 0.8;
          setPosition(clampPosition(offsetX, offsetY, 2.5));
        }
        setTimeout(() => setIsTransitioning(false), 250);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // Start potential pan
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { x: position.x, y: position.y };
      isDraggingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Active pinch gesture
      e.preventDefault();
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      if (initialPinchDistRef.current > 0) {
        const factor = currentDist / initialPinchDistRef.current;
        const newScale = Math.min(Math.max(initialScaleRef.current * factor, 0.9), 5);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && scale > 1) {
      // Active pan gesture when zoomed
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      if (Math.hypot(deltaX, deltaY) > 6) {
        isDraggingRef.current = true;
      }

      const nextX = panStartRef.current.x + deltaX;
      const nextY = panStartRef.current.y + deltaY;
      setPosition(clampPosition(nextX, nextY, scale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scale < 1) {
      // Snap back to minimum scale
      setIsTransitioning(true);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setTimeout(() => setIsTransitioning(false), 200);
    } else if (scale > 1) {
      // Ensure bounds are maintained
      const clamped = clampPosition(position.x, position.y, scale);
      if (clamped.x !== position.x || clamped.y !== position.y) {
        setIsTransitioning(true);
        setPosition(clamped);
        setTimeout(() => setIsTransitioning(false), 200);
      }
    }
  };

  // Mouse wheel zoom support for desktop
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.3 : -0.3;
    const newScale = Math.min(Math.max(scale + delta, 1), 5);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition(prev => clampPosition(prev.x, prev.y, newScale));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200 backdrop-blur-md select-none touch-none overscroll-none"
      style={{ touchAction: "none" }}
    >
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-[110] pointer-events-auto">
        <div className="text-white">
          {title && (
            <h3 className="font-bold text-sm tracking-wider uppercase text-white/90 drop-shadow truncate max-w-[200px] sm:max-w-md">
              {title}
            </h3>
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
            {scale > 1.05 ? `${scale.toFixed(1)}x Zoom • Drag to Pan` : "Pinch or double-tap to zoom"}
          </span>
        </div>

        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all shadow-lg cursor-pointer"
          title="Close magnifier"
          aria-label="Close magnifier"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Interactive Zoom & Pan Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2 sm:p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onWheel={handleWheel}
        onClick={(e) => {
          // Close if tapped on background without dragging and at 1x
          if (!isDraggingRef.current && scale <= 1.05 && e.target === containerRef.current) {
            onClose();
          }
        }}
      >
        <div
          className="relative flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isTransitioning ? "transform 0.25s cubic-bezier(0.2, 0, 0, 1)" : "none"
          }}
        >
          {children}

          {/* Watermark Protection Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.25] select-none overflow-hidden z-20">
            <span className="text-3xl md:text-5xl font-black rotate-[-35deg] text-white whitespace-nowrap tracking-widest drop-shadow-md">
              © MITCHELL WARD STUDIOS
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Zoom Action Bar */}
      <div className="absolute bottom-6 z-[110] flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl pointer-events-auto">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 1}
          className="p-2 text-white hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold text-white px-1">
          {scale.toFixed(1)}x
        </span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 4.5}
          className="p-2 text-white hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {scale > 1.05 && (
          <>
            <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
            <button
              onClick={handleResetZoom}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
