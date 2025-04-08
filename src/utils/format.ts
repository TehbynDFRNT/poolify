
/**
 * Format a number as currency
 * @param amount The number to format
 * @returns The formatted currency string
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};
