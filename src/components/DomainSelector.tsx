import { useEffect, useRef, useState } from "react";
import { Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface DomainSelectorProps {
    value: string;
    onChange: (domain: string) => void;
    type: "free" | "premium";
    onTypeChange: (type: "free" | "premium") => void;
    onStatusChange?: ((status: { available: boolean | null; price: number; reason?: string }) => void) | undefined;
}

export function DomainSelector({
    value,
    onChange,
    type,
    onTypeChange,
    onStatusChange,
}: DomainSelectorProps) {
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [price, setPrice] = useState(0);
    const [reason, setReason] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);
    const statusCallbackRef = useRef(onStatusChange);

    useEffect(() => {
        statusCallbackRef.current = onStatusChange;
    }, [onStatusChange]);

    const emitStatus = (status: { available: boolean | null; price: number; reason?: string }) => {
        statusCallbackRef.current?.(status);
    };

    useEffect(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
        }
        const domain = value.trim().toLowerCase();
        if (!domain) {
            setAvailable(null);
            setReason(null);
            setPrice(0);
            emitStatus({ available: null, price: 0 });
            return;
        }

        timerRef.current = window.setTimeout(async () => {
            setChecking(true);
            try {
                const response = await fetch(
                    `/api/domain/check?name=${encodeURIComponent(domain)}&type=${type}`,
                );
                const payload = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(payload.error || "域名检查失败");
                }
                const nextAvailable =
                    typeof payload.available === "boolean" ? payload.available : false;
                const nextPrice = typeof payload.price === "number" ? payload.price : 0;
                const nextReason =
                    typeof payload.reason === "string" && payload.reason ? payload.reason : null;
                setAvailable(nextAvailable);
                setPrice(nextPrice);
                setReason(nextReason);
                emitStatus({
                    available: nextAvailable,
                    price: nextPrice,
                    reason: nextReason || undefined,
                });
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "域名检查失败";
                setAvailable(false);
                setReason(message);
                setPrice(0);
                emitStatus({
                    available: false,
                    price: 0,
                    reason: message,
                });
            } finally {
                setChecking(false);
            }
        }, 350);

        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [value, type]);

    const validationBorderClass =
        value && available === false
            ? "border-red-500"
            : "border-[#333] focus:border-[#00FF41]";

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${type === 'free' ? 'border-[#00FF41] bg-[#00FF41]/10' : 'border-[#333] bg-[#1a1a1a] hover:bg-[#222]'}`}
                >
                    <input
                        type="radio"
                        name="domainType"
                        checked={type === 'free'}
                        onChange={() => onTypeChange("free")}
                        className="hidden"
                    />
                    <Globe className={`w-5 h-5 ${type === 'free' ? 'text-[#00FF41]' : 'text-[#888]'}`} />
                    <div className="flex-1">
                        <div className="text-white font-medium">Free Subdomain</div>
                        <div className="text-xs text-[#888] mt-1">.tai.lat (Free)</div>
                    </div>
                </label>

                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${type === 'premium' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-[#333] bg-[#1a1a1a] hover:bg-[#222]'}`}
                >
                    <input
                        type="radio"
                        name="domainType"
                        checked={type === 'premium'}
                        onChange={() => onTypeChange("premium")}
                        className="hidden"
                    />
                    <Globe className={`w-5 h-5 ${type === 'premium' ? 'text-[#FFD700]' : 'text-[#888]'}`} />
                    <div className="flex-1">
                        <div className="text-white font-medium">Premium Domain</div>
                        <div className="text-xs text-[#888] mt-1">.tai.lat (100 TAI/yr)</div>
                    </div>
                </label>
            </div>

            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]">
                    https://
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-app-name"
                    className={`w-full bg-[#111] border ${validationBorderClass} rounded-xl py-4 pl-20 pr-[8rem] text-white outline-none font-vt text-lg transition-colors`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[#888]">.tai.lat</span>
                    {value && (
                        checking ? (
                            <Loader2 className="w-5 h-5 text-[#888] animate-spin" />
                        ) : available ? (
                            <CheckCircle className="w-5 h-5 text-[#00FF41]" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )
                    )}
                </div>
            </div>
            {value && (
                <div className="text-xs">
                    {checking && <span className="text-[#888]">检查域名可用性中...</span>}
                    {!checking && available && (
                        <span className="text-[#00FF41]">
                            域名可用 {type === "premium" && price > 0 ? `· 价格 ${price} TAI/年` : "· 免费"}
                        </span>
                    )}
                    {!checking && available === false && (
                        <span className="text-red-500">{reason || "域名不可用"}</span>
                    )}
                </div>
            )}
        </div>
    );
}
