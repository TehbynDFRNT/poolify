
import { useMemo } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useExtraConcreting } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";

/**
 * Hook for calculating extra paving and concrete formulas
 * Centralizes calculations used across multiple components
 */
export const useFormulaCalculations = () => {
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { extraConcretingItems, isLoading: isLoadingExtraConcreting } = useExtraConcreting();

  // Calculate concrete cost per meter
  const concreteCostPerMeter = useMemo(() => {
    return concreteCosts?.[0]?.total_cost || 0;
  }, [concreteCosts]);

  // Calculate labour cost with margin per meter
  const labourCostWithMargin = useMemo(() => {
    if (!concreteLabourCosts?.length) return 0;
    
    return concreteLabourCosts.reduce((total, cost) => {
      return total + cost.cost + (cost.cost * cost.margin / 100);
    }, 0);
  }, [concreteLabourCosts]);

  // Calculate extra paving category totals
  const pavingCategoryTotals = useMemo(() => {
    if (!extraPavingCosts) return [];
    
    return extraPavingCosts.map(category => {
      const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
      const totalRate = categoryTotal + concreteCostPerMeter + labourCostWithMargin;
      
      return {
        id: category.id,
        category: category.category,
        paverCost: category.paver_cost,
        wastageCost: category.wastage_cost,
        marginCost: category.margin_cost,
        categoryTotal,
        totalRate,
      };
    });
  }, [extraPavingCosts, concreteCostPerMeter, labourCostWithMargin]);

  // Calculate existing concrete labour costs
  const existingConcreteLabourCost = 100;
  const existingConcreteLabourMargin = 30;
  const existingConcreteLabourWithMargin = existingConcreteLabourCost + 
    (existingConcreteLabourCost * existingConcreteLabourMargin / 100);

  // Calculate extra paving on existing concrete totals
  const pavingOnExistingConcreteTotals = useMemo(() => {
    if (!extraPavingCosts) return [];
    
    return extraPavingCosts.map(category => {
      const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
      const totalRate = categoryTotal + existingConcreteLabourWithMargin;
      
      return {
        id: category.id,
        category: category.category,
        paverCost: category.paver_cost,
        wastageCost: category.wastage_cost,
        marginCost: category.margin_cost,
        categoryTotal,
        totalRate,
      };
    });
  }, [extraPavingCosts, existingConcreteLabourWithMargin]);

  // Calculate extra concreting totals
  const extraConcretingTotals = useMemo(() => {
    if (!extraConcretingItems) return [];
    
    return extraConcretingItems.map(item => {
      const totalCost = item.price + item.margin;
      
      return {
        id: item.id,
        type: item.type,
        price: item.price,
        margin: item.margin,
        totalCost,
      };
    });
  }, [extraConcretingItems]);

  const isLoading = isLoadingPaving || isLoadingConcrete || 
                    isLoadingLabour || isLoadingExtraConcreting;

  return {
    // Raw data
    extraPavingCosts,
    concreteCosts,
    concreteLabourCosts,
    extraConcretingItems,
    
    // Calculated values
    concreteCostPerMeter,
    labourCostWithMargin,
    pavingCategoryTotals,
    existingConcreteLabourCost,
    existingConcreteLabourMargin,
    existingConcreteLabourWithMargin,
    pavingOnExistingConcreteTotals,
    extraConcretingTotals,
    
    // Loading states
    isLoadingPaving,
    isLoadingConcrete,
    isLoadingLabour,
    isLoadingExtraConcreting,
    isLoading,
  };
};
