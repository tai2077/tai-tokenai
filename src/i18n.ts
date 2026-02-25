import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

const resources = {
    en: { translation: en },
    zh: { translation: zh },
};

const supportedLanguages = ["zh", "en"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

const getInitialLanguage = (): SupportedLanguage => {
    if (typeof window === "undefined") return "zh";

    const stored = window.localStorage.getItem("tai_lang");
    if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
    }

    return "zh";
};

i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "zh",
    supportedLngs: [...supportedLanguages],
    interpolation: {
        escapeValue: false, // React 已经防范了 XSS
    },
});

export default i18n;
