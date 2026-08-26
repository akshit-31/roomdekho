export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isStrongPassword = (v) => (v || "").length >= 8;
export const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;
export const isPositiveNumber = (v) => Number(v) > 0;
