import React from "react";
import { type AgentRole } from "../store/useStore";

interface AIAvatarProps {
    avatar: string;
    role: AgentRole;
    status: "working" | "resting";
    className?: string; // Additional classes for the outer container
    size?: "sm" | "md" | "lg";
}

export function AIAvatar({ avatar, role, status, className = "", size = "md" }: AIAvatarProps) {
    const isWorking = status === "working";

    // Base sizing
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const containerSize = {
        sm: "w-10 h-10 p-1",
        md: "w-12 h-12 p-1",
        lg: "w-16 h-16 p-2",
    };

    // 1. Miner VFX: Golden rising particles
    const MinerVFX = () => (
        <div className="absolute inset-0 overflow-hidden rounded opacity-50">
            <div className="absolute w-[2px] h-[2px] bg-yellow-400 rounded-full left-1/4 animate-[vfx-rise_2s_linear_infinite]" />
            <div className="absolute w-[3px] h-[3px] bg-[#FFD700] rounded-full left-1/2 animate-[vfx-rise_3s_linear_infinite_0.5s]" />
            <div className="absolute w-[2px] h-[2px] bg-yellow-200 rounded-full right-1/4 animate-[vfx-rise_2.5s_linear_infinite_1s]" />
        </div>
    );

    // 2. Scout VFX: Rotating Radar
    const ScoutVFX = () => (
        <div className="absolute inset-0 overflow-hidden rounded opacity-60 flex items-center justify-center">
            <div className="w-[150%] h-[150%] rounded-full absolute animate-[spin_2s_linear_infinite]"
                style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.8) 100%)" }}
            />
            <div className="absolute inset-0 border border-blue-500/20 rounded-full" />
        </div>
    );

    // 3. Analyst VFX: Digital Matrix Rain
    const AnalystVFX = () => (
        <div className="absolute inset-0 overflow-hidden rounded opacity-40">
            <div className="absolute top-0 bottom-0 left-1 w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-[vfx-drop_1.5s_linear_infinite]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-[vfx-drop_2s_linear_infinite_0.7s]" />
            <div className="absolute top-0 bottom-0 right-2 w-[1px] bg-gradient-to-b from-transparent via-purple-600 to-transparent animate-[vfx-drop_1.8s_linear_infinite_0.3s]" />
        </div>
    );

    // 4. Trader VFX: Upward Equalizer / Candlesticks
    const TraderVFX = () => (
        <div className="absolute inset-x-0 bottom-0 top-1/2 overflow-hidden rounded-b opacity-40 flex items-end justify-around px-1">
            <div className="w-[20%] bg-green-500 animate-[vfx-eq_1s_ease-in-out_infinite_alternate]" />
            <div className="w-[20%] bg-green-400 animate-[vfx-eq_1.2s_ease-in-out_infinite_alternate_0.2s]" />
            <div className="w-[20%] bg-green-500 animate-[vfx-eq_0.8s_ease-in-out_infinite_alternate_0.4s]" />
        </div>
    );

    // 5. Ops VFX: Cyan Ripple Pulse
    const OpsVFX = () => (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <div className="absolute w-[80%] h-[80%] border border-cyan-400 rounded-full animate-[vfx-ripple_2s_ease-out_infinite]" />
            <div className="absolute w-[80%] h-[80%] border border-cyan-500 rounded-full animate-[vfx-ripple_2s_ease-out_infinite_1s]" />
        </div>
    );

    // 6. Audit VFX: Laser Scan
    const AuditVFX = () => (
        <div className="absolute inset-0 overflow-hidden rounded opacity-60">
            <div className="absolute left-0 right-0 h-[2px] bg-yellow-400 shadow-[0_0_8px_4px_rgba(250,204,21,0.5)] animate-[vfx-scan_2s_ease-in-out_infinite_alternate]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(250,204,21,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
        </div>
    );

    return (
        <div className={`relative flex items-end justify-center shrink-0 bg-[#0a0a0c] border border-[#333] overflow-hidden ${containerSize[size]} ${!isWorking ? "grayscale opacity-60" : "shadow-[0_0_15px_rgba(0,0,0,0.8)]"} ${className}`}>

            {/* Background Environment VFX (Only when working) */}
            {isWorking && (
                <>
                    {role === "MINER" && <MinerVFX />}
                    {role === "SCOUT" && <ScoutVFX />}
                    {role === "ANALYST" && <AnalystVFX />}
                    {role === "TRADER" && <TraderVFX />}
                    {role === "OPS" && <OpsVFX />}
                    {role === "AUDIT" && <AuditVFX />}
                </>
            )}

            {/* Dynamic Animated Core Avatar with Subtle Physics */}
            <img
                // Load physical animation GIF when working, seamless PNG when resting
                src={`${isWorking ? avatar.replace('.png', '.gif') : avatar.replace('.gif', '.png')}?v=3`}
                alt={role}
                className={`relative z-10 object-contain ${sizeClasses[size]} ${isWorking ? "animate-[vfx-core-float_8s_cubic-bezier(0.4,0,0.2,1)_infinite] drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" : ""}`}
            />

            {/* CRT overlay line on top of the container */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] opacity-10 z-20" />
        </div>
    );
}
