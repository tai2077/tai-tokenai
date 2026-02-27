"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Star, Users, ExternalLink, Heart, Share2, MessageSquare } from "lucide-react";
import { useStore, type AppItem } from "../store/useStore";
import { useRouter } from "next/navigation";
import { formatNumber } from "../lib/number";

interface AppDetailProps {
    id: string;
}

export default function AppDetail({ id }: AppDetailProps) {
    const router = useRouter();

    const fetchAppDetail = useStore((state) => state.fetchAppDetail);
    const favoriteApps = useStore((state) => state.favoriteApps);
    const favoriteApp = useStore((state) => state.favoriteApp);
    const unfavoriteApp = useStore((state) => state.unfavoriteApp);
    const addToast = useStore((state) => state.addToast);

    const [app, setApp] = useState<AppItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const isFavorite = favoriteApps.includes(id);

    useEffect(() => {
        setLoading(true);
        fetchAppDetail(id)
            .then((data) => setApp(data))
            .finally(() => setLoading(false));
    }, [id, fetchAppDetail]);

    if (loading) return <div className="text-center py-20 text-[#888]">加载中...</div>;
    if (!app) return <div className="text-center py-20 text-[#888]">应用未找到或已下架</div>;

    const handleOpenApp = () => {
        void fetch(`/api/app/${encodeURIComponent(app.id)}/use`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "open", userId: "me" }),
            keepalive: true,
        });
        window.open(app.url, "_blank", "noopener,noreferrer");
    };

    const handleReviewSubmit = async () => {
        if (!reviewComment.trim()) {
            addToast("请填写评价内容", "error");
            return;
        }
        setIsSubmittingReview(true);
        try {
            const response = await fetch(`/api/app/${encodeURIComponent(app.id)}/review`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    userId: "me",
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload.error || "评价提交失败");
            }
            const next = await fetchAppDetail(app.id);
            if (next) setApp(next);
            setReviewComment("");
            setReviewRating(5);
            addToast("评价提交成功", "success");
        } catch (error) {
            addToast(error instanceof Error ? error.message : "评价提交失败", "error");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#888] hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> 返回
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-32 h-32 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-6xl border border-[#333] shrink-0">
                    {app.icon || "📱"}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-pixel text-white">{app.name}</h1>
                        <p className="text-[#888] mt-2">by {app.creator.name}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-[#FFD700]">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold text-lg">{app.rating.toFixed(1)}</span>
                            <span className="text-[#888] ml-1">({formatNumber(app.ratingCount)} 评价)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#fff]">
                            <Users className="w-5 h-5 text-[#888]" />
                            <span className="font-bold">{formatNumber(app.stats.users)} 用户</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                        <button
                            onClick={handleOpenApp}
                            className="bg-[#00FF41] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#00FF41]/90 transition-colors flex items-center gap-2 text-lg"
                        >
                            🚀 立即使用
                        </button>
                        <button
                            onClick={() => (isFavorite ? unfavoriteApp(app.id) : favoriteApp(app.id))}
                            className="bg-[#222] text-white px-6 py-3 border border-[#333] hover:border-[#FFD700] rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? "fill-[#FFD700] text-[#FFD700]" : ""}`} />
                            {isFavorite ? "已收藏" : "收藏"}
                        </button>
                        <button className="bg-[#222] text-white px-6 py-3 border border-[#333] hover:border-[#fff] rounded-xl transition-colors flex items-center gap-2">
                            <Share2 className="w-5 h-5" /> 分享
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-[#111] p-6 rounded-2xl border border-[#333]">
                        <h2 className="text-xl font-bold text-white mb-4">应用预览</h2>
                        <div className="bg-black border border-[#333] rounded-xl aspect-video relative overflow-hidden flex flex-col justify-center items-center text-[#888] group">
                            <ExternalLink className="w-12 h-12 mb-4 group-hover:text-[#00FF41] transition-colors" />
                            <p>点击「立即使用」在独立窗口中打开应用</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-white mb-2">简介</h3>
                            <p className="text-[#888] leading-relaxed">{app.description}</p>
                        </div>
                    </section>

                    <section className="bg-[#111] p-6 rounded-2xl border border-[#333]">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" /> 用户评价
                        </h2>
                        <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-[#aaa]">评分</label>
                                <select
                                    value={reviewRating}
                                    onChange={(event) => setReviewRating(Number(event.target.value))}
                                    className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 text-sm text-white"
                                >
                                    {[5, 4, 3, 2, 1].map((score) => (
                                        <option key={score} value={score}>
                                            {score} 星
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                value={reviewComment}
                                onChange={(event) => setReviewComment(event.target.value)}
                                rows={3}
                                placeholder="写下你的使用体验..."
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl p-3 text-white outline-none focus:border-[#00FF41]"
                            />
                            <button
                                onClick={handleReviewSubmit}
                                disabled={isSubmittingReview}
                                className="px-4 py-2 bg-[#00FF41] text-black rounded-lg font-bold disabled:opacity-50"
                            >
                                {isSubmittingReview ? "提交中..." : "提交评价"}
                            </button>
                        </div>
                        {app.reviews.length === 0 ? (
                            <p className="text-[#888]">暂无评价。成为第一个评价的人吧！</p>
                        ) : (
                            <div className="space-y-4">
                                {app.reviews.map((r, i) => (
                                    <div key={r.id || `${i}-${r.comment}`} className="border-b border-[#333] pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-[#FFD700] text-sm">
                                                {Array(5).fill(0).map((_, j) => (
                                                    <Star key={j} className={j < r.rating ? "fill-current" : "opacity-30"} size={14} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-[#888]">{r.date || "最近"}</span>
                                        </div>
                                        <p className="text-white text-sm">{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-[#111] p-6 rounded-2xl border border-[#333]">
                        <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">📊 数据统计</h2>
                        <ul className="space-y-4 font-vt text-lg">
                            <li className="flex justify-between">
                                <span className="text-[#888]">总用户</span>
                                <span className="text-white">{formatNumber(app.stats.users)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-[#888]">日活 (DAU)</span>
                                <span className="text-white">{formatNumber(app.stats.dau)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-[#888]">总交互额</span>
                                <span className="text-[#00FF41]">${formatNumber(app.stats.revenue)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-[#888]">创建时间</span>
                                <span className="text-white">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </li>
                        </ul>
                    </section>

                    {app.token && (
                        <section className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#FFD700]/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl" />
                            <h2 className="text-sm font-bold text-[#FFD700] uppercase tracking-wider mb-4">关联代币</h2>
                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <div className="text-2xl font-bold font-pixel text-white mb-1">{app.token.symbol}</div>
                                    <div className="text-lg text-[#00FF41]">+45% (24h)</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-white">${app.token.price.toFixed(4)}</div>
                                </div>
                            </div>
                            <button className="w-full bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors border border-[#444]">
                                前往交易
                            </button>
                        </section>
                    )}

                    <section className="bg-[#111] p-6 rounded-2xl border border-[#333]">
                        <h2 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">🏷️ 标签</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#222] border border-[#333] rounded-full text-xs text-[#aaa]">#{app.category}</span>
                            {app.token && <span className="px-3 py-1 bg-[#222] border border-[#333] rounded-full text-xs text-[#aaa]">#{app.token.symbol}</span>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
