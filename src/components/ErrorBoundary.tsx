"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Reload the page is simpler for a complete reset of stores
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0a0c] text-[#ff4444] font-vt flex flex-col items-center justify-center p-6 text-center crt">
                    <AlertOctagon className="w-16 h-16 mb-4 animate-pulse" />
                    <h1 className="font-pixel text-xl mb-2 text-[#ff4444] glow-text-red">
                        SYS.CRITICAL_ERROR
                    </h1>
                    <p className="text-gray-400 mb-8 max-w-sm">
                        {this.state.error?.message || "An unexpected system anomaly occurred."}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 border border-[#00FF41] text-[#00FF41] px-6 py-3 hover:bg-[#00FF41] hover:text-black transition-colors font-pixel text-xs glow-box"
                    >
                        <RotateCcw className="w-4 h-4" /> REBOOT
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
