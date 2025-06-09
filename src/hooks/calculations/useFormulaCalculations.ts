import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useExtraConcreting } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useMemo } from "react";

/**
 * Hook for calculating extra paving and concrete formulas
 * Centralizes calculations used across multiple components
 */
export const useFormulaCalculations = () => {
  console.log("[useFormulaCalculations] Hook execution started.");

  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { extraConcretingItems, isLoading: isLoadingExtraConcreting } = useExtraConcreting();

  console.log("[useFormulaCalculations] Raw loading states from sub-hooks:", {
    isLoadingPaving,
    isLoadingConcrete,
    isLoadingLabour,
    isLoadingExtraConcreting,
  });
  // Using JSON.stringify to ensure full array content is logged
  console.log("[useFormulaCalculations] extraPavingCosts from sub-hook (JSON):", JSON.stringify(extraPavingCosts, null, 2));
  console.log("[useFormulaCalculations] concreteCosts from sub-hook (JSON):", JSON.stringify(concreteCosts, null, 2));
  console.log("[useFormulaCalculations] concreteLabourCosts from sub-hook (JSON):", JSON.stringify(concreteLabourCosts, null, 2));
  console.log("[useFormulaCalculations] extraConcretingItems from sub-hook (JSON):", JSON.stringify(extraConcretingItems, null, 2));

  // Calculate concrete cost per meter
  const concreteCostPerMeter = useMemo(() => {
    const cost = concreteCosts?.[0]?.total_cost || 0;
    // console.log("[useFormulaCalculations] Calculated concreteCostPerMeter:", cost);
    return cost;
  }, [concreteCosts]);

  // Calculate labour cost with margin per meter
  const labourCostWithMargin = useMemo(() => {
    if (!concreteLabourCosts?.length) {
      // console.log("[useFormulaCalculations] Calculated labourCostWithMargin (no labour costs): 0");
      return 0;
    }
    const cost = concreteLabourCosts.reduce((total, costItem) => { // Renamed inner 'cost' to 'costItem' to avoid conflict
      return total + costItem.cost + (costItem.cost * costItem.margin / 100);
    }, 0);
    // console.log("[useFormulaCalculations] Calculated labourCostWithMargin:", cost);
    return cost;
  }, [concreteLabourCosts]);

  // Calculate extra paving category totals
  const pavingCategoryTotals = useMemo(() => {
    if (!extraPavingCosts) {
      console.log("[useFormulaCalculations] pavingCategoryTotals: extraPavingCosts is null/undefined. Returning [].");
      return [];
    }
    if (extraPavingCosts.length === 0) {
      console.log("[useFormulaCalculations] pavingCategoryTotals: extraPavingCosts is empty. Returning [].");
      return [];
    }

    const result = extraPavingCosts.map(category => {
      const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
      const totalRate = categoryTotal + concreteCostPerMeter + labourCostWithMargin;

      return {
        id: category.id, // Crucial: Ensure this 'id' exists and is correct
        category: category.category,
        paverCost: category.paver_cost,
        wastageCost: category.wastage_cost,
        marginCost: category.margin_cost,
        categoryTotal,
        totalRate,
      };
    });
    console.log("[useFormulaCalculations] Calculated pavingCategoryTotals (length, first item if exists):", result.length, result.length > 0 ? JSON.stringify(result[0], null, 2) : "Empty");
    return result;
  }, [extraPavingCosts, concreteCostPerMeter, labourCostWithMargin]);

  // Calculate existing concrete labour costs
  const existingConcreteLabourCost = 100;
  const existingConcreteLabourMargin = 30;
  const existingConcreteLabourWithMargin = existingConcreteLabourCost +
    (existingConcreteLabourCost * existingConcreteLabourMargin / 100);
  // console.log("[useFormulaCalculations] Calculated existingConcreteLabourWithMargin:", existingConcreteLabourWithMargin);


  // Calculate extra paving on existing concrete totals
  const pavingOnExistingConcreteTotals = useMemo(() => {
    if (!extraPavingCosts) {
      console.log("[useFormulaCalculations] pavingOnExistingConcreteTotals: extraPavingCosts is null/undefined. Returning [].");
      return [];
    }
    if (extraPavingCosts.length === 0) {
      console.log("[useFormulaCalculations] pavingOnExistingConcreteTotals: extraPavingCosts is empty. Returning [].");
      return [];
    }

    const result = extraPavingCosts.map(category => {
      const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
      const totalRate = categoryTotal + existingConcreteLabourWithMargin;

      return {
        id: category.id, // Crucial: Ensure this 'id' exists and is correct
        category: category.category,
        paverCost: category.paver_cost,
        wastageCost: category.wastage_cost,
        marginCost: category.margin_cost,
        categoryTotal,
        totalRate,
      };
    });
    console.log("[useFormulaCalculations] Calculated pavingOnExistingConcreteTotals (length, first item if exists):", result.length, result.length > 0 ? JSON.stringify(result[0], null, 2) : "Empty");
    return result;
  }, [extraPavingCosts, existingConcreteLabourWithMargin]);

  // Calculate extra concreting totals
  const extraConcretingTotals = useMemo(() => {
    if (!extraConcretingItems) {
      // console.log("[useFormulaCalculations] extraConcretingTotals: extraConcretingItems is null/undefined. Returning [].");
      return [];
    }
    // console.log("[useFormulaCalculations] extraConcretingItems for extraConcretingTotals:", extraConcretingItems);
    const result = extraConcretingItems.map(item => {
      const totalCost = item.price + item.margin;
      return {
        id: item.id,
        type: item.type,
        price: item.price,
        margin: item.margin,
        totalCost,
      };
    });
    // console.log("[useFormulaCalculations] Calculated extraConcretingTotals (length, first item if exists):", result.length, result[0] || "Empty");
    return result;
  }, [extraConcretingItems]);

  const isLoading = isLoadingPaving || isLoadingConcrete ||
    isLoadingLabour || isLoadingExtraConcreting;

  console.log("[useFormulaCalculations] Final isLoading state:", isLoading);
  // console.log("[useFormulaCalculations] Returning:", {
  //   concreteCostPerMeter,
  //   labourCostWithMargin,
  //   pavingCategoryTotalsCount: pavingCategoryTotals.length,
  //   pavingOnExistingConcreteTotalsCount: pavingOnExistingConcreteTotals.length,
  //   extraConcretingTotalsCount: extraConcretingTotals.length,
  //   isLoading
  // }); // Commented out verbose return log, focusing on specific arrays above

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
