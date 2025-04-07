
/**
 * Calculates the dig cost
 * @returns The calculated dig cost
 */
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

/**
 * Calculates the total material cost for paving
 * @param paverCost Cost of the paver material
 * @param wastageCost Cost for wastage
 * @param marginCost Margin cost
 * @returns Total material cost
 */
export const calculatePavingMaterialCost = (
  paverCost: number, 
  wastageCost: number, 
  marginCost: number
): number => {
  return paverCost + wastageCost + marginCost;
};

/**
 * Calculates labour cost with margin
 * @param labourCost Base labour cost
 * @param marginPercent Margin percentage to apply
 * @returns Total labour cost with margin
 */
export const calculateLabourWithMargin = (
  labourCost: number, 
  marginPercent: number
): number => {
  return labourCost + (labourCost * marginPercent / 100);
};

/**
 * Calculates total paving rate per meter
 * @param materialCost Total material cost
 * @param labourCost Total labour cost
 * @param concreteCost Concrete material cost (optional)
 * @returns Total rate per meter
 */
export const calculateTotalPavingRate = (
  materialCost: number, 
  labourCost: number, 
  concreteCost: number = 0
): number => {
  return materialCost + labourCost + concreteCost;
};
