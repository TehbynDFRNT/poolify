
import { PavingSelection } from "../types";

// Fixed labor costs
const LABOR_COST_PER_METER = 100;
const LABOR_MARGIN_PER_METER = 30;

// Calculate the cost for a single selection, including material and labor costs
export const calculateSelectionCost = (selection: PavingSelection): number => {
  // Ensure meters is a valid number
  const meters = isNaN(selection.meters) ? 0 : selection.meters;
  
  // Material costs
  const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
  
  // Total cost per meter
  const totalCostPerMeter = materialCostPerMeter + LABOR_COST_PER_METER + LABOR_MARGIN_PER_METER;
  
  // Total cost for all meters
  return totalCostPerMeter * meters;
};

// Calculate total margin across all selections
export const calculateTotalMargin = (selections: PavingSelection[]): number => {
  return selections.reduce((sum, selection) => {
    // Ensure meters is a valid number
    const meters = isNaN(selection.meters) ? 0 : selection.meters;
    
    const materialMargin = selection.marginCost * meters;
    const laborMargin = LABOR_MARGIN_PER_METER * meters; 
    return sum + materialMargin + laborMargin;
  }, 0);
};

// Calculate total cost across all selections
export const calculateTotalCost = (selections: PavingSelection[]): number => {
  return selections.reduce((sum, selection) => {
    const cost = isNaN(selection.totalCost) ? 0 : selection.totalCost;
    return sum + cost;
  }, 0);
};
