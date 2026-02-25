"use client";

import React from "react";
import Link from "next/link";
import { TerminalSquare } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0c] bg-grid-pattern text-[#00FF41] font-vt flex flex-col items-center justify-center p-4 selection:bg-[#00FF41] selection:text-black">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center mb-8">
                    <TerminalSquare className="w-24 h-24 sm:w-32 sm:h-32 text-red-500 animate-pulse" />
                </div>

                <h1 className="text-6xl sm:text-8xl font-black text-red-500 font-pixel tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    404
                </h1>

                <div className="space-y-4">
                    <p className="font-pixel text-xl sm:text-2xl text-red-400">
                        SYS.ERROR: NOT FOUND
                    </p>
                    <p className="text-gray-400 text-sm sm:text-base font-vt max-w-sm mx-auto">
                        TARGET SECTOR UNREACHABLE. THE REQUESTED NODE DOES NOT EXIST IN THIS TIMELINE.
                    </p>
                </div>

                <div className="pt-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 border-2 border-[#00FF41] text-[#00FF41] font-pixel text-sm sm:text-base hover:bg-[#00FF41] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#0a0a0c]"
                    >
                        RETURN TO BASE / 返回基地
                    </Link>
                </div>
            </div>
        </div>
    );
}
