import { useEffect } from "react";
import { bindTelegramBackButton } from "../lib/telegram";

export const useTelegramBackButton = (onBack: () => void): void => {
  useEffect(() => {
    return bindTelegramBackButton(onBack);
  }, [onBack]);
};
