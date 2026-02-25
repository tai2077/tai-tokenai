"use client";

import React, { useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { manifestUrl } from "../lib/tonconnect";
import { initTelegram } from "../lib/telegram";
import { ErrorBoundary } from "./ErrorBoundary";
import Layout from "./Layout";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <Layout>{children}</Layout>
        </TonConnectUIProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
