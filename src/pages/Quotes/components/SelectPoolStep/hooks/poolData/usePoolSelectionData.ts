
import { useState } from "react";
import { usePoolSpecifications, groupPoolsByRange } from './usePoolSpecifications';
import { useFiltrationPackage } from './useFiltrationPackage';
import { usePoolCostsData } from './usePoolCostsData';
import { useExcavationData } from './useExcavationData';
import { useFixedCostsData } from './useFixedCostsData';
import { useMarginData } from './useMarginData';
import { usePricingCalculator } from './usePricingCalculator';

export const usePoolSelectionData = (selectedPoolId: string) => {
  // Fetch all necessary data using the individual hooks
  const { data: pools, isLoading, error } = usePoolSpecifications();
  
  // Find the selected pool
  const selectedPool = pools?.find(pool => pool.id === selectedPoolId);
  
  // Fetch related data
  const { data: filtrationPackage } = useFiltrationPackage(selectedPool?.default_filtration_package_id);
  const { data: poolCosts } = usePoolCostsData(selectedPoolId);
  const { data: excavationDetails } = useExcavationData(selectedPoolId);
  const { data: fixedCosts } = useFixedCostsData();
  const { data: marginData } = useMarginData(selectedPoolId);
  
  // Initialize pricing calculator
  const { totalCosts, calculateTotalCosts } = usePricingCalculator();
  
  // Group pools by range for better organization in the dropdown
  const poolsByRange = groupPoolsByRange(pools);

  // Calculate costs function that uses the pricing calculator
  const calculateCostsData = () => {
    return calculateTotalCosts(
      selectedPool,
      filtrationPackage,
      fixedCosts,
      poolCosts,
      excavationDetails,
      marginData
    );
  };

  return {
    pools,
    poolsByRange,
    selectedPool,
    filtrationPackage,
    poolCosts,
    excavationDetails,
    fixedCosts,
    marginData,
    isLoading,
    error,
    calculateTotalCosts: calculateCostsData
  };
};
