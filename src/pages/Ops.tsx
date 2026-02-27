"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Heart,
  MessageSquare,
  Users,
  Repeat,
  Activity,
  Cpu,
  TerminalSquare
} from "lucide-react";
import { useStore, type AgentRole } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";

import { AIAvatar } from "../components/AIAvatar";
import PixelOfficeApp from "../components/pixel-office/App";
import "../components/pixel-office/index.css";
import { MockHost } from "../../app/c2c/office/MockHost";

// Feature Flag: Toggle Pixel Agents 1:1 Experience
const PIXEL_OPS_ENABLED = true;

export default function Ops() {
  const { createdTokens, aiAgents, updateAgentStrategy } = useStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (PIXEL_OPS_ENABLED) {
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 100px)', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <MockHost />
        <PixelOfficeApp />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="运营中心 (OPS CENTER)"
        icon={<Settings className="w-6 h-6" />}
        color="gold"
      />

      {/* --- Section 1: AI Legion Console --- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-[#00FF41]" />
          <h2 className="font-pixel text-[12px] text-[#00FF41] glow-text">AI 军团 (AI LEGION)</h2>
        </div>

        {aiAgents.length === 0 ? (
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 text-center text-sm text-gray-500 font-vt">
            NO AGENTS DEPLOYED.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111]/80 backdrop-blur border border-[#333] rounded p-4 flex flex-col gap-3 hover:border-[#FFD700] hover:shadow-[inset_0_0_15px_rgba(255,215,0,0.15)] transition-all relative overflow-hidden"
              >
                {/* CRT Scanline effect on card */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />

                <div className="flex justify-between items-start z-10">
                  <div className="flex gap-3 items-center">
                    {/* The Animated Pixel Avatar */}
                    <div className="relative">
                      <AIAvatar avatar={agent.avatar} role={agent.role} status={agent.status} size="lg" className="rounded shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                      <div className="absolute top-0 right-0 w-2 h-2 bg-black m-1 z-30 rounded-sm border border-[#333] flex items-center justify-center">
                        <div className={`w-1 h-1 rounded-full ${agent.status === "working" ? "bg-[#00FF41] animate-[pulse_1s_infinite]" : "bg-gray-600"}`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-[10px] text-white">{agent.name}</h3>
                      <p className="text-[10px] text-[#FFD700] font-vt uppercase tracking-wider mt-1">{agent.role} • LV.{agent.level}</p>
                    </div>
                  </div>
                  <div className="bg-black border border-[#333] px-2 py-1 flex items-center gap-2 rounded-sm">
                    {agent.status === "working" ? (
                      <Heart className="w-3 h-3 text-red-500 fill-red-500 heart-beat" />
                    ) : (
                      <Heart className="w-3 h-3 text-gray-600 fill-gray-600" />
                    )}
                  </div>
                </div>

                <div className="bg-black border border-[#333] rounded p-3 text-xs flex flex-col gap-2 z-10 font-vt">
                  <div className="flex justify-between text-gray-400">
                    <span>效率输出:</span>
                    <span className="text-[#00FF41]">{agent.output}</span>
                  </div>
                  <div className="w-full h-[1px] bg-[#333]" />
                  <p className="text-gray-300 line-clamp-2 h-8 leading-snug break-all">{agent.quote}</p>
                </div>

                {/* Action Row */}
                <div className="flex gap-2 z-10">
                  <button className="flex-1 bg-[#222] border border-[#333] hover:border-[#00FF41] hover:text-[#00FF41] text-gray-400 text-[10px] font-pixel py-2 rounded transition-colors">
                    UPGRADE
                  </button>
                  <button className="flex-1 bg-[#222] border border-[#333] hover:border-[#FFD700] hover:text-[#FFD700] text-gray-400 text-[10px] font-pixel py-2 rounded transition-colors">
                    {agent.status === 'working' ? 'SLEEP' : 'WAKE'}
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* --- Section 2: Token Operations --- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TerminalSquare className="w-5 h-5 text-[#FFD700]" />
          <h2 className="font-pixel text-[12px] text-[#FFD700] glow-text-gold">策略控制台 (TOKEN STRATEGY)</h2>
        </div>

        {createdTokens.length === 0 ? (
          <EmptyState
            title="发射台静默"
            message="您目前没有管理中的代币资产，请前往 [市场] 或 [发射面板] 获取。"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdTokens.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111]/90 backdrop-blur border border-[#333] rounded-lg p-6 hover:border-[#FFD700] transition-colors glow-box-gold flex flex-col gap-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black border border-[#FFD700]/30 rounded flex items-center justify-center font-pixel text-[8px] text-[#FFD700]">
                      LOGO
                    </div>
                    <div>
                      <h2 className="font-pixel text-[12px] text-[#FFD700] mb-1">
                        {token.name}
                      </h2>
                      <span className="text-sm text-gray-400">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[#00FF41] font-vt text-lg">{token.change}</span>
                    <span className="text-xs text-gray-500 font-pixel">MCAP: {token.mcap}</span>
                  </div>
                </div>

                {/* AI Work Report */}
                <div className="bg-black border border-[#333] rounded p-4">
                  <h3 className="font-pixel text-[10px] text-[#FFD700] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> AI 营销数据 (24H)
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <MessageSquare className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                      <p className="text-2xl font-bold font-vt text-white">
                        {token.aiStats?.tweets || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">发推数</p>
                    </div>
                    <div>
                      <Repeat className="w-5 h-5 mx-auto mb-2 text-green-400" />
                      <p className="text-2xl font-bold font-vt text-white">
                        {token.aiStats?.replies || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">回复数</p>
                    </div>
                    <div>
                      <Users className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                      <p className="text-2xl font-bold font-vt text-white">
                        +{token.aiStats?.newFollowers || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">新粉数</p>
                    </div>
                  </div>
                </div>

                {/* Strategy Adjustment */}
                <div className="mt-auto">
                  <label className="block text-[10px] text-gray-400 mb-2 font-pixel">
                    AI 市场策略 (STRATEGY OVERRIDE)
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-3 cursor-pointer text-[#FFD700] focus:outline-none focus:border-[#FFD700] hover:border-gray-500 font-vt text-xl transition-all"
                      value={token.strategy}
                      onChange={(e) =>
                        updateAgentStrategy(token.id, e.target.value)
                      }
                    >
                      <option value="Aggressive Growth">
                        [!] 激进增长模式 (Aggressive Growth)
                      </option>
                      <option value="Defensive Hold">
                        [X] 防守护盘模式 (Defensive Hold)
                      </option>
                      <option value="Community Engagement">
                        [+] 社区深度互动 (Community Engagement)
                      </option>
                      <option value="Dormant / Holding">
                        [#] 休眠装死状态 (Dormant)
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
