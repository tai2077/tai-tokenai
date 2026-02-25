"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Rocket,
  LineChart,
  User,
  Bot,
  Globe,
  Wifi,
  WifiOff,
} from "lucide-react";
import ToastContainer from "./Toast";
import WalletButton from "./WalletButton";
import { useTranslation } from "react-i18next";
import { useStore } from "../store/useStore";
import { formatNumber } from "../lib/number";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const { t, i18n } = useTranslation();
  const globalData = useStore((state) => state.globalData);
  const fetchGlobalData = useStore((state) => state.fetchGlobalData);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    void fetchGlobalData();
    const ticker = window.setInterval(() => {
      void fetchGlobalData();
    }, 30000);
    return () => window.clearInterval(ticker);
  }, [fetchGlobalData]);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem("tai_lang", nextLanguage);
  };

  const navItems = [
    { path: "/market", label: t("nav.market"), icon: <LineChart className="w-5 h-5" /> },
    { path: "/ops", label: t("nav.dashboard"), icon: <Terminal className="w-5 h-5" /> },
    { path: "/launch", label: t("nav.launch"), icon: <Rocket className="w-5 h-5" /> },
    { path: "/trade", label: t("nav.trade"), icon: <Bot className="w-5 h-5" /> },
    { path: "/profile", label: t("nav.profile"), icon: <User className="w-5 h-5" /> },
  ];

  const canonicalPathname = pathname === "/ops-center" ? "/ops" : pathname;

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] bg-grid-pattern text-[color:var(--color-text-primary)] font-vt crt relative selection:bg-[#00FF41] selection:text-black pb-20">
      <ToastContainer />
      {/* Top Bar / Ticker */}
      <div className="h-12 border-b border-[color:var(--color-border)] flex items-center px-4 bg-[color:var(--color-surface)]/95 backdrop-blur sticky top-0 z-50 justify-between gap-4">
        <div className="relative overflow-hidden whitespace-nowrap flex-1 h-full flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[color:var(--color-surface)] to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-8 text-sm md:text-base inline-flex px-4 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4 text-[#00FF41]" /> : <WifiOff className="w-4 h-4 text-red-500" />}
              SYS.STATUS: {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <span className="hidden sm:inline">BTC: ${formatNumber(globalData.prices?.btc ?? 64230)} <span className="text-[#00FF41]">+5.2%</span></span>
            <span className="hidden sm:inline">
              ETH: ${formatNumber(globalData.prices?.eth ?? 3450)} <span className="text-[#00FF41]">+2.1%</span>
            </span>
            <span>
              TAI: ${(globalData.prices?.tai || 1.45)} <span className="text-[#00FF41]">+14.4%</span>
            </span>
            <span className="hidden md:inline">AGENT_NETWORK: 1,337 ACTIVE</span>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[color:var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            aria-label="切换语言"
            className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors border border-[#333] px-2 py-1 rounded"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs uppercase">{i18n.language}</span>
          </button>
          <WalletButton />
        </div>
      </div>

      <main className="p-4 pt-safe pb-safe max-w-[1920px] mx-auto">{children}</main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-[color:var(--color-surface)]/95 backdrop-blur border-t border-[color:var(--color-border)] z-50 flex justify-around items-center px-2 pb-safe pt-2">
        {navItems.map((item) => {
          const isActive =
            canonicalPathname === item.path ||
            (item.path !== "/" && canonicalPathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center w-full h-[56px] gap-1 transition-all duration-200 rounded-lg mx-1 ${isActive
                ? "text-[#00FF41] glow-text bg-[#00FF41]/10 glow-box"
                : "text-gray-500 hover:text-[#00FF41] hover:bg-[#00FF41]/5"
                }`}
            >
              {item.icon}
              <span className="font-pixel text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
