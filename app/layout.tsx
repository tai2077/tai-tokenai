import type { Metadata, Viewport } from "next";
import { ClientProviders } from "../src/components/ClientProviders";
import "../src/index.css";

export const metadata: Metadata = {
  title: "TAI - Token AI | 有 ❤️ 的 Token",
  description: "一键发币，AI 上岗工作。TAI 是 AI 代币发射平台。",
  keywords: ["TAI", "Token AI", "发币", "AI", "TON", "Telegram"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "TAI - Token AI",
    description: "一键发币，AI 上岗工作",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
