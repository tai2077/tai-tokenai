export const toSafeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

export const formatNumber = (
  value: unknown,
  options?: Intl.NumberFormatOptions,
  locale?: string,
): string => toSafeNumber(value).toLocaleString(locale, options);
