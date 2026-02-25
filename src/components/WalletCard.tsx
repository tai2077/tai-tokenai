import React from "react";
import { Copy } from "lucide-react";
import { useStore } from "../store/useStore";
import { copyText } from "../lib/clipboard";
import { formatNumber } from "../lib/number";

interface Action {
    label: string;
    onClick: () => void;
    primary?: boolean;
}

interface WalletCardProps {
    icon: string;
    title: string;
    subtitle: string;
    address: string | null;
    balance: number;
    status: string;
    statusColor?: string;
    extraStats?: React.ReactNode;
    actions: Action[];
}

export const WalletCard = React.memo(({
    icon,
    title,
    subtitle,
    address,
    balance,
    status,
    statusColor = "text-[#00FF41]",
    extraStats,
    actions,
}: WalletCardProps) => {
    const addToast = useStore((state) => state.addToast);

    const handleCopy = async () => {
        if (address) {
            const copied = await copyText(address);
            addToast(copied ? "地址已复制" : "复制失败，请手动复制", copied ? "success" : "error");
        }
    };

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "未连接";

    return (
        <div className="border border-[#333] bg-[#111]/80 backdrop-blur-md p-4 font-vt relative group">
            <div className="absolute inset-0 border border-[#00FF41] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF41] opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41] opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF41] opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF41] opacity-50" />

            <h3 className="font-pixel text-[10px] text-gray-400 mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2">
                    <span>{icon}</span> {title}
                </span>
                <span>{subtitle}</span>
            </h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">地址:</span>
                    <div className="flex items-center gap-2">
                        <span className={address ? "text-[#00FF41]" : "text-gray-500"}>
                            {shortAddress}
                        </span>
                        {address && (
                            <button
                                onClick={handleCopy}
                                aria-label="复制钱包地址"
                                className="text-gray-500 hover:text-[#00FF41] transition-colors"
                                title="复制"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#333]">
                    <span className="text-gray-500">余额:</span>
                    <span className="text-[#00FF41] text-lg font-bold glow-text">
                        {formatNumber(balance)} TAI
                    </span>
                </div>

                {extraStats}

                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-500">状态:</span>
                    <span className={`flex items-center gap-2 ${statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {actions.map((action, i) => (
                    <button
                        key={`${action.label}-${i}`}
                        onClick={action.onClick}
                        className={`py-2 px-2 text-center font-pixel text-[8px] sm:text-[10px] border transition-colors ${action.primary
                            ? "border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black glow-box"
                            : "border-[#333] text-gray-400 hover:border-[#00FF41] hover:text-[#00FF41]"
                            } ${actions.length === 1 || (actions.length === 3 && i === 2) ? "col-span-2" : ""}`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default WalletCard;
