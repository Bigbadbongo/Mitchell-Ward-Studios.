import { useEffect, useRef } from "react";
import { App as CapApp } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";

interface UseNativeBackButtonProps {
  onBack: () => void;
  canGoBack: boolean;
  onCloseDrawer?: () => boolean;
}

/**
 * Hook that listens for Capacitor's native Android backButton events (hardware back button
 * and system back swipe gestures) to trigger in-app navigation or dismiss overlays instead
 * of abruptly exiting the app.
 */
export function useNativeBackButton({
  onBack,
  canGoBack,
  onCloseDrawer
}: UseNativeBackButtonProps) {
  const onBackRef = useRef(onBack);
  const canGoBackRef = useRef(canGoBack);
  const onCloseDrawerRef = useRef(onCloseDrawer);

  useEffect(() => {
    onBackRef.current = onBack;
    canGoBackRef.current = canGoBack;
    onCloseDrawerRef.current = onCloseDrawer;
  });

  useEffect(() => {
    let listener: PluginListenerHandle | null = null;

    const setupListener = async () => {
      try {
        listener = await CapApp.addListener("backButton", () => {
          // 1. If any drawer or overlay is open, dismiss it first
          if (onCloseDrawerRef.current && onCloseDrawerRef.current()) {
            return;
          }

          // 2. If in-app back navigation is possible, navigate back
          if (canGoBackRef.current) {
            onBackRef.current();
          } else {
            // 3. At the root view with no overlays open, let the system exit the app
            CapApp.exitApp();
          }
        });
      } catch (err) {
        // Graceful fallback for web/desktop browser environments
        console.warn("Capacitor App backButton listener not available:", err);
      }
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);
}
