"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Send, Code, Link as LinkIcon, ExternalLink } from "lucide-react";
import { DomainSelector } from "../../src/components/DomainSelector";
import { useStore } from "../../src/store/useStore";
import { useRouter } from "next/navigation";

const APP_TYPES = [
    { id: "lottery", label: "抽奖", icon: "🎰" },
    { id: "vote", label: "投票", icon: "📊" },
    { id: "game", label: "游戏", icon: "🎮" },
    { id: "tool", label: "工具", icon: "🔧" },
    { id: "display", label: "展示", icon: "📱" },
    { id: "other", label: "其他", icon: "✨" },
];

export default function BuilderPage() {
    const router = useRouter();
    const tokens = useStore((state) => [...state.marketTokens, ...state.createdTokens]);
    const createApp = useStore((state) => state.createApp);
    const addToast = useStore((state) => state.addToast);

    const [prompt, setPrompt] = useState("");
    const [appType, setAppType] = useState("other");
    const [bindToken, setBindToken] = useState<string>("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedApp, setGeneratedApp] = useState<{ code: string; previewUrl: string } | null>(null);

    const [modifyPrompt, setModifyPrompt] = useState("");

    const [subdomain, setSubdomain] = useState("");
    const [domainType, setDomainType] = useState<"free" | "premium">("free");
    const [isPublishing, setIsPublishing] = useState(false);
    const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
    const [domainPrice, setDomainPrice] = useState<number>(0);

    const handleDomainStatusChange = useCallback(
        (status: { available: boolean | null; price: number }) => {
            setDomainAvailable(status.available);
            setDomainPrice(status.price || 0);
        },
        [],
    );

    const handleGenerate = async () => {
        if (!prompt) return addToast("请描述你想要的应用", "error");
        setIsGenerating(true);
        try {
            const response = await fetch("/api/app/generate", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    appType,
                    tokenId: bindToken || undefined,
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload.error || "生成失败");
            }
            setGeneratedApp(payload as { code: string; previewUrl: string });
            addToast("AI 生成完毕！", "success");
        } catch (error) {
            addToast(error instanceof Error ? error.message : "生成失败，请稍后重试", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleModify = async () => {
        if (!modifyPrompt) return addToast("请输入修改需求", "error");
        if (!generatedApp?.code) return addToast("请先生成应用", "error");
        setIsGenerating(true);
        try {
            const response = await fetch("/api/app/modify", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    currentCode: generatedApp.code,
                    modification: modifyPrompt,
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload.error || "调整失败");
            }
            setGeneratedApp(payload as { code: string; previewUrl: string });
            setModifyPrompt("");
            addToast("代码修改完毕！", "success");
        } catch (error) {
            addToast(error instanceof Error ? error.message : "调整失败，请重试", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!generatedApp?.code) return addToast("请先生成应用", "error");
        if (!subdomain) return addToast("请输入你要发布的子域名", "error");
        if (subdomain.length < 3) return addToast("子域名过短", "error");
        if (domainAvailable === false) return addToast("该域名不可用，请更换", "error");
        setIsPublishing(true);
        try {
            const newApp = await createApp({
                name: subdomain.replace(/-/g, " "),
                description: prompt,
                category: appType as "lottery" | "vote" | "game" | "tool" | "display" | "other",
                code: generatedApp.code,
                subdomain,
                domainType,
                icon: APP_TYPES.find((item) => item.id === appType)?.icon || "📱",
                ...(bindToken ? { tokenId: bindToken } : {}),
            });
            addToast(
                domainType === "premium" && domainPrice > 0
                    ? `发布成功，已计费 ${domainPrice} TAI`
                    : "发布成功！",
                "success",
            );
            router.push(`/store/${newApp.id}`);
        } catch (e) {
            addToast(e instanceof Error ? e.message : "发布失败，请重试", "error");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-[#00FF41]" />
                <div>
                    <h1 className="text-3xl font-pixel text-white">APP BUILDER</h1>
                    <p className="text-[#888] mt-2">使用 AI 生成无需代码的 Web3 轻应用</p>
                </div>
            </div>

            {/* 第一步：生成设置 */}
            <section className="bg-[#111] p-6 rounded-2xl border border-[#333] space-y-6">
                <div>
                    <label className="block text-sm font-bold text-[#888] mb-3 uppercase tracking-wider">
                        1. 描述你的应用想法
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="例如：做一个抽奖转盘，中间写着 SPIN，背景是黑色和霓虹绿，抽中后会撒花..."
                        className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#00FF41] rounded-xl p-4 text-white h-32 outline-none resize-none transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-[#888] mb-3 uppercase tracking-wider">
                            应用类型
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {APP_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setAppType(type.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${appType === type.id
                                            ? "border-[#00FF41] bg-[#00FF41]/10 text-white"
                                            : "border-[#333] bg-[#1a1a1a] text-[#888] hover:bg-[#222]"
                                        }`}
                                >
                                    <span className="text-2xl">{type.icon}</span>
                                    <span className="text-xs font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#888] mb-3 uppercase tracking-wider">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> 绑定代币 (可选)
                                </span>
                            </div>
                        </label>
                        <select
                            value={bindToken}
                            onChange={(e) => setBindToken(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#00FF41] rounded-xl p-4 text-white outline-none appearance-none"
                        >
                            <option value="">🚫 不绑定代币</option>
                            <optgroup label="热门代币">
                                {tokens.filter(t => t.type === 'HOT').map((t) => (
                                    <option key={t.id} value={t.id}>{t.symbol} - {t.name}</option>
                                ))}
                            </optgroup>
                            <optgroup label="我的代币">
                                {tokens.filter(t => t.type === 'CREATED').map((t) => (
                                    <option key={t.id} value={t.id}>{t.symbol} - {t.name}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full bg-[#00FF41] text-black font-bold py-4 rounded-xl hover:bg-[#00FF41]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                    {isGenerating && !generatedApp ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    {isGenerating && !generatedApp ? "AI 正在编织代码..." : "生成应用"}
                </button>
            </section>

            {/* 第二步：预览与调整 */}
            {generatedApp && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] p-6 rounded-2xl border border-[#333] space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-[#888] uppercase tracking-wider flex items-center gap-2">
                            <Code className="w-4 h-4" /> 2. 预览与调整
                        </label>
                    </div>

                    <div className="bg-black border border-[#333] rounded-xl overflow-hidden relative" style={{ height: "400px" }}>
                        <iframe
                            src={generatedApp.previewUrl}
                            className="w-full h-full border-none"
                            title="Preview"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <a
                                href={generatedApp.previewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#111]/80 backdrop-blur p-2 rounded-lg text-white hover:text-[#00FF41] border border-[#333]"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={modifyPrompt}
                            onChange={(e) => setModifyPrompt(e.target.value)}
                            placeholder="需要调整吗？告诉 AI（例如：按钮换成红色，字体变大）"
                            className="flex-1 bg-[#1a1a1a] border border-[#333] focus:border-[#00FF41] rounded-xl px-4 text-white outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleModify()}
                        />
                        <button
                            onClick={handleModify}
                            disabled={isGenerating || !modifyPrompt}
                            className="px-6 bg-[#222] text-white border border-[#333] hover:border-[#00FF41] hover:text-[#00FF41] font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
                        >
                            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            调整
                        </button>
                    </div>
                </motion.section>
            )}

            {/* 第三步：发布 */}
            {generatedApp && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] p-6 rounded-2xl border border-[#333] space-y-6"
                >
                    <label className="block text-sm font-bold text-[#888] uppercase tracking-wider">
                        3. 选择域名并发布
                    </label>

                    <DomainSelector
                        value={subdomain}
                        onChange={setSubdomain}
                        type={domainType}
                        onTypeChange={setDomainType}
                        onStatusChange={handleDomainStatusChange}
                    />

                    <button
                        onClick={handlePublish}
                        disabled={
                            isPublishing ||
                            !subdomain ||
                            subdomain.length < 3 ||
                            domainAvailable === false
                        }
                        className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-xl hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    >
                        {isPublishing ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            "🚀"
                        )}
                        {isPublishing ? "正在发布到去中心化网络..." : "发布应用 (10 TAI)"}
                    </button>
                </motion.section>
            )}
        </div>
    );
}
