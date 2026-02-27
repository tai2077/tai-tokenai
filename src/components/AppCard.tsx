import { motion } from "framer-motion";
import { Star, Users, Coins } from "lucide-react";
import { formatNumber } from "../lib/number";

interface AppCardProps {
    id: string;
    name: string;
    icon?: string | undefined;
    category: string;
    rating: number;
    ratingCount: number;
    users: number;
    token?: {
        symbol: string;
        id: string;
    } | undefined;
    onClick?: (() => void) | undefined;
}

export function AppCard({
    id,
    name,
    icon,
    category,
    rating,
    ratingCount,
    users,
    token,
    onClick
}: AppCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-[#1a1a1a] rounded-xl border border-[#333333] hover:border-[#00FF41] overflow-hidden cursor-pointer transition-colors p-4 group hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#222] flex items-center justify-center text-2xl border border-[#333] group-hover:border-[#00FF41]/50 transition-colors">
                        {icon || "📱"}
                    </div>
                    <div>
                        <h3 className="text-white font-bold font-pixel text-sm">{name}</h3>
                        <span className="text-xs text-[#888] mt-1 block uppercase tracking-wider">{category}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-vt text-[#888] mt-4 pt-4 border-t border-[#333]">
                <div className="flex items-center gap-1.5 flex-1 text-[#FFD700]">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(users)}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                    <Coins className="w-4 h-4" />
                    <span>{token?.symbol || "-"}</span>
                </div>
            </div>
        </motion.div>
    );
}
