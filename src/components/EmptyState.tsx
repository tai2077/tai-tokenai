import React from "react";
import { TerminalSquare } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message: string;
    icon?: React.ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
    return (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-8 bg-[#111]/40 border border-[#333] border-dashed rounded-lg opacity-80 mt-4 mb-4">
            {icon ? (
                <div className="text-[#00FF41]/50 mb-4">{icon}</div>
            ) : (
                <TerminalSquare className="w-10 h-10 text-[#00FF41]/50 mb-4" />
            )}
            {title && (
                <h3 className="font-pixel text-[12px] text-[#00FF41] mb-2">{title}</h3>
            )}
            <p className="font-vt text-lg text-gray-500 text-center max-w-sm">
                {message}
            </p>
        </div>
    );
}
