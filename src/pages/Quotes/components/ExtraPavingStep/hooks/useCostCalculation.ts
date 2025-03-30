
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { ConcreteCutSelection, UnderFenceConcreteStripSelection } from "../types";

export const useCostCalculation = (pumpPrice: number) => {
  const { quoteData } = useQuoteContext();
  
  const calculateConcreteCutsCost = (cuts: ConcreteCutSelection[]) => {
    return cuts.reduce((total, cut) => total + cut.price * cut.quantity, 0);
  };
  
  const calculateUnderFenceStripsCost = (strips: UnderFenceConcreteStripSelection[]) => {
    return strips.reduce((total, strip) => total + strip.cost * strip.quantity, 0);
  };
  
  const calculateTotalCost = (
    pavingTotalCost: number,
    isPumpRequired: boolean,
    concreteCuts: ConcreteCutSelection[],
    underFenceStrips: UnderFenceConcreteStripSelection[]
  ) => {
    const pumpCost = isPumpRequired ? pumpPrice : 0;
    const cutsCost = calculateConcreteCutsCost(concreteCuts);
    const stripsCost = calculateUnderFenceStripsCost(underFenceStrips);
    const existingConcretePavingCost = quoteData.existing_concrete_paving_cost || 0;
    
    return pavingTotalCost + pumpCost + cutsCost + stripsCost + existingConcretePavingCost;
  };
  
  return {
    calculateConcreteCutsCost,
    calculateUnderFenceStripsCost,
    calculateTotalCost
  };
};
