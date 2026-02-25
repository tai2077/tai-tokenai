type HapticImpact = 'light' | 'medium' | 'heavy';

interface TelegramThemeParams {
  bg_color?: string;
}

interface TelegramHapticFeedback {
  impactOccurred(type: HapticImpact): void;
}

interface TelegramBackButton {
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

export interface TelegramWebApp {
  ready(): void;
  expand(): void;
  themeParams?: TelegramThemeParams;
  HapticFeedback?: TelegramHapticFeedback;
  BackButton?: TelegramBackButton;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const getTelegramWebApp = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export const isTelegram = (): boolean => getTelegramWebApp() !== undefined;

export const initTelegram = (): void => {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  webApp.ready();
  webApp.expand();

  document.documentElement.style.setProperty(
    '--tg-theme-bg-color',
    webApp.themeParams?.bg_color || '#0a0a0c',
  );
};

export const hapticFeedback = (type: HapticImpact): void => {
  const webApp = getTelegramWebApp();
  if (!webApp) return;
  webApp.HapticFeedback?.impactOccurred(type);
};

export const bindTelegramBackButton = (onBack: () => void): (() => void) => {
  const webApp = getTelegramWebApp();
  if (!webApp?.BackButton) return () => {};

  webApp.BackButton.show();
  webApp.BackButton.onClick(onBack);

  return () => {
    webApp.BackButton?.offClick(onBack);
    webApp.BackButton?.hide();
  };
};
