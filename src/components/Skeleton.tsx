import React from "react";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

export function Skeleton({ className = "", width, height }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-[#1a1a1c] border border-[#333] ${className}`}
            style={{
                width: width ?? "100%",
                height: height ?? "1rem",
                borderRadius: "4px",
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-[#111] border border-[#333] p-4 rounded-lg flex flex-col gap-4">
            <Skeleton height="24px" width="40%" />
            <div className="flex flex-col gap-2">
                <Skeleton height="16px" width="80%" />
                <Skeleton height="16px" width="60%" />
            </div>
            <div className="flex justify-between mt-2">
                <Skeleton height="32px" width="45%" />
                <Skeleton height="32px" width="45%" />
            </div>
        </div>
    );
}
