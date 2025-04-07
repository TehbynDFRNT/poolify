
export const calculateDigCost = () => {
  return 0;
};

/**
 * Calculates the total cost for extra concreting items
 * @param price Base price of the concreting item
 * @param margin Margin percentage to apply
 * @returns Total cost with margin applied
 */
export const calculateExtraConcretingCost = (price: number, margin: number): number => {
  const marginAmount = price * (margin / 100);
  return price + marginAmount;
};
