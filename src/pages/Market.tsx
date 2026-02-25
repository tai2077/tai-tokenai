import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LineChart, TrendingUp, Flame, Sparkles, Heart } from "lucide-react";
import { useStore } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";

export default function Market() {
  const [activeTab, setActiveTab] = useState("HOT");
  const { marketTokens } = useStore();

  const filteredTokens = marketTokens.filter(
    (t) => t.type === activeTab || activeTab === "ALL",
  );

  return (
    <div className="flex flex-col gap-6 pb-20">
      <PageHeader
        title="市场 (MARKET)"
        icon={<LineChart className="w-6 h-6" />}
        color="gold"
      />

      {/* FOMO Live Banner */}
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 overflow-hidden flex items-center relative glow-box">
        <Flame className="w-4 h-4 text-red-500 absolute left-2 z-10 animate-pulse" />
        <div className="animate-marquee whitespace-nowrap pl-8 text-[10px] font-pixel text-red-400">
          🔥 巨头建仓: 某地址扫货 1.5M TAI  |  🚀 新币上线: DOGE_CYBER_PUMP 5分钟内暴涨 +300%  |  💎 重点监控: AI_MINER_01 收益率异常飙升
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#333] pb-4 overflow-x-auto">
        {[
          {
            id: "HOT",
            label: "热门币 (HOT)",
            icon: <Flame className="w-4 h-4" />,
          },
          {
            id: "NEW",
            label: "新币 (NEW)",
            icon: <Sparkles className="w-4 h-4" />,
          },
          {
            id: "TOP",
            label: "涨幅榜 (TOP GAINERS)",
            icon: <TrendingUp className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-pixel text-[10px] whitespace-nowrap transition-colors ${activeTab === tab.id
              ? "bg-[#00FF41] text-black shadow-[0_0_10px_rgba(0,255,65,0.3)]"
              : "bg-[#111] text-gray-500 hover:text-[#00FF41] border border-[#333] border-b-0"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Token List */}
      <div className="flex flex-col gap-4">
        {filteredTokens.map((token, index) => (
          <motion.div
            key={token.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 bg-black border border-[#333] rounded flex items-center justify-center font-pixel text-[8px] text-[#00FF41] shrink-0">
                LOGO
              </div>
              <div className="flex-1">
                <Link
                  to={`/token/${token.id}`}
                  className="font-pixel text-[12px] text-[#FFD700] hover:underline mb-1 block"
                >
                  {token.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{token.symbol}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    AI:
                    {token.aiStatus === "working" ? (
                      <Heart className="w-3 h-3 text-red-500 fill-red-500 heart-beat" />
                    ) : (
                      <Heart className="w-3 h-3 text-gray-600 fill-gray-600" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 mt-2 sm:mt-0">
              <div className="text-left sm:text-right">
                <p className="font-vt text-2xl sm:text-3xl text-white">
                  ${token.price.toFixed(3)}
                </p>
                <p
                  className={`text-sm sm:text-base font-bold ${token.change.startsWith("+") ? "text-[#00FF41] glow-text animate-pulse" : "text-red-500"}`}
                >
                  {token.change}
                </p>
              </div>
              <div className="text-left sm:text-right hidden md:block">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">MCAP</p>
                <p className="font-vt text-lg sm:text-xl text-[#FFD700]">{token.mcap}</p>
              </div>
              <Link
                to={`/token/${token.id}`}
                className="bg-[#00FF41] text-black px-4 sm:px-6 py-2 rounded font-pixel text-[8px] sm:text-[10px] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all shrink-0"
              >
                买入
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
