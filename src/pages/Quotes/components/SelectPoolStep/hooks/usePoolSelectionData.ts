
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";

export const usePoolSelectionData = (selectedPoolId: string) => {
  // Fetch pool specifications
  const { data: pools, isLoading, error } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .order("range", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Pool[];
    },
  });

  // Find the selected pool
  const selectedPool = pools?.find(pool => pool.id === selectedPoolId);

  // Fetch filtration package data for the selected pool
  const { data: filtrationPackage } = useQuery({
    queryKey: ["filtration-package", selectedPool?.default_filtration_package_id],
    queryFn: async () => {
      if (!selectedPool?.default_filtration_package_id) return null;

      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          light:filtration_components!light_id (
            id, name, model_number, price
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price
          ),
          handover_kit:handover_kit_packages!handover_kit_id (
            id, 
            name,
            components:handover_kit_package_components (
              id,
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .eq('id', selectedPool.default_filtration_package_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPool?.default_filtration_package_id,
  });

  // Fetch individual costs for the selected pool
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedPoolId,
  });

  // Fetch excavation data for the selected pool
  const { data: excavationDetails } = useQuery({
    queryKey: ["pool-excavation", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `)
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.dig_type;
    },
    enabled: !!selectedPoolId,
  });

  // Fetch fixed costs
  const { data: fixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch margin data
  const { data: marginData } = useQuery({
    queryKey: ["pool-margin", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", selectedPoolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
    enabled: !!selectedPoolId,
  });

  // Calculate costs if we have the necessary data
  const calculateTotalCosts = () => {
    if (!selectedPool) return null;
    
    const basePrice = selectedPool.buy_price_inc_gst || 0;
    const filtrationCost = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;
    const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
    
    // Individual costs
    const individualCostsTotal = poolCosts ? Object.entries(poolCosts).reduce((sum, [key, value]) => {
      if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0) : 0;
    
    // Excavation cost
    const excavationCost = excavationDetails ? calculateGrandTotal(excavationDetails) : 0;
    
    // Calculate the grand total
    const total = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost;
    
    // Calculate margin, RRP and actual margin
    const marginPercentage = marginData || 0;
    const rrp = marginPercentage >= 100 ? 0 : total / (1 - marginPercentage / 100);
    const actualMargin = rrp - total;
    
    return {
      basePrice,
      filtrationCost,
      fixedCostsTotal,
      individualCostsTotal,
      excavationCost,
      total,
      marginPercentage,
      rrp,
      actualMargin
    };
  };

  // Group pools by range for better organization in the dropdown
  const poolsByRange = pools?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, Pool[]>) || {};

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
    calculateTotalCosts
  };
};
