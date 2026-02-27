"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Flame, Clock, Star, TrendingUp, Sparkles } from "lucide-react";
import { AppCard } from "../../src/components/AppCard";
import { useStore } from "../../src/store/useStore";
import { useRouter } from "next/navigation";

const CATEGORIES = [
    { id: "all", label: "全部", icon: "🌐" },
    { id: "lottery", label: "抽奖", icon: "🎰" },
    { id: "vote", label: "投票", icon: "📊" },
    { id: "game", label: "游戏", icon: "🎮" },
    { id: "tool", label: "工具", icon: "🔧" },
    { id: "display", label: "展示", icon: "📱" },
];

const SORTS = [
    { id: "hot", label: "热门", icon: Flame },
    { id: "new", label: "最新", icon: Clock },
    { id: "rating", label: "好评", icon: Star },
    { id: "revenue", label: "收益", icon: TrendingUp },
];

export default function StorePage() {
    const router = useRouter();
    const apps = useStore((state) => state.apps);
    const fetchApps = useStore((state) => state.fetchApps);
    const searchApps = useStore((state) => state.searchApps);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("hot");
    const [searchResults, setSearchResults] = useState<typeof apps | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        void fetchApps({ category, sort, page: 1, limit: 48 });
    }, [fetchApps, category, sort]);

    useEffect(() => {
        const query = search.trim();
        if (!query) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timer = window.setTimeout(async () => {
            const found = await searchApps(query);
            setSearchResults(found);
            setIsSearching(false);
        }, 280);

        return () => window.clearTimeout(timer);
    }, [search, searchApps]);

    const filteredApps = searchResults ?? apps;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-[#FFD700]" />
                    <div>
                        <h1 className="text-3xl font-pixel text-white">TAI STORE</h1>
                        <p className="text-[#888] mt-2">发现、使用由社区共建的 AI 应用</p>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888]" />
                    <input
                        type="text"
                        placeholder="搜索应用..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">分类</h3>
                    <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setCategory(c.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${category === c.id
                                        ? "border-[#00FF41] bg-[#00FF41]/10 text-white"
                                        : "border-[#333] bg-[#1a1a1a] text-[#888] hover:bg-[#222]"
                                    }`}
                            >
                                <span>{c.icon}</span>
                                <span className="font-medium">{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">排序</h3>
                    <div className="flex flex-wrap gap-3">
                        {SORTS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSort(s.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${sort === s.id
                                        ? "text-[#FFD700] bg-[#FFD700]/10"
                                        : "text-[#888] hover:text-white"
                                    }`}
                            >
                                <s.icon className="w-4 h-4" />
                                <span className="font-medium tracking-wide">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-[#333]">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    {sort === "hot" && <Flame className="w-6 h-6 text-red-500" />}
                    {sort === "new" && <Clock className="w-6 h-6 text-blue-500" />}
                    {sort === "rating" && <Star className="w-6 h-6 text-yellow-500" />}
                    {sort === "revenue" && <TrendingUp className="w-6 h-6 text-green-500" />}
                    {SORTS.find(s => s.id === sort)?.label}应用
                </h2>

                {filteredApps.length === 0 ? (
                    <div className="text-center py-20 text-[#888]">
                        <p>{isSearching ? "搜索中..." : "暂无符合条件的应用"}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredApps.map((app) => (
                            <AppCard
                                key={app.id}
                                id={app.id}
                                name={app.name}
                                icon={app.icon}
                                category={app.category}
                                rating={app.rating}
                                ratingCount={app.ratingCount}
                                users={app.stats.users}
                                token={app.token}
                                onClick={() => router.push(`/store/${app.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
