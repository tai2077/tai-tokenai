"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Wallet,
  Trophy,
  Star,
  Shield,
  Swords,
  Skull,
  Coins,
  Zap,
  Users,
  Copy,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useStore";
import WalletCard from "../components/WalletCard";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { copyText } from "../lib/clipboard";
import { formatNumber } from "../lib/number";

export default function Profile() {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const { totalAssets, maxAssets, holdings, createdTokens, marketTokens, mainWallet, aiWallet, addToast } =
    useStore();

  const user = {
    address: "0x1A2...3B4",
    level: 42,
    title: "赛博朋克",
    achievements: [
      {
        id: 1,
        name: "FIRST BLOOD",
        desc: "First profitable trade",
        icon: <Swords className="w-6 h-6" />,
        unlocked: true,
      },
      {
        id: 2,
        name: "WHALE HUNTER",
        desc: "Liquidate a whale",
        icon: <Skull className="w-6 h-6" />,
        unlocked: true,
      },
      {
        id: 3,
        name: "DIAMOND HANDS",
        desc: "Hold through -50% dip",
        icon: <Shield className="w-6 h-6" />,
        unlocked: false,
      },
      {
        id: 4,
        name: "HIGH ROLLER",
        desc: "Volume > $1M",
        icon: <Star className="w-6 h-6" />,
        unlocked: false,
      },
    ],
  };

  const getHoldingDetails = (tokenId: string, amount: number) => {
    const token = [...marketTokens, ...createdTokens].find(
      (t) => t.id === tokenId,
    );
    if (!token) return null;
    return {
      symbol: token.symbol,
      amount: formatNumber(amount),
      value: `$${formatNumber(amount * token.price, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };
  };

  const handleCopyAddress = async () => {
    const copiedOk = await copyText(user.address);
    if (!copiedOk) {
      addToast("复制失败，请手动复制", "error");
      return;
    }
    setCopied(true);
    addToast("地址已复制", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <PageHeader
        title="我的 (PROFILE)"
        icon={<User className="w-6 h-6" />}
        color="gold"
      />

      {/* Dual Wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletCard
          title="主钱包 (MY WALLET)"
          icon="👤"
          subtitle=""
          address={mainWallet.address}
          balance={mainWallet.balance}
          status={mainWallet.connected ? "已连接" : "未连接"}
          actions={[
            { label: "充值", onClick: () => router.push("/deposit") },
            { label: "提现到这里", onClick: () => router.push("/withdraw") },
          ]}
        />

        <WalletCard
          title="AI 钱包 (AI WALLET)"
          icon="🤖"
          subtitle=""
          address={aiWallet.address}
          balance={aiWallet.balance}
          status={aiWallet.status === "active" ? "运行中" : "已冻结"}
          extraStats={
            <div className="flex justify-between items-center pb-2 border-b border-[#333] text-xs">
              <span className="text-gray-500">今日已用:</span>
              <span className="text-white">
                {aiWallet.dailySpent} TAI / {aiWallet.dailyLimit} TAI
              </span>
            </div>
          }
          actions={[
            { label: "充值到 AI", onClick: () => router.push("/deposit"), primary: true },
            { label: "从 AI 提现", onClick: () => router.push("/withdraw") },
            { label: "自动设置", onClick: () => router.push("/auto-withdraw") },
          ]}
        />
      </div>

      {/* Header Info */}
      <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-6 hover:border-[#00FF41] transition-colors glow-box flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 border-2 border-[#00FF41] bg-black p-1 shrink-0 relative">
          <img
            src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Player1&backgroundColor=000000"
            alt="Avatar"
            className="w-full h-full"
          />
          <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#FFD700] text-[#FFD700] text-[8px] font-pixel px-1">
            LVL {user.level}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-pixel text-[14px] text-[#00FF41] mb-2">
            {user.title}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
            <Wallet className="w-4 h-4" />
            <span className="font-vt text-lg">{user.address}</span>
            <button
              onClick={handleCopyAddress}
              className={`text-xs flex items-center gap-1 transition-all ${copied ? "text-[#00FF41] scale-110" : "hover:text-[#00FF41] hover:scale-105 active:scale-95"}`}
            >
              {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>

          {/* HP Bar */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-pixel text-[8px]">TOTAL ASSETS (HP)</span>
              <span className="text-[#FFD700]">
                ${formatNumber(totalAssets)} / ${formatNumber(maxAssets)}
              </span>
            </div>
            <div className="h-4 bg-[#333] rounded overflow-hidden">
              <div
                className="h-full hp-bar-fill"
                style={{
                  width: `${(totalAssets / maxAssets) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Holdings & Created Tokens */}
        <div className="flex flex-col gap-6">
          {/* Holdings */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box">
            <h3 className="font-pixel text-[10px] text-[#FFD700] mb-4 flex items-center gap-2">
              <Coins className="w-4 h-4" /> 我的持仓 (HOLDINGS)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-500 border-b border-[#333] pb-2">
                <span>TOKEN</span>
                <span>AMOUNT</span>
                <span>VALUE</span>
              </div>
              {holdings.length === 0 ? (
                <EmptyState message="暂无持仓资产" />
              ) : (
                holdings.map((h) => {
                  const details = getHoldingDetails(h.tokenId, h.amount);
                  if (!details) return null;
                  return (
                    <div
                      key={h.tokenId}
                      className="flex justify-between text-sm items-center"
                    >
                      <span className="text-[#00FF41]">{details.symbol}</span>
                      <span className="text-white">{details.amount}</span>
                      <span className="text-gray-400">{details.value}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Created Tokens */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box">
            <h3 className="font-pixel text-[10px] text-[#FFD700] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> 我创建的代币 (CREATED)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-500 border-b border-[#333] pb-2">
                <span>NAME</span>
                <span>SYMBOL</span>
                <span>MCAP</span>
              </div>
              {createdTokens.length === 0 ? (
                <EmptyState message="暂无创建的代币" />
              ) : (
                createdTokens.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between text-sm items-center"
                  >
                    <Link
                      href={`/token/${t.id}`}
                      className="text-[#00FF41] hover:underline"
                    >
                      {t.name}
                    </Link>
                    <span className="text-white">{t.symbol}</span>
                    <span className="text-[#FFD700]">{t.mcap}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-[#333] rounded-lg p-4 hover:border-[#00FF41] transition-colors glow-box flex flex-col">
          <h3 className="font-pixel text-[10px] text-[#FFD700] mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> 成就徽章墙 (ACHIEVEMENTS)
          </h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {user.achievements.map((ach) => (
              <motion.div
                key={ach.id}
                whileHover={{ scale: 1.05 }}
                className={`border p-4 flex flex-col items-center text-center gap-2 rounded-lg transition-colors ${ach.unlocked
                  ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] glow-box-gold"
                  : "border-[#333] bg-black text-gray-600 grayscale"
                  }`}
              >
                <div className="mb-2">{ach.icon}</div>
                <div className="font-pixel text-[8px] leading-tight">
                  {ach.name}
                </div>
                <div className="text-xs mt-1">{ach.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
