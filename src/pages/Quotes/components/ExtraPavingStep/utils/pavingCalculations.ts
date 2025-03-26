
import { PavingSelection } from "../types";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";

// Calculate the cost for a single selection, including material and labor costs
export const calculateSelectionCost = (
  selection: PavingSelection, 
  concreteLabourCosts: ConcreteLabourCost[]
): number => {
  // Ensure meters is a valid number
  const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
  
  if (meters === 0) return 0;
  
  // Material costs
  const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
  
  // Labor costs from database
  const laborCosts = concreteLabourCosts.reduce((total, cost) => {
    return total + cost.cost + cost.margin;
  }, 0);
  
  // Total cost per meter (material + labor)
  const totalCostPerMeter = materialCostPerMeter + laborCosts;
  
  // Total cost for all meters
  return totalCostPerMeter * meters;
};

// Calculate total margin across all selections
export const calculateTotalMargin = (
  selections: PavingSelection[], 
  concreteLabourCosts: ConcreteLabourCost[]
): number => {
  if (!selections || selections.length === 0) return 0;
  
  return selections.reduce((sum, selection) => {
    // Ensure meters is a valid number
    const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
    
    const materialMargin = selection.marginCost * meters;
    
    // Calculate labor margin from database
    const laborMargin = concreteLabourCosts.reduce((total, cost) => {
      return total + cost.margin;
    }, 0) * meters;
    
    return sum + materialMargin + laborMargin;
  }, 0);
};

// Calculate total cost across all selections
export const calculateTotalCost = (
  selections: PavingSelection[], 
  concreteLabourCosts: ConcreteLabourCost[]
): number => {
  if (!selections || selections.length === 0) return 0;
  
  const total = selections.reduce((sum, selection) => {
    // Calculate cost for this selection
    const cost = calculateSelectionCost(selection, concreteLabourCosts);
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
