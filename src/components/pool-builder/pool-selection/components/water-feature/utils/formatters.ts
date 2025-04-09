
/**
 * Formats a number into a locale-specific currency string
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
