/**
 * Format a number as currency with $ sign
 */
export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};
