import React, { useState, useRef, useEffect } from "react";
import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { useStore } from "../store/useStore";
import { copyText } from "../lib/clipboard";
import { useTranslation } from "react-i18next";

export default function WalletButton() {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const address = useTonAddress();
    const { t } = useTranslation();
    const setMainWallet = useStore((state) => state.setMainWallet);
    const addToast = useStore((state) => state.addToast);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (wallet && address) {
            setMainWallet({ address, connected: true });
        } else {
            setMainWallet({ address: null, connected: false });
        }
    }, [wallet, address, setMainWallet]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConnect = () => {
        tonConnectUI.openModal();
    };

    const handleDisconnect = async () => {
        await tonConnectUI.disconnect();
        setDropdownOpen(false);
        addToast("钱包已断开连接", "info");
    };

    const copyAddress = async () => {
        if (address) {
            const copied = await copyText(address);
            addToast(copied ? "地址已复制" : "复制失败，请手动复制", copied ? "success" : "error");
        }
        setDropdownOpen(false);
    };

    if (!wallet) {
        return (
            <button
                onClick={handleConnect}
                aria-label="连接钱包"
                className="px-3 py-1.5 bg-transparent border border-[#00FF41] text-[#00FF41] font-pixel text-[10px] hover:bg-[#00FF41] hover:text-black transition-colors whitespace-nowrap"
            >
                {t("layout.connect")}
            </button>
        );
    }

    const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="钱包菜单"
                className="px-3 py-1.5 bg-[#111] border border-[#333] text-[#00FF41] font-pixel text-[10px] hover:border-[#00FF41] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                {shortAddress}
            </button>

            {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-[#111] border border-[#333] py-1 z-50 shadow-lg shadow-black/50">
                    <button
                        onClick={copyAddress}
                        aria-label="复制地址"
                        className="w-full text-left px-3 py-2 text-[10px] font-pixel text-gray-300 hover:text-[#00FF41] hover:bg-[#222] transition-colors"
                    >
                        复制地址
                    </button>
                    <button
                        onClick={handleDisconnect}
                        aria-label="断开钱包连接"
                        className="w-full text-left px-3 py-2 text-[10px] font-pixel text-[#ff4444] hover:bg-[#222] transition-colors"
                    >
                        断开连接
                    </button>
                </div>
            )}
        </div>
    );
}
