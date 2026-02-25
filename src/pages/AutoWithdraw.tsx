import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, ToggleRight, ToggleLeft } from "lucide-react";
import { useStore } from "../store/useStore";
import { PageHeader } from "../components/PageHeader";

export default function AutoWithdraw() {
    const navigate = useNavigate();
    const addToast = useStore((state) => state.addToast);

    const [enabled, setEnabled] = useState(false);
    const [threshold, setThreshold] = useState("1000");
    const [minSellAmount, setMinSellAmount] = useState("500");
    const [method, setMethod] = useState("alipay");
    const [account, setAccount] = useState("");

    const handleSave = () => {
        if (enabled && (!threshold || !minSellAmount || !account)) {
            addToast("开启自动提现时必须填写所有设置", "error");
            return;
        }
        // Update API or Store settings here
        addToast("自动提现设置已保存", "success");
        navigate(-1);
    };

    return (
        <div className="max-w-md mx-auto flex flex-col gap-6 pb-20 font-vt">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#00FF41] transition-colors self-start"
            >
                <ArrowLeft className="w-4 h-4" /> 返回
            </button>

            <PageHeader
                title="🤖 自动提现设置"
                icon={<Settings className="w-6 h-6" />}
                color="green"
            />

            <p className="text-gray-400 text-sm bg-[#111] p-4 border border-[#333] rounded-lg">
                开启后，AI 会在余额超过设定值时自动挂单卖出，
                卖出成功后，钱会自动转入你的绑定账户。全程无需操作，真正躺赚。
            </p>

            <div className="bg-[#111] border border-[#333] rounded-lg p-6 glow-box flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-[#333] pb-4">
                    <span className="text-white text-lg">开启自动提现:</span>
                    <button
                        onClick={() => setEnabled(!enabled)}
                        className={`transition-colors flex items-center gap-2 ${enabled ? "text-[#00FF41]" : "text-gray-500"
                            }`}
                    >
                        {enabled ? "已开启" : "已关闭"}
                        {enabled ? (
                            <ToggleRight className="w-10 h-10" />
                        ) : (
                            <ToggleLeft className="w-10 h-10" />
                        )}
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">
                        提现阈值 (当前 AI 钱包余额超过此值时自动提现):
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            disabled={!enabled}
                            className="w-full bg-black border border-[#333] p-4 text-xl text-[#00FF41] focus:border-[#00FF41] outline-none font-vt text-right pr-16 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-pixel text-[10px]">
                            TAI
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">最小卖出数量:</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={minSellAmount}
                            onChange={(e) => setMinSellAmount(e.target.value)}
                            disabled={!enabled}
                            className="w-full bg-black border border-[#333] p-4 text-xl text-[#00FF41] focus:border-[#00FF41] outline-none font-vt text-right pr-16 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-pixel text-[10px]">
                            TAI
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">收款方式:</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { id: "alipay", name: "支付宝" },
                            { id: "wechat", name: "微信" },
                            { id: "bank", name: "银行卡" },
                        ].map((m) => (
                            <button
                                key={m.id}
                                disabled={!enabled}
                                onClick={() => setMethod(m.id)}
                                className={`py-3 border font-vt transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${method === m.id
                                    ? "border-[#00FF41] text-[#00FF41] glow-box"
                                    : "border-[#333] text-gray-400 hover:border-[#00FF41]"
                                    }`}
                            >
                                {method === m.id ? "○ " : ""}
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">收款账号:</label>
                    <input
                        type="text"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        disabled={!enabled}
                        placeholder="例如支付宝手机号或微信账号"
                        className="w-full bg-black border border-[#333] p-4 text-lg text-white focus:border-[#00FF41] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 w-full py-4 text-center font-pixel text-xs border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors glow-box"
                >
                    保存设置
                </button>
            </div>
        </div>
    );
}
