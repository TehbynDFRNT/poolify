
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ExcavationDigType } from "@/types/excavation-dig-type";

type PoolCostsProps = {
  poolName: string;
};

export const PoolCosts = ({ poolName }: PoolCostsProps) => {
  const poolCosts = initialPoolCosts[poolName] || {
    truckedWater: 0,
    saltBags: 0,
    copingSupply: 0,
    beam: 0,
    copingLay: 0,
    peaGravel: 0,
    installFee: 0
  };

  const { data: digType } = useQuery({
    queryKey: ["excavation-dig-type", poolDigTypeMap[poolName]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .eq("name", poolDigTypeMap[poolName])
        .single();

      if (error) throw error;
      return data as ExcavationDigType;
    },
  });

  const excavationCost = digType ? 
    (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
    (digType.excavation_hourly_rate * digType.excavation_hours) : 0;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Pool Specific Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Installation Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pea Gravel/Backfill:</span>
                  <span>{formatCurrency(poolCosts.peaGravel)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Install Fee:</span>
                  <span>{formatCurrency(poolCosts.installFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Excavation:</span>
                  <span>{formatCurrency(excavationCost)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Trucked Water:</span>
                  <span>{formatCurrency(poolCosts.truckedWater)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salt Bags:</span>
                  <span>{formatCurrency(poolCosts.saltBags)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Coping Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Coping Supply:</span>
                  <span>{formatCurrency(poolCosts.copingSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coping Lay:</span>
                  <span>{formatCurrency(poolCosts.copingLay)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Additional Costs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Beam:</span>
                  <span>{formatCurrency(poolCosts.beam)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between">
              <h3 className="font-medium">Total Pool Costs:</h3>
              <span className="font-medium">
                {formatCurrency(
                  poolCosts.truckedWater +
                  poolCosts.saltBags +
                  poolCosts.copingSupply +
                  poolCosts.beam +
                  poolCosts.copingLay +
                  poolCosts.peaGravel +
                  poolCosts.installFee +
                  excavationCost
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
