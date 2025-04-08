
import React from "react";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface PoolIndividualCostsContentProps {
  pool: Pool;
}

export const PoolIndividualCostsContent: React.FC<PoolIndividualCostsContentProps> = ({ pool }) => {
  // Get individual pool costs for the selected pool
  const { data: poolCosts, isLoading, error } = useQuery({
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
        <p className="text-muted-foreground">Loading individual costs information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-4">
        Failed to load individual costs. Please try again.
      </div>
    );
  }

  // Initialize costs with zeros if no data is available
  const costs = poolCosts || {
    pea_gravel: 0,
    install_fee: 0,
    trucked_water: 0,
    salt_bags: 0,
    coping_supply: 0,
    beam: 0,
    coping_lay: 0
  };

  // Calculate total costs
  const totalCosts = 
    (costs.pea_gravel || 0) + 
    (costs.install_fee || 0) + 
    (costs.trucked_water || 0) + 
    (costs.salt_bags || 0) + 
    (costs.coping_supply || 0) + 
    (costs.beam || 0) + 
    (costs.coping_lay || 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-y-3">
        <div>
          <span className="text-muted-foreground text-sm">Pea Gravel:</span>
          <p className="font-medium">{formatCurrency(costs.pea_gravel || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Install Fee:</span>
          <p className="font-medium">{formatCurrency(costs.install_fee || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Trucked Water:</span>
          <p className="font-medium">{formatCurrency(costs.trucked_water || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Salt Bags:</span>
          <p className="font-medium">{formatCurrency(costs.salt_bags || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Coping Supply:</span>
          <p className="font-medium">{formatCurrency(costs.coping_supply || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Beam:</span>
          <p className="font-medium">{formatCurrency(costs.beam || 0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">Coping Lay:</span>
          <p className="font-medium">{formatCurrency(costs.coping_lay || 0)}</p>
        </div>
      </div>
      
      <div className="border-t pt-3 mt-2">
        <div className="flex justify-between">
          <span className="font-medium">Total Individual Costs:</span>
          <span className="font-bold">{formatCurrency(totalCosts)}</span>
        </div>
      </div>
    </div>
  );
};
