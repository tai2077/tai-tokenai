import React, { useState, useRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
}

export default function PullToRefresh({
    onRefresh,
    children,
}: PullToRefreshProps) {
    const [pulling, setPulling] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [pullHeight, setPullHeight] = useState(0);

    const startY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const maxPull = 80;

    const handleTouchStart = (e: React.TouchEvent) => {
        // Only allow pull to refresh when at the top of the container
        if (window.scrollY > 0) return;
        const firstTouch = e.touches[0];
        if (!firstTouch) return;
        startY.current = firstTouch.clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (window.scrollY > 0 || refreshing) return;
        const firstTouch = e.touches[0];
        if (!firstTouch) return;
        const currentY = firstTouch.clientY;
        const diff = currentY - startY.current;

        if (diff > 0) {
            e.preventDefault();
            setPulling(true);
            const height = Math.min(diff * 0.5, maxPull);
            setPullHeight(height);
        }
    };

    const handleTouchEnd = async () => {
        if (!pulling) return;
        setPulling(false);

        if (pullHeight > maxPull * 0.7) {
            setRefreshing(true);
            setPullHeight(maxPull / 2); // 回弹到刷新位置
            try {
                await onRefresh();
            } finally {
                setRefreshing(false);
                setPullHeight(0);
            }
        } else {
            setPullHeight(0);
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ overflow: "hidden" }}
        >
            <div
                className="flex items-center justify-center transition-all duration-300 ease-out font-vt"
                style={{
                    height: `${pullHeight}px`,
                    opacity: pullHeight / maxPull,
                }}
            >
                {refreshing ? (
                    <div className="flex items-center gap-2 text-[#00FF41]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>SYS.REBOOTING...</span>
                    </div>
                ) : (
                    <div className="text-gray-500 font-pixel text-[10px]">
                        {pullHeight > maxPull * 0.7 ? "释放以刷新 PULL TO REFRESH" : "↓"}
                    </div>
                )}
            </div>
            <div
                className="transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${pullHeight}px)` }}
            >
                {children}
            </div>
        </div>
    );
}
