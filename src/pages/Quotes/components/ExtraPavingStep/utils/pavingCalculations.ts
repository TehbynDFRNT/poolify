
import { PavingSelection } from "../types";

// Calculate the cost for a single selection, including material and labor costs
export const calculateSelectionCost = (selection: PavingSelection): number => {
  // Material costs
  const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
  
  // Fixed labor costs
  const laborCostPerMeter = 100; // Fixed labor cost of $100
  const laborMarginPerMeter = 30;  // Fixed labor margin of $30
  
  // Total cost per meter
  const totalCostPerMeter = materialCostPerMeter + laborCostPerMeter + laborMarginPerMeter;
  
  // Total cost for all meters
  return totalCostPerMeter * selection.meters;
};

// Calculate total margin across all selections
export const calculateTotalMargin = (selections: PavingSelection[]): number => {
  return selections.reduce((sum, selection) => {
    const materialMargin = selection.marginCost * selection.meters;
    const laborMargin = 30 * selection.meters; // Fixed labor margin of $30 per meter
    return sum + materialMargin + laborMargin;
  }, 0);
};

// Calculate total cost across all selections
export const calculateTotalCost = (selections: PavingSelection[]): number => {
  return selections.reduce((sum, selection) => sum + selection.totalCost, 0);
};
