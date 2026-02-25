import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Terminal, Rocket, LineChart, User, Bot, Globe } from "lucide-react";
import ToastContainer from "./Toast";
import WalletButton from "./WalletButton";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  };

  const navItems = [
    { path: "/", label: t("nav.dashboard"), icon: <Terminal className="w-5 h-5" /> },
    { path: "/launch", label: t("nav.launch"), icon: <Rocket className="w-5 h-5" /> },
    { path: "/trade", label: t("nav.trade"), icon: <Bot className="w-5 h-5" /> },
    { path: "/market", label: t("nav.market"), icon: <LineChart className="w-5 h-5" /> },
    { path: "/profile", label: t("nav.profile"), icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#00FF41] font-vt crt relative selection:bg-[#00FF41] selection:text-black pb-20">
      <ToastContainer />
      {/* Top Bar / Ticker */}
      <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#111] sticky top-0 z-50 justify-between gap-4">
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee flex gap-12 text-xl inline-block">
            <span>SYS.STATUS: ONLINE</span>
            <span>
              BTC: $64,230 <span className="text-[#00FF41]">+5.2%</span>
            </span>
            <span>
              ETH: $3,450 <span className="text-[#00FF41]">+2.1%</span>
            </span>
            <span>
              TAI: $1.45 <span className="text-[#00FF41]">+14.4%</span>
            </span>
            <span>AGENT_NETWORK: 1,337 ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
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
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#111] border-t border-[#333] z-50 flex justify-around items-center px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive
                ? "text-[#00FF41] glow-text"
                : "text-gray-500 hover:text-[#00FF41]"
                }`}
            >
              {item.icon}
              <span className="font-pixel text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
