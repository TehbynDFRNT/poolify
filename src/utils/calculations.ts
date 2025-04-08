import { ExtraPavingCost } from "@/types/extra-paving";

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

/**
 * Calculate total cost for extra paving
 * @param paverCost Cost of pavers
 * @param wastageCost Cost of wastage
 * @param marginCost Cost of margin
 * @returns Total cost for extra paving
 */
export const calculateExtraPavingCost = (paverCost: number, wastageCost: number, marginCost: number) => {
  return paverCost + wastageCost + marginCost;
};

/**
 * Calculate cost for extra concreting
 * @param price Base price per square meter
 * @param margin Margin per square meter
 * @returns Total cost per square meter
 */
export const calculateExtraConcretingCost = (price: number, margin: number) => {
  return price + margin;
};

/**
 * Calculate total cost for concrete
 * @param cost Cost of concrete
 * @param margin Margin percentage
 * @returns Total cost for concrete with margin
 */
export const calculateConcreteCostWithMargin = (cost: number, margin: number) => {
  return cost + (cost * margin / 100);
};
