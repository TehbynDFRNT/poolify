
/**
 * Formats a number as currency with 2 decimal places
 * @param value Number to format
 * @returns Formatted string with dollar sign and 2 decimal places
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "$0.00";
  }
  return `$${Number(value).toFixed(2)}`;
};

/**
 * Formats a number with 2 decimal places
 * @param value Number to format
 * @returns Formatted string with 2 decimal places
 */
export const formatNumber = (value: number | null | undefined): string => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "0.00";
  }
  return Number(value).toFixed(2);
};
