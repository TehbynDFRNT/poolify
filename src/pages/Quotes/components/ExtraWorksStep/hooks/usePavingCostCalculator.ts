
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import { PavingSelection } from "./usePavingSelections";

/**
 * Calculate costs for a paving selection
 */
export const calculatePavingCosts = (
  selection: PavingSelection,
  pavingCategories: ExtraPavingCost[] | undefined,
  concreteLabourCosts: ConcreteLabourCost[] | undefined
): PavingSelection => {
  const updatedSelection = { ...selection };
  
  const category = pavingCategories?.find(cat => cat.id === selection.categoryId);
  
  if (category && concreteLabourCosts && concreteLabourCosts.length > 0) {
    // Get the standard paving costs
    const pavingPerMeter = category.paver_cost + category.wastage_cost + category.margin_cost;
    
    // Get the labor cost - using the first labour cost in the list
    const laborCost = concreteLabourCosts[0].cost;
    const laborMargin = concreteLabourCosts[0].margin;
    
    // Calculate total per meter including labor cost and margin
    const totalPerMeter = pavingPerMeter + laborCost + laborMargin;
    
    // Calculate final cost based on meters
    const meters = selection.meters;
    
    // Calculate final cost with proper number formatting
    updatedSelection.cost = parseFloat((totalPerMeter * meters).toFixed(2));
    
    // Calculate margins with proper number formatting
    updatedSelection.materialMargin = parseFloat((category.margin_cost * meters).toFixed(2));
    updatedSelection.labourMargin = parseFloat((laborMargin * meters).toFixed(2));
    updatedSelection.totalMargin = parseFloat((
      (updatedSelection.materialMargin || 0) + 
      (updatedSelection.labourMargin || 0)
    ).toFixed(2));
      
    console.log(
      `Updated paving selection:`, 
      `meters=${meters}`, 
      `totalPerMeter=${totalPerMeter}`, 
      `totalCost=${updatedSelection.cost}`
    );
  }
  
  return updatedSelection;
};

/**
 * Calculate total cost and margin for all paving selections
 */
export const calculateTotals = (pavingSelections: PavingSelection[]) => {
  // Skip calculation if no selections exist
  if (pavingSelections.length === 0) {
    return { totalCost: 0, totalMargin: 0 };
  }
  
  const newTotalCost = pavingSelections.reduce((acc, selection) => acc + (selection.cost || 0), 0);
  const newTotalMargin = pavingSelections.reduce((acc, selection) => acc + (selection.totalMargin || 0), 0);
  
  // Format to 2 decimal places
  const formattedTotalCost = parseFloat(newTotalCost.toFixed(2));
  const formattedTotalMargin = parseFloat(newTotalMargin.toFixed(2));
  
  return { totalCost: formattedTotalCost, totalMargin: formattedTotalMargin };
};
