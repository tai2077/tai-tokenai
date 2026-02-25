// 扩展 window 对象类型以便 TypeScript 能够识别 Telegram
declare global {
    interface Window {
        Telegram?: {
            WebApp?: any;
        };
    }
}

export const isTelegram = () => {
    return window.Telegram?.WebApp !== undefined;
};

export const tg = window.Telegram?.WebApp;

export const initTelegram = () => {
    if (!isTelegram()) return;

    tg.ready();
    tg.expand();

    // 设置 Telegram 主题色作为背景
    document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        tg.themeParams?.bg_color || "#0a0a0c"
    );
};

export const hapticFeedback = (type: "light" | "medium" | "heavy") => {
    if (!isTelegram()) return;
    tg.HapticFeedback?.impactOccurred(type);
};
