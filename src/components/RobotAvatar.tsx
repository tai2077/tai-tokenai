import React from "react";

const RobotAvatar = ({ role, level }: { role: string; level: number }) => {
  const colors: Record<string, string> = {
    MINER: "#F59E0B",
    SCOUT: "#3B82F6",
    ANALYST: "#8B5CF6",
    TRADER: "#10B981",
    FUND_MANAGER: "#F43F5E",
    MARKET_MAKER: "#06B6D4",
    PLAYER: "#00FF41",
    OPS: "#00FF41",
    CS: "#3B82F6",
    AUDIT: "#F59E0B",
  };
  const color = colors[role] || "#00FF41";

  return (
    <svg
      viewBox="0 0 16 16"
      className="w-full h-full drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]"
      shapeRendering="crispEdges"
    >
      {/* Base Head */}
      <rect x="3" y="4" width="10" height="9" fill="#111" />
      <rect
        x="3"
        y="4"
        width="10"
        height="9"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />

      {/* Level 1: Simple Cyclops */}
      {level === 1 && (
        <>
          <rect x="6" y="6" width="4" height="2" fill={color} />
          <rect x="5" y="10" width="6" height="1" fill="#444" />
        </>
      )}

      {/* Level 2: Dual Eyes, Antenna */}
      {level === 2 && (
        <>
          <rect x="7" y="2" width="2" height="2" fill={color} />
          <rect x="5" y="6" width="2" height="2" fill={color} />
          <rect x="9" y="6" width="2" height="2" fill={color} />
          <rect x="5" y="10" width="6" height="1" fill="#fff" opacity="0.7" />
        </>
      )}

      {/* Level 3: Elite, Glowing, Crown/Horns */}
      {level >= 3 && (
        <>
          <rect x="4" y="2" width="2" height="2" fill="#FFD700" />
          <rect x="10" y="2" width="2" height="2" fill="#FFD700" />
          <rect x="7" y="1" width="2" height="3" fill={color} />

          <rect x="5" y="6" width="2" height="2" fill="#FFD700" />
          <rect x="9" y="6" width="2" height="2" fill="#FFD700" />

          <rect x="4" y="10" width="8" height="2" fill="#fff" opacity="0.9" />
          <rect x="5" y="11" width="1" height="1" fill="#111" />
          <rect x="7" y="11" width="1" height="1" fill="#111" />
          <rect x="9" y="11" width="1" height="1" fill="#111" />
        </>
      )}
    </svg>
  );
};

export default RobotAvatar;
