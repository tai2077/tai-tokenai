"use client";

import React, { useEffect, useState } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { manifestUrl } from "../lib/tonconnect";
import { initTelegram } from "../lib/telegram";
import { ErrorBoundary } from "./ErrorBoundary";
import Layout from "./Layout";
import { SplashScreen } from "./SplashScreen";

const SPLASH_SESSION_KEY = "tai_splash_shown";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    try {
      return window.sessionStorage.getItem(SPLASH_SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    initTelegram();
  }, []);

  const handleSplashComplete = () => {
    try {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      // Ignore storage access failures in restrictive browser contexts.
    }
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          {showSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <Layout>{children}</Layout>
          )}
        </TonConnectUIProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
