
export const calculateDigCost = () => {
  return 0;
};

/**
 * Calculates the total cost for extra concreting items
 * @param price Base price of the concreting item
 * @param margin Margin amount in dollars to add
 * @returns Total cost with margin added
 */
export const calculateExtraConcretingCost = (price: number, margin: number): number => {
  return price + margin;
};
