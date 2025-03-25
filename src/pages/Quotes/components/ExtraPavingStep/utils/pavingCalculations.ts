
import { PavingSelection } from "../types";

// Fixed labor costs
const LABOR_COST_PER_METER = 100;
const LABOR_MARGIN_PER_METER = 30;

// Calculate the cost for a single selection, including material and labor costs
export const calculateSelectionCost = (selection: PavingSelection): number => {
  // Ensure meters is a valid number
  const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
  
  // Material costs
  const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
  
  // Total cost per meter
  const totalCostPerMeter = materialCostPerMeter + LABOR_COST_PER_METER + LABOR_MARGIN_PER_METER;
  
  // Total cost for all meters
  return totalCostPerMeter * meters;
};

// Calculate total margin across all selections
export const calculateTotalMargin = (selections: PavingSelection[]): number => {
  if (!selections || selections.length === 0) return 0;
  
  return selections.reduce((sum, selection) => {
    // Ensure meters is a valid number
    const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
    
    const materialMargin = selection.marginCost * meters;
    const laborMargin = LABOR_MARGIN_PER_METER * meters; 
    return sum + materialMargin + laborMargin;
  }, 0);
};

// Calculate total cost across all selections
export const calculateTotalCost = (selections: PavingSelection[]): number => {
  if (!selections || selections.length === 0) return 0;
  
  const total = selections.reduce((sum, selection) => {
    // Calculate cost for this selection
    const cost = calculateSelectionCost(selection);
    return sum + cost;
  }, 0);
  
  console.log("Total cost calculated:", total);
  return total;
};

// For debugging: Get a detailed breakdown of all selections
export const getSelectionsDebugInfo = (selections: PavingSelection[]): string => {
  if (!selections || selections.length === 0) return "No selections";
  
  return selections.map(selection => {
    const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
    return `${selection.pavingCategory}: ${meters} meters, totalCost: ${selection.totalCost}`;
  }).join("; ");
};
