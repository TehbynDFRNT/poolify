
import { useState } from "react";
import { usePools } from "./usePools";
import { useFiltrationPackage } from "./useFiltrationPackage";
import { usePoolCosts } from "./usePoolCosts";
import { useExcavation } from "./useExcavation";
import { useCrane } from "./useCrane";
import { useMargin } from "./useMargin";
import { useCostCalculation } from "./useCostCalculation";
import { Pool } from "@/types/pool";

export const usePoolSelectionData = (selectedPoolId: string) => {
  // Get pools data
  const { pools, poolsByRange, isLoading, error } = usePools();
  
  // Find the selected pool
  const selectedPool = pools?.find(pool => pool.id === selectedPoolId);
  
  // Get filtration package
  const { filtrationPackage } = useFiltrationPackage(selectedPool);
  
  // Get pool costs and fixed costs
  const { poolCosts, fixedCosts } = usePoolCosts(selectedPoolId);
  
  // Get excavation details
  const { excavationDetails } = useExcavation(selectedPoolId);
  
  // Get crane details
  const { selectedCrane } = useCrane(selectedPoolId);
  
  // Get margin data
  const { marginData } = useMargin(selectedPoolId);
  
  // Get cost calculation function
  const { calculateTotalCosts: calculateCosts } = useCostCalculation();
  
  // Calculate total costs wrapper function
  const calculateTotalCosts = () => {
    if (!selectedPool) return null;
    
    return calculateCosts({
      basePrice: selectedPool.buy_price_inc_gst || 0,
      filtrationPackage,
      fixedCosts,
      poolCosts,
      excavationDetails,
      selectedCrane,
      marginData
    });
  };

  return {
    pools,
    poolsByRange,
    selectedPool,
    filtrationPackage,
    poolCosts,
    excavationDetails,
    selectedCrane,
    fixedCosts,
    marginData,
    isLoading,
    error,
    calculateTotalCosts
  };
};
