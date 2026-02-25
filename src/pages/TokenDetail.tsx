import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";

export default function TokenDetail() {
  const { address } = useParams();
  const navigate = useNavigate();
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState("");

  const {
    marketTokens,
    createdTokens,
    balances,
    holdings,
    buyToken,
    sellToken,
    addToast,
  } = useStore();

  const token = [...marketTokens, ...createdTokens].find(
    (t) => t.id === address,
  );
  const holding = holdings.find((h) => h.tokenId === address);
  const tokenBalance = holding ? holding.amount : 0;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 font-pixel">TOKEN NOT FOUND</p>
        <button
          onClick={() => navigate("/market")}
          className="text-[#00FF41] underline font-pixel text-[10px]"
        >
          RETURN TO MARKET
        </button>
      </div>
    );
  }

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast("请输入有效数量", "error");
      return;
    }

    if (tradeType === "BUY") {
      const cost = numAmount * token.price;
      if (cost > balances.USDT) {
        addToast("USDT 余额不足", "error");
        return;
      }
      buyToken(token.id, numAmount, cost);
    } else {
      if (numAmount > tokenBalance) {
        addToast(`${token.symbol} 余额不足`, "error");
        return;
      }
      const revenue = numAmount * token.price;
      sellToken(token.id, numAmount, revenue);
    }
    setAmount("");
  };

  const mockHolders = [
    { address: "0x1A2...3B4", amount: "150,000", percentage: "15%" },
    { address: "0x5C6...7D8", amount: "85,000", percentage: "8.5%" },
    { address: "0x9E0...1F2", amount: "42,000", percentage: "4.2%" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <PageHeader
        icon={
          <div className="flex items-center gap-4">
            <Link to="/market" className="text-gray-500 hover:text-[#FFD700] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-10 h-10 bg-black border border-[#333] rounded flex items-center justify-center font-pixel text-[6px] text-[#FFD700]">LOGO</div>
          </div>
        }
        title={
          <div className="flex flex-col ml-2 truncate">
            <span className="truncate">{token.name}</span>
            <span className="text-[10px] text-gray-400 font-pixel tracking-normal mt-1 truncate">{token.symbol}</span>
          </div>
        }
        color="gold"
        rightElement={
          <div className="text-right">
            <p className="font-vt text-2xl text-white">
              ${token.price.toFixed(3)}
            </p>
            <p className={`text-sm ${token.change.startsWith("+") ? "text-[#00FF41]" : "text-red-500"}`}>
              {token.change} (24H)
            </p>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & AI Status */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* AI Status Area */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box flex items-center gap-4">
            <div className="shrink-0">
              {token.aiStatus === "working" ? (
                <Heart className="w-8 h-8 text-red-500 fill-red-500 heart-beat" />
              ) : (
                <Heart className="w-8 h-8 text-gray-600 fill-gray-600" />
              )}
            </div>
            <div>
              <h3 className="font-pixel text-[10px] text-[#00FF41] mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4" /> AI 员工状态 (
                {token.aiStatus === "working" ? "ONLINE" : "OFFLINE"})
              </h3>
              <p className="text-sm text-gray-300 italic">
                {token.aiStatus === "working"
                  ? '"正在回复社区问题并分析市场情绪..."'
                  : '"休息中..."'}
              </p>
            </div>
          </div>

          {/* Chart Area (Mock) */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box h-[400px] flex flex-col">
            <h3 className="font-pixel text-[10px] text-gray-500 mb-4">
              K 线图 (CHART)
            </h3>
            <div className="flex-1 border border-[#333] bg-black relative overflow-hidden flex items-end p-4 gap-1">
              {/* Mock Candlesticks */}
              {Array.from({ length: 40 }).map((_, i) => {
                const isUp = Math.random() > 0.4;
                const height = Math.random() * 60 + 20;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end items-center group relative"
                  >
                    <div
                      className={`w-[1px] h-full absolute top-0 bottom-0 ${isUp ? "bg-[#00FF41]/30" : "bg-red-500/30"}`}
                    ></div>
                    <div
                      className={`w-full max-w-[8px] z-10 ${isUp ? "bg-[#00FF41]" : "bg-red-500"}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Trade & Holders */}
        <div className="flex flex-col gap-6">
          {/* Trade Panel */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setTradeType("BUY");
                  setAmount("");
                }}
                className={`flex-1 py-2 font-pixel text-[10px] rounded transition-colors ${tradeType === "BUY" ? "bg-[#00FF41] text-black shadow-[0_0_10px_rgba(0,255,65,0.3)]" : "bg-black border border-[#333] text-gray-500"}`}
              >
                买入 (BUY)
              </button>
              <button
                onClick={() => {
                  setTradeType("SELL");
                  setAmount("");
                }}
                className={`flex-1 py-2 font-pixel text-[10px] rounded transition-colors ${tradeType === "SELL" ? "bg-red-500 text-black shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-black border border-[#333] text-gray-500"}`}
              >
                卖出 (SELL)
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2 flex justify-between">
                  <span>支付 (PAY)</span>
                  <span>
                    余额:{" "}
                    {tradeType === "BUY"
                      ? `${balances.USDT.toLocaleString()} USDT`
                      : `${tokenBalance.toLocaleString()} ${token.symbol}`}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-[#333] rounded p-3 text-white focus:outline-none focus:border-[#00FF41] font-vt text-xl"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {tradeType === "BUY" ? "USDT" : token.symbol}
                  </span>
                </div>
              </div>
              <div className="flex justify-center text-gray-500">
                {tradeType === "BUY" ? (
                  <ArrowDownRight className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 flex justify-between">
                  <span>获得 (RECEIVE)</span>
                  <span>
                    余额:{" "}
                    {tradeType === "BUY"
                      ? `${tokenBalance.toLocaleString()} ${token.symbol}`
                      : `${balances.USDT.toLocaleString()} USDT`}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={
                      amount
                        ? tradeType === "BUY"
                          ? (parseFloat(amount) / token.price).toFixed(4)
                          : (parseFloat(amount) * token.price).toFixed(2)
                        : ""
                    }
                    readOnly
                    className="w-full bg-black border border-[#333] rounded p-3 text-white focus:outline-none focus:border-[#00FF41] font-vt text-xl opacity-50 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {tradeType === "BUY" ? token.symbol : "USDT"}
                  </span>
                </div>
              </div>
              <button
                onClick={handleTrade}
                className={`w-full py-4 rounded font-pixel text-[12px] mt-4 transition-all ${tradeType === "BUY" ? "bg-[#00FF41] text-black hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]" : "bg-red-500 text-black hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"}`}
              >
                {tradeType === "BUY" ? "确认买入" : "确认卖出"}
              </button>
            </div>
          </div>

          {/* Holders List */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box flex-1">
            <h3 className="font-pixel text-[10px] text-[#FFD700] mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> 持仓者 (HOLDERS)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 border-b border-[#333] pb-2">
                <span className="w-1/3">ADDRESS</span>
                <span className="w-1/3 text-center">AMOUNT</span>
                <span className="w-1/3 text-right">%</span>
              </div>
              {mockHolders.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs sm:text-sm items-center"
                >
                  <span className="text-[#00FF41] w-1/3 truncate pr-2">{h.address}</span>
                  <span className="text-white w-1/3 text-center truncate pr-2">{h.amount}</span>
                  <span className="text-gray-400 w-1/3 text-right">{h.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
