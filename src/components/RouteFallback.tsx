import React from "react";

export function RouteFallback({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-gray-400 font-pixel text-[10px] tracking-wide">
      {label}
    </div>
  );
}
