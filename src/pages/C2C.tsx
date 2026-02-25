"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Star } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { formatNumber } from "../lib/number";

interface Order {
    id: string;
    seller: string;
    rating: number;
    price: number;
    amount: number;
    methods: string[];
}

export default function C2C() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"buy" | "sell" | "orders">("buy");

    const mockOrders: Order[] = [
        {
            id: "1",
            seller: "0x1A2...3B4",
            rating: 4.9,
            price: 0.72,
            amount: 10000,
            methods: ["支付宝", "微信"],
        },
        {
            id: "2",
            seller: "0x5C6...7D8",
            rating: 4.8,
            price: 0.71,
            amount: 5000,
            methods: ["支付宝"],
        },
    ];

    const handleBuy = (orderId: string) => {
        router.push(`/c2c/order/${orderId}`);
    };

    return (
        <div className="flex flex-col gap-6 pb-20 max-w-2xl mx-auto">
            <PageHeader
                title="C2C 交易"
                icon={<Coins className="w-6 h-6" />}
                color="gold"
            />

            <div className="flex border-b border-[#333]">
                <button
                    onClick={() => setActiveTab("buy")}
                    className={`flex-1 py-3 text-center font-pixel text-[10px] sm:text-xs transition-colors ${activeTab === "buy"
                        ? "text-[#00FF41] border-b-2 border-[#00FF41]"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    买入
                </button>
                <button
                    onClick={() => setActiveTab("sell")}
                    className={`flex-1 py-3 text-center font-pixel text-[10px] sm:text-xs transition-colors ${activeTab === "sell"
                        ? "text-[#ff4444] border-b-2 border-[#ff4444]"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    卖出
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex-1 py-3 text-center font-pixel text-[10px] sm:text-xs transition-colors ${activeTab === "orders"
                        ? "text-white border-b-2 border-white"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    我的订单
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {activeTab === "buy" &&
                    mockOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-[#111] border border-[#333] p-4 rounded-lg flex justify-between items-center hover:border-[#00FF41] transition-colors glow-box"
                        >
                            <div className="flex flex-col gap-2 font-vt">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-400">卖家: {order.seller}</span>
                                    <span className="text-[#FFD700] flex items-center gap-1 text-xs">
                                        <Star className="w-3 h-3 fill-current" /> {order.rating}
                                    </span>
                                </div>
                                <div className="text-lg">
                                    <span className="text-gray-500">价格:</span>{" "}
                                    <span className="text-[#00FF41] font-bold">
                                        ¥{order.price.toFixed(2)} / TAI
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500">数量:</span>{" "}
                                    <span className="text-white">
                                        {formatNumber(order.amount)} TAI
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 text-sm">支付:</span>
                                    {order.methods.map((m) => (
                                        <span
                                            key={m}
                                            className="px-2 py-0.5 border border-[#333] text-[10px] text-gray-300 rounded"
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => handleBuy(order.id)}
                                className="px-4 py-8 border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors font-pixel text-[10px]"
                            >
                                购买
                            </button>
                        </div>
                    ))}

                {activeTab === "sell" && (
                    <EmptyState message="暂无可匹配的买单" />
                )}

                {activeTab === "orders" && (
                    <EmptyState message="暂无历史订单" />
                )}
            </div>
        </div>
    );
}
