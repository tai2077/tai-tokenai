const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

const toEnabled = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }
  return ENABLED_VALUES.has(value.trim().toLowerCase());
};

export const isPixelOpsEnabled = (): boolean => {
  const value =
    process.env.PIXEL_OPS_ENABLED ??
    process.env.NEXT_PUBLIC_PIXEL_OPS_ENABLED ??
    process.env.VITE_PIXEL_OPS_ENABLED;
  return toEnabled(value);
};
