import { useEffect } from "react";
import { bindTelegramBackButton } from "../lib/telegram";

// This hook just passes the callback, the router logic is inside the components.
export const useTelegramBackButton = (onBack: () => void): void => {
  useEffect(() => {
    return bindTelegramBackButton(onBack);
  }, [onBack]);
};
