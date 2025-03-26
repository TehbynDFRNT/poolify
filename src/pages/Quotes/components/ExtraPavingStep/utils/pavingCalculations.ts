
import { PavingSelection } from "../types";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import type { ConcreteCost } from "@/types/concrete-cost";

// Calculate the cost for a single selection, including material and labor costs
export const calculateSelectionCost = (
  selection: PavingSelection, 
  concreteLabourCosts: ConcreteLabourCost[],
  concreteCosts: ConcreteCost[] = []
): number => {
  // Ensure meters is a valid number
  const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
  
  if (meters === 0) return 0;
  
  // Material costs
  const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
  const totalMaterialCost = materialCostPerMeter * meters;
  
  // Labor costs from database - PER METER
  const laborCostPerMeter = concreteLabourCosts.reduce((total, cost) => {
    return total + cost.cost + cost.margin;
  }, 0);
  // Total labor cost for all meters
  const totalLaborCost = laborCostPerMeter * meters;
  
  // Concrete costs from database - PER METER
  const concreteCostPerMeter = concreteCosts.reduce((total, cost) => {
    return total + cost.total_cost;
  }, 0);
  // Total concrete cost for all meters
  const totalConcreteCost = concreteCostPerMeter * meters;
  
  // Total cost (material + labor + concrete)
  return totalMaterialCost + totalLaborCost + totalConcreteCost;
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
    
    // Material margin
    const materialMargin = selection.marginCost * meters;
    
    // Labor margin
    const laborMargin = concreteLabourCosts.reduce((total, cost) => {
      return total + cost.margin;
    }, 0) * meters;
    
    return sum + materialMargin + laborMargin;
  }, 0);
};

// Calculate total cost across all selections
export const calculateTotalCost = (
  selections: PavingSelection[], 
  concreteLabourCosts: ConcreteLabourCost[],
  concreteCosts: ConcreteCost[] = []
): number => {
  if (!selections || selections.length === 0) return 0;
  
  const total = selections.reduce((sum, selection) => {
    // Calculate cost for this selection
    const cost = calculateSelectionCost(selection, concreteLabourCosts, concreteCosts);
    return sum + cost;
  }, 0);
  
  console.log("Total cost calculated:", total);
  return total;
};

// Split calculations for paving (material) and laying (labor) for display
export const calculatePavingAndLayingCosts = (
  selections: PavingSelection[],
  concreteLabourCosts: ConcreteLabourCost[],
  concreteCosts: ConcreteCost[] = []
): { pavingTotal: number; layingTotal: number; concreteTotal: number } => {
  if (!selections || selections.length === 0) return { pavingTotal: 0, layingTotal: 0, concreteTotal: 0 };
  
  return selections.reduce((totals, selection) => {
    // Ensure meters is a valid number
    const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
    
    // Material costs (paving)
    const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
    const pavingCost = materialCostPerMeter * meters;
    
    // Labor costs (laying) - ensure we're multiplying by meters here
    const laborCostPerMeter = concreteLabourCosts.reduce((total, cost) => {
      return total + cost.cost + cost.margin;
    }, 0);
    const layingCost = laborCostPerMeter * meters;
    
    // Concrete costs - ensure we're multiplying by meters here
    const concreteCostPerMeter = concreteCosts.reduce((total, cost) => {
      return total + cost.total_cost;
    }, 0);
    const concreteMaterialCost = concreteCostPerMeter * meters;
    
    console.log(`For ${selection.pavingCategory} with ${meters} meters:`, {
      materialCostPerMeter,
      pavingTotal: pavingCost,
      laborCostPerMeter,
      layingTotal: layingCost,
      concreteCostPerMeter,
      concreteTotal: concreteMaterialCost
    });
    
    return {
      pavingTotal: totals.pavingTotal + pavingCost,
      layingTotal: totals.layingTotal + layingCost,
      concreteTotal: totals.concreteTotal + concreteMaterialCost
    };
  }, { pavingTotal: 0, layingTotal: 0, concreteTotal: 0 });
};

// For debugging: Get a detailed breakdown of all selections
export const getSelectionsDebugInfo = (selections: PavingSelection[]): string => {
  if (!selections || selections.length === 0) return "No selections";
  
  return selections.map(selection => {
    const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
    return `${selection.pavingCategory}: ${meters} meters, totalCost: ${selection.totalCost}`;
  }).join("; ");
};
