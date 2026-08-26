/**
 * Converts any standard Latin (English) digits 0-9 inside a string or number to Persian digits ۰-۹
 */
export const toPersianDigits = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
};

/**
 * Format Persian percentage
 */
export const toPersianPercent = (num: number): string => {
  return `${toPersianDigits(num)}٪`;
};

/**
 * Format Persian rank (e.g. 1 -> ۰۱)
 */
export const toPersianRank = (num: number): string => {
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toPersianDigits(padded);
};
