import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  DollarSign,
  ArrowDownToLine,
  Activity,
  TerminalSquare,
  Heart
} from "lucide-react";
import { useStore } from "../store/useStore";
import { SkeletonCard } from "../components/Skeleton";
import PullToRefresh from "../components/PullToRefresh";
import { PageHeader } from "../components/PageHeader";
import { X } from "lucide-react";

export default function Dashboard() {
  const [revenue, setRevenue] = useState(1234.56);
  const { totalAssets, maxAssets, aiAgents, liveFeed } = useStore();

  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [flashRevenue, setFlashRevenue] = useState(false);

  useEffect(() => {
    const isDone = localStorage.getItem("tai_onboarding_done");
    if (!isDone) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("tai_onboarding_done", "true");
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRevenue((prev) => prev + Math.random() * 2);
      setFlashRevenue(true);
      setTimeout(() => setFlashRevenue(false), 1000);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex flex-col gap-6 pb-20">
        {/* Header */}
        <PageHeader
          title="作战 (OPERATIONS)"
          color="gold"
          rightElement={
            <span className="font-pixel text-[8px] border border-[#333] px-2 py-1 rounded bg-[#111] text-gray-400">
              LVL 42
            </span>
          }
        />

        {/* Onboarding Banner */}
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#00FF41]/10 border border-[#00FF41] rounded-lg p-4 relative glow-box mb-2"
          >
            <button
              onClick={dismissOnboarding}
              className="absolute top-2 right-2 text-[#00FF41] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-pixel text-[10px] text-[#00FF41] mb-2 flex items-center gap-2">
              <TerminalSquare className="w-4 h-4" /> SYS.MESSAGE
            </h3>
            <p className="font-vt text-sm sm:text-base text-gray-200">
              <span className="typing-text">WELCOME TO TAI NETWORK 欢迎加入。请先关联你的 TON 钱包。</span>
            </p>
          </motion.div>
        )}

        {/* HP Bar (Total Assets) */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-pixel text-[10px]">TOTAL ASSETS (HP)</span>
            <span className="text-[#FFD700]">
              ${Number(totalAssets || 0).toLocaleString()} / ${Number(maxAssets || 0).toLocaleString()}
            </span>
          </div>
          {loading ? (
            <div className="mt-4 mb-8">
              <SkeletonCard />
            </div>
          ) : (
            <>
              <div className="h-4 bg-[#333] rounded overflow-hidden">
                <div
                  className="h-full hp-bar-fill"
                  style={{ width: `${(totalAssets / maxAssets) * 100}%` }}
                ></div>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 mb-1">TODAY'S YIELD</p>
                  <p className="text-2xl text-[#00FF41] glow-text">
                    +${revenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">WIN RATE</p>
                  <p className="text-xl">68.5%</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/launch"
            className="bg-[#00FF41] text-black rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-pixel text-[10px]"
          >
            <Rocket className="w-6 h-6" />
            <span>发币</span>
          </Link>
          <button className="bg-[#111]/80 backdrop-blur-md border border-[#333] text-[#00FF41] rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:border-[#00FF41] hover:bg-[#00FF41]/10 transition-all font-pixel text-[10px]">
            <DollarSign className="w-6 h-6" />
            <span>投资</span>
          </button>
          <button className="bg-[#111]/80 backdrop-blur-md border border-[#333] text-[#00FF41] rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:border-[#00FF41] hover:bg-[#00FF41]/10 transition-all font-pixel text-[10px]">
            <ArrowDownToLine className="w-6 h-6" />
            <span>提现</span>
          </button>
        </div>

        {/* AI Legion Status */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-pixel text-[10px] text-[#FFD700] flex items-center gap-2">
              <Activity className="w-4 h-4" /> AI 军团状态
            </h2>
            <Link to="/ops" className="text-xs underline hover:text-[#FFD700]">
              管理 &gt;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiAgents.map((ai) => (
              <div
                key={ai.id}
                className="border border-[#333] rounded p-2 flex items-center justify-between"
              >
                <div className="flex gap-2 items-center">
                  <img src={ai.avatar} alt={ai.name} className="w-8 h-8 rounded shrink-0 bg-[#0a0a0c] border border-[#333]" />
                  <div>
                    <p className="font-pixel text-[8px] mb-1">{ai.name}</p>
                    <p className="text-xs text-gray-500">{ai.role}</p>
                  </div>
                </div>
                {ai.status === "working" ? (
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 heart-beat" />
                ) : (
                  <Heart className="w-4 h-4 text-gray-600 fill-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors flex-1 min-h-[200px]">
          <h2 className="font-pixel text-[10px] text-[#FFD700] mb-4">
            实时动态 (LIVE FEED)
          </h2>
          <div className="space-y-3 text-sm">
            {liveFeed.map((feed) => (
              <div
                key={feed.id}
                className="flex gap-2 items-center border-b border-[#333] pb-2 last:border-0"
              >
                <span className="text-gray-500 shrink-0 text-xs mt-0.5">[{feed.time}]</span>
                {feed.avatar && (
                  <img src={feed.avatar} alt="avatar" className="w-6 h-6 rounded shrink-0 bg-[#0a0a0c] border border-[#333]" />
                )}
                <span
                  className={`flex-1 ${feed.type === "trade"
                    ? "text-[#00FF41]"
                    : feed.type === "scout"
                      ? "text-[#3B82F6]"
                      : feed.type === "mine"
                        ? "text-[#F59E0B]"
                        : feed.type === "launch"
                          ? "text-[#FFD700] glow-text-gold"
                          : "text-[#8B5CF6]"
                    }`}
                >
                  {feed.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
