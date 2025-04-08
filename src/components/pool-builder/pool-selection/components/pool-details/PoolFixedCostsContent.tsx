
import React from "react";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FixedCost } from "@/types/fixed-cost";

interface PoolFixedCostsContentProps {
  pool: Pool;
}

export const PoolFixedCostsContent: React.FC<PoolFixedCostsContentProps> = ({ pool }) => {
  // Fetch fixed costs data
  const { data: fixedCosts, isLoading } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as FixedCost[];
    },
  });

  // Calculate the total of all fixed costs
  const totalFixedCosts = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;

  if (isLoading) {
    return <div className="text-center py-4">Loading fixed costs...</div>;
  }

  if (!fixedCosts || fixedCosts.length === 0) {
    return <div className="text-muted-foreground">No fixed costs found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {fixedCosts.map((cost) => (
          <div key={cost.id} className="flex justify-between">
            <span className="text-muted-foreground">{cost.name}:</span>
            <span className="font-medium">${cost.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-3 mt-4">
        <div className="flex justify-between">
          <span className="font-semibold">Total Fixed Costs:</span>
          <span className="font-semibold">${totalFixedCosts.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
