import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: ReactNode;
    icon?: ReactNode;
    color?: "green" | "gold";
    rightElement?: ReactNode;
}

export function PageHeader({ title, icon, color = "green", rightElement }: PageHeaderProps) {
    const textColor = color === "gold" ? "text-[#FFD700] glow-text-gold" : "text-[#00FF41] glow-text";
    const iconColor = color === "gold" ? "text-[#FFD700]" : "text-[#00FF41]";
    const shadowColor = color === "gold" ? "rgba(255,215,0,0.1)" : "rgba(0,255,65,0.1)";

    return (
        <div
            className="flex items-center justify-between mb-6 pb-4 border-b border-[#333] bg-[#111] -mx-4 px-4 pt-4 sticky top-[40px] z-40 transition-all duration-300"
            style={{ boxShadow: `inset 0 -10px 20px -10px ${shadowColor}` }}
        >
            <div className="flex items-center gap-3">
                {icon && <div className={`${iconColor}`}>{icon}</div>}
                <h1 className={`font-pixel text-[14px] sm:text-[16px] ${textColor} uppercase tracking-wider`}>
                    {title}
                </h1>
            </div>
            {rightElement && <div>{rightElement}</div>}
        </div>
    );
}
