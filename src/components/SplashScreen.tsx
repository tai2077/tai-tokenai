"use client";

import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [loadingText, setLoadingText] = useState('BOOTING SYSTEM...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 模拟启动加载序列
        const sequences = [
            { text: 'BOOTING SYSTEM...', delay: 0 },
            { text: 'CONNECTING TO TON BLOCKCHAIN...', delay: 500 },
            { text: 'INITIALIZING AI MODULES...', delay: 1000 },
            { text: 'SYNCING MARKETS...', delay: 1500 },
            { text: 'SYS.READY.', delay: 1800 },
        ];

        const textTimeouts = sequences.map(({ text, delay }) =>
            window.setTimeout(() => setLoadingText(text), delay)
        );

        // 进度条动画
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 40);

        // 2秒后结束 Splash 动画
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(completeTimer);
            textTimeouts.forEach((id) => clearTimeout(id));
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0a0a0c] text-[#00FF41] font-vt flex flex-col items-center justify-center crt">
            <div className="w-full max-w-sm px-6 flex flex-col items-center">
                {/* Logo 闪烁 */}
                <div className="mb-10 animate-pulse relative">
                    <div className="absolute inset-0 bg-[#00FF41] blur-[20px] opacity-20 rounded-full"></div>
                    <img src="/favicon.svg" alt="TAI Logo" className="w-24 h-24 relative z-10" />
                </div>

                {/* 状态文字和光标跟随 */}
                <div className="flex items-center gap-2 mb-4 h-6 font-pixel text-xs text-center">
                    <Terminal className="w-4 h-4" />
                    <span>{loadingText}</span>
                    <span className="w-2 h-4 bg-[#00FF41] animate-pulse inline-block"></span>
                </div>

                {/* 进度条 */}
                <div className="w-full h-1 bg-[#111] border border-[#333] relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 bottom-0 bg-[#00FF41] glow-box transition-all duration-75"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="w-full text-right mt-1 text-[10px] text-gray-500 font-pixel">
                    {progress}%
                </div>
            </div>
        </div>
    );
}
