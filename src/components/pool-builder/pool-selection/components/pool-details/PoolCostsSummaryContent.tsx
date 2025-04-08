
import React from "react";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { useExcavation } from "@/pages/Quotes/components/SelectPoolStep/hooks/useExcavation";
import { useCrane } from "@/pages/Quotes/components/SelectPoolStep/hooks/useCrane";
import { useCostCalculation } from "@/pages/Quotes/components/SelectPoolStep/hooks/useCostCalculation";
import { formatCurrency } from "@/utils/format";
import { Separator } from "@/components/ui/separator";

interface PoolCostsSummaryContentProps {
  pool: Pool;
}

export const PoolCostsSummaryContent: React.FC<PoolCostsSummaryContentProps> = ({ pool }) => {
  // Get base pool cost
  const poolBaseCost = pool.buy_price_inc_gst || 0;
  
  // Get filtration package cost
  const { filtrationPackage } = useFiltrationPackage(pool);
  const filtrationCost = filtrationPackage 
    ? filtrationPackage.light?.price + 
      filtrationPackage.pump?.price + 
      filtrationPackage.sanitiser?.price + 
      filtrationPackage.filter?.price +
      (filtrationPackage.handover_kit?.components?.reduce((sum, component) => {
        return sum + (component.quantity * component.component.price);
      }, 0) || 0)
    : 0;
  
  // Get fixed costs
  const { data: fixedCosts, isLoading: isLoadingFixedCosts } = useQuery({
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
  const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
  
  // Get crane costs
  const { selectedCrane } = useCrane(pool.id);
  const craneCost = selectedCrane ? Number(selectedCrane.price) || 0 : 0;
  
  // Get excavation costs
  const { excavationDetails, getExcavationCost } = useExcavation(pool.id);
  const excavationCost = getExcavationCost();
  
  // Get individual pool costs
  const { data: poolCosts, isLoading: isLoadingPoolCosts } = useQuery({
    queryKey: ["pool-costs", pool.id],
    queryFn: async () => {
      if (!pool.id) return null;
      
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq('pool_id', pool.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!pool.id,
  });
  
  // Calculate individual costs total
  const individualCostsTotal = poolCosts ? 
    (poolCosts.pea_gravel || 0) + 
    (poolCosts.install_fee || 0) + 
    (poolCosts.trucked_water || 0) + 
    (poolCosts.salt_bags || 0) + 
    (poolCosts.coping_supply || 0) + 
    (poolCosts.beam || 0) + 
    (poolCosts.coping_lay || 0) +
    (poolCosts.misc || 0)
    : 0;
  
  // Calculate grand total
  const grandTotal = poolBaseCost + filtrationCost + fixedCostsTotal + craneCost + excavationCost + individualCostsTotal;
  
  if (isLoadingFixedCosts || isLoadingPoolCosts) {
    return <div className="text-center py-4">Loading costs data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pool Base Cost:</span>
          <span className="font-medium">{formatCurrency(poolBaseCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Filtration Costs:</span>
          <span className="font-medium">{formatCurrency(filtrationCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fixed Pool Costs:</span>
          <span className="font-medium">{formatCurrency(fixedCostsTotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Crane Costs:</span>
          <span className="font-medium">{formatCurrency(craneCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Excavation Costs:</span>
          <span className="font-medium">{formatCurrency(excavationCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Individual Pool Costs:</span>
          <span className="font-medium">{formatCurrency(individualCostsTotal)}</span>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex justify-between">
        <span className="text-lg font-semibold">Total Costs:</span>
        <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};
