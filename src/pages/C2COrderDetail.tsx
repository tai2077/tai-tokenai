"use client";

import React, { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Copy, AlertTriangle } from "lucide-react";
import { useStore } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";
import { copyText } from "../lib/clipboard";
import { useTelegramBackButton } from "../hooks/useTelegramBackButton";
import { formatNumber } from "../lib/number";

export default function C2COrderDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const addToast = useStore((state) => state.addToast);
    const handleBack = useCallback(() => router.back(), [router]);

    useTelegramBackButton(handleBack);

    const mockOrder = {
        id: id || "1",
        status: "待付款",
        amount: 1000,
        totalPrice: 720.0,
        seller: {
            alipay: "138****1234",
            name: "张*",
        },
    };

    const handleCopy = async (text: string) => {
        const copied = await copyText(text);
        addToast(copied ? "已复制到剪贴板" : "复制失败，请手动复制", copied ? "success" : "error");
    };

    const handlePaid = () => {
        addToast("已通知卖家，请等待对方确认放币", "info");
        router.push("/c2c"); // Or update status and remain
    };

    return (
        <div className="max-w-md mx-auto flex flex-col gap-6 pb-20">
            <PageHeader
                icon={<button onClick={handleBack} aria-label="返回上一页" className="hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>}
                title="订单详情"
                color="green"
                rightElement={
                    <span className="text-[#FFD700] flex items-center gap-2 font-vt text-lg glow-text-gold">
                        <AlertTriangle className="w-5 h-5" /> {mockOrder.status}
                    </span>
                }
            />

            <div className="bg-[#111] border border-[#333] rounded-lg p-6 glow-box flex flex-col gap-6 font-vt">
                <div className="flex flex-col gap-2 border-b border-[#333] pb-4">
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-500">购买数量:</span>
                        <span className="text-white">
                            {formatNumber(mockOrder.amount)} TAI
                        </span>
                    </div>
                    <div className="flex justify-between text-xl">
                        <span className="text-gray-500">支付金额:</span>
                        <span className="text-[#00FF41] font-bold">
                            ¥{mockOrder.totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm text-gray-500">卖家收款方式:</label>
                    <div className="border border-[#333] p-4 bg-black flex justify-between items-center group hover:border-blue-500 transition-colors">
                        <div className="flex flex-col gap-1">
                            <span className="text-blue-400 font-bold">支付宝</span>
                            <span className="text-white tracking-widest text-lg">
                                {mockOrder.seller.alipay}
                            </span>
                            <span className="text-gray-400">
                                姓名: {mockOrder.seller.name}
                            </span>
                        </div>
                        <button
                            onClick={() => handleCopy(mockOrder.seller.alipay)}
                            aria-label="复制卖家账号"
                            className="p-2 border border-[#333] text-gray-500 hover:text-white hover:border-white transition-colors"
                            title="复制账号"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-[#ff4444]/10 border border-[#ff4444] p-3 text-[#ff4444] text-sm flex gap-2 items-start mt-4">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                        请在 <strong className="text-white font-bold text-lg">15分钟</strong>{" "}
                        内完成付款，付款时请勿备注任何数字货币相关信息。
                    </p>
                </div>

                <button
                    onClick={handlePaid}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-4 text-center font-pixel text-xs border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors glow-box"
                >
                    <CheckCircle2 className="w-5 h-5" /> 我已付款
                </button>
            </div>
        </div>
    );
}
