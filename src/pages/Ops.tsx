import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Heart,
  MessageSquare,
  Users,
  Repeat,
  Activity,
} from "lucide-react";
import { useStore } from "../store/useStore";

export default function Ops() {
  const { createdTokens, updateAgentStrategy } = useStore();

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <Settings className="w-8 h-8 text-[#00FF41]" />
        <h1 className="font-pixel text-xl text-[#FFD700] glow-text-gold">
          运营中心 (OPS CENTER)
        </h1>
      </div>

      {createdTokens.length === 0 ? (
        <div className="bg-[#111] border border-[#333] rounded-lg p-12 text-center text-gray-500 font-pixel text-[12px]">
          暂无运营中的代币，请先去 [发币] 页面创建。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {createdTokens.map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111] border border-[#333] rounded-lg p-6 hover:border-[#00FF41] transition-colors glow-box flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black border border-[#333] rounded flex items-center justify-center font-pixel text-[8px] text-[#00FF41]">
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
                <div className="flex items-center gap-2 bg-black border border-[#333] px-3 py-1 rounded">
                  <span className="text-xs text-gray-500">AI STATUS</span>
                  {token.aiStatus === "working" ? (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 heart-beat" />
                  ) : (
                    <Heart className="w-4 h-4 text-gray-600 fill-gray-600" />
                  )}
                </div>
              </div>

              {/* AI Work Report */}
              <div className="bg-black border border-[#333] rounded p-4">
                <h3 className="font-pixel text-[10px] text-[#00FF41] mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> AI 工作报告 (24H)
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <MessageSquare className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold">
                      {token.aiStats?.tweets || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">发推数</p>
                  </div>
                  <div>
                    <Repeat className="w-5 h-5 mx-auto mb-2 text-green-400" />
                    <p className="text-2xl font-bold">
                      {token.aiStats?.replies || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">回复数</p>
                  </div>
                  <div>
                    <Users className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold">
                      +{token.aiStats?.newFollowers || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">新粉数</p>
                  </div>
                </div>
              </div>

              {/* Strategy Adjustment */}
              <div className="mt-auto">
                <label className="block text-xs text-gray-400 mb-2">
                  当前策略 (CURRENT STRATEGY)
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-black border border-[#333] rounded p-2 text-[#00FF41] focus:outline-none focus:border-[#00FF41] font-vt text-lg"
                    value={token.strategy}
                    onChange={(e) =>
                      updateAgentStrategy(token.id, e.target.value)
                    }
                  >
                    <option value="Aggressive Growth">
                      激进增长 (Aggressive Growth)
                    </option>
                    <option value="Defensive Hold">
                      防守持有 (Defensive Hold)
                    </option>
                    <option value="Community Engagement">
                      社区互动 (Community Engagement)
                    </option>
                    <option value="Market Making">
                      做市护盘 (Market Making)
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
