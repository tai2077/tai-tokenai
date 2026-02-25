import React, { useState } from "react";
import { Bot, Target, TrendingUp, Grid, Play, Pause, Activity } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export default function Trade() {
    const [strategy, setStrategy] = useState("sniper");
    const [active, setActive] = useState(true);
    const [maxTrade, setMaxTrade] = useState("100");
    const [stopLoss, setStopLoss] = useState("5");

    const strategies = [
        {
            id: "sniper",
            name: "🎯 新币狙击",
            desc: "风险高，收益高",
        },
        {
            id: "trend",
            name: "📈 趋势跟踪",
            desc: "风险中，收益稳定",
        },
        {
            id: "grid",
            name: "🔄 网格交易",
            desc: "风险低，收益稳定",
        },
    ];

    const history = [
        { time: "10:23", text: "买入 PEPE +500 USDT" },
        { time: "09:45", text: "卖出 DOGE +2.3%" },
        { time: "08:12", text: "买入 SHIB +100 USDT" },
    ];

    return (
        <div className="max-w-md mx-auto flex flex-col gap-6 pb-20 font-vt">
            <PageHeader
                title="AI 自动交易"
                icon={<Bot className="w-6 h-6" />}
                color="green"
            />

            <div className="bg-[#111] border border-[#333] rounded-lg p-6 glow-box flex flex-col gap-4 text-center">
                <h2 className="text-gray-500 text-sm">交易资产</h2>
                <div className="text-4xl text-[#00FF41] font-bold glow-text">
                    $1,234.56
                </div>
                <div className="text-sm text-[#00FF41]">+$23.45 (+1.9%) 今日</div>

                <div className="w-full mt-2 text-left">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>仓位使用</span>
                        <span>75%</span>
                    </div>
                    <div className="h-2 w-full bg-[#333] rounded overflow-hidden">
                        <div className="h-full bg-[#00FF41] hp-bar-fill" style={{ width: "75%" }} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-500">选择策略:</label>
                <div className="flex flex-col gap-2">
                    {strategies.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStrategy(s.id)}
                            className={`flex flex-col items-start p-4 border transition-colors ${strategy === s.id
                                ? "border-[#00FF41] bg-[#00FF41]/5 glow-box"
                                : "border-[#333] hover:border-[#00FF41]"
                                }`}
                        >
                            <div className="flex justify-between w-full mb-1">
                                <span className="text-white font-pixel text-[10px] flex items-center gap-2">
                                    {strategy === s.id && <span className="text-[#00FF41]">✓</span>}
                                    {s.name}
                                </span>
                            </div>
                            <span className="text-gray-500 text-sm">{s.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-lg p-6 flex flex-col gap-4">
                <h3 className="font-pixel text-[10px] text-white">风险设置</h3>

                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">单笔最大 (USDT):</label>
                    <input
                        type="number"
                        value={maxTrade}
                        onChange={(e) => setMaxTrade(e.target.value)}
                        className="w-24 bg-black border border-[#333] p-1 text-center text-[#00FF41] outline-none"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">每日止损 (%):</label>
                    <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        className="w-24 bg-black border border-[#333] p-1 text-center text-[#ff4444] outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 justify-between">
                <div className="text-sm">
                    <span className="text-gray-500">AI 状态: </span>
                    <span className={`flex items-center gap-2 inline-flex ${active ? "text-[#00FF41]" : "text-[#ff4444]"}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {active ? "运行中" : "已暂停"}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActive(!active)}
                        className={`py-2 px-4 flex items-center gap-2 border font-pixel text-[10px] transition-colors ${active
                            ? "border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444] hover:text-black"
                            : "border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black glow-box"
                            }`}
                    >
                        {active ? <><Pause className="w-4 h-4" /> 暂停</> : <><Play className="w-4 h-4" /> 启动</>}
                    </button>
                    <button className="py-2 px-4 flex items-center gap-2 border border-[#333] text-gray-400 hover:border-white hover:text-white transition-colors font-pixel text-[10px]">
                        <Activity className="w-4 h-4" /> 记录
                    </button>
                </div>
            </div>

            <div className="bg-[#111] border border-[#333] rounded-lg p-4">
                <h3 className="font-pixel text-[10px] text-gray-400 mb-4">最近交易</h3>
                <ul className="space-y-4 text-sm">
                    {history.map((h) => (
                        <li key={`${h.time}-${h.text}`} className="flex gap-4">
                            <span className="text-gray-600">[{h.time}]</span>
                            <span className="text-white relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-[#00FF41] before:rounded-full">
                                {h.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
