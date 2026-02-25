"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowDownToLine, Wallet } from "lucide-react";
import { useStore } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";
import { useTelegramBackButton } from "../hooks/useTelegramBackButton";
import { formatNumber } from "../lib/number";

export default function Deposit() {
    const router = useRouter();
    const { mainWallet, aiWallet, setMainWallet, setAiWallet, addToast } = useStore();
    const [amount, setAmount] = useState<string>("");
    const handleBack = useCallback(() => router.back(), [router]);

    const quickAmounts = [100, 500, 1000];

    useTelegramBackButton(handleBack);

    const handleDeposit = () => {
        const numAmount = Number(amount);
        if (!numAmount || Number.isNaN(numAmount) || numAmount <= 0) {
            addToast("请输入有效金额", "error");
            return;
        }
        if (numAmount > mainWallet.balance) {
            addToast("余额不足", "error");
            return;
        }

        setMainWallet({ balance: mainWallet.balance - numAmount });
        setAiWallet({ balance: aiWallet.balance + numAmount });
        addToast(`成功充值 ${numAmount} TAI 到 AI 钱包`, "success");
        handleBack();
    };

    return (
        <div className="max-w-md mx-auto flex flex-col gap-6 pb-20">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-[#00FF41] transition-colors self-start"
            >
                <ArrowLeft className="w-4 h-4" /> 返回
            </button>

            <PageHeader
                title="充值到 AI 钱包"
                icon={<ArrowDownToLine className="w-6 h-6" />}
                color="green"
            />

            <div className="bg-[#111] border border-[#333] rounded-lg p-6 glow-box flex flex-col gap-6">
                <div className="flex flex-col gap-2 border-b border-[#333] pb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">从:</span>
                        <span className="text-white flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-gray-400" /> 主钱包 (余额: {formatNumber(mainWallet.balance)} TAI)
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">到:</span>
                        <span className="text-[#00FF41]">🤖 AI 钱包</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">金额:</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-black border border-[#333] p-4 text-xl text-[#00FF41] focus:border-[#00FF41] outline-none font-vt text-right pr-16"
                            placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-pixel text-[10px]">
                            TAI
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">快捷金额:</label>
                    <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map((q) => (
                            <button
                                key={q}
                                onClick={() => setAmount(String(q))}
                                className="py-2 border border-[#333] text-gray-400 hover:border-[#00FF41] hover:text-[#00FF41] transition-colors font-vt"
                            >
                                {q}
                            </button>
                        ))}
                        <button
                            onClick={() => setAmount(String(mainWallet.balance))}
                            className="py-2 border border-[#333] text-gray-400 hover:border-[#00FF41] hover:text-[#00FF41] transition-colors font-vt"
                        >
                            全部
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleDeposit}
                    disabled={!amount || Number(amount) <= 0}
                    className="mt-4 w-full py-4 text-center font-pixel text-xs border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-box"
                >
                    确认充值
                </button>
            </div>
        </div>
    );
}
