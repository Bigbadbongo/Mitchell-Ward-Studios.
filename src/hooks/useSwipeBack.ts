import { useEffect, useRef } from "react";

interface UseSwipeBackOptions {
  onBack: () => void;
  enabled?: boolean;
  edgeThreshold?: number; // Maximum distance in px from left edge to start swipe (default: 45)
  minDistance?: number;   // Minimum horizontal distance in px to trigger back navigation (default: 70)
  maxVerticalOffset?: number; // Maximum vertical deviation allowed before cancelling (default: 80)
}

/**
 * Hook that listens for edge-swipe gestures originating from the left edge of the screen,
 * triggering back navigation when swiped to the right.
 */
export function useSwipeBack({
  onBack,
  enabled = true,
  edgeThreshold = 45,
  minDistance = 70,
  maxVerticalOffset = 80
}: UseSwipeBackOptions) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isValidSwipeRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Single-finger touch only
      if (e.touches.length !== 1) {
        touchStartRef.current = null;
        isValidSwipeRef.current = false;
        return;
      }

      const touch = e.touches[0];
      // Only initiate if the touch began near the left edge of the viewport
      if (touch.clientX <= edgeThreshold) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
        isValidSwipeRef.current = true;
      } else {
        touchStartRef.current = null;
        isValidSwipeRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isValidSwipeRef.current || !touchStartRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // Invalidate if the user moves vertically significantly more than horizontally
      if (deltaY > maxVerticalOffset || (deltaY > deltaX && deltaX < 30)) {
        isValidSwipeRef.current = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isValidSwipeRef.current || !touchStartRef.current) {
        touchStartRef.current = null;
        isValidSwipeRef.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const timeDiff = Date.now() - touchStartRef.current.time;

      // Allow either a quick flick (low time, moderate distance) or a deliberate drag
      const isQuickFlick = timeDiff < 300 && deltaX > 45;
      const isDeliberateDrag = deltaX >= minDistance;

      if ((isQuickFlick || isDeliberateDrag) && deltaY <= maxVerticalOffset && deltaX > deltaY * 1.2) {
        // Subtle haptic response on supported devices
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(10);
          } catch (_) {
            // Ignore if vibration permissions are restricted
          }
        }
        onBack();
      }

      touchStartRef.current = null;
      isValidSwipeRef.current = false;
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
      isValidSwipeRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [enabled, onBack, edgeThreshold, minDistance, maxVerticalOffset]);
}
