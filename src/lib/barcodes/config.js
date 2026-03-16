export const DEFAULT_SHARED_OPTIONS = {
  width: 2,
  height: 100,
  displayValue: true,
  margin: 10,
  background: "#FFFFFF",
  lineColor: "#000000"
};

export function normalizarSharedOptions(raw = {}) {
  return {
    width: Number(raw.width ?? DEFAULT_SHARED_OPTIONS.width),
    height: Number(raw.height ?? DEFAULT_SHARED_OPTIONS.height),
    displayValue:
      raw.displayValue === true ||
      raw.displayValue === "true" ||
      raw.displayValue === "on",
    margin: Number(raw.margin ?? DEFAULT_SHARED_OPTIONS.margin),
    background: String(raw.background ?? DEFAULT_SHARED_OPTIONS.background),
    lineColor: String(raw.lineColor ?? DEFAULT_SHARED_OPTIONS.lineColor)
  };
}