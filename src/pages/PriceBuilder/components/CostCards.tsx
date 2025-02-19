
import { List, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PoolCosts } from "@/pages/ConstructionCosts/types";

interface PoolSpecificCostsCardProps {
  poolId: string;
}

export const PoolSpecificCostsCard = ({ poolId }: PoolSpecificCostsCardProps) => {
  const { data: pool, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          pool_excavation_types!pool_specifications_dig_type_id_fkey(
            *,
            excavation_dig_types(*)
          )
        `)
        .eq("id", poolId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: poolCosts } = useQuery({
    queryKey: ["pool-specific-costs", pool?.name],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      const initialPoolCosts: Record<string, PoolCosts> = {};

      // Get the initial costs for the specific pool
      const fixedName = pool?.name.replace("Westminister", "Westminster");
      if (fixedName) {
        initialPoolCosts[fixedName] = {
          peaGravel: 0,
          installFee: 0,
          truckedWater: 0,
          saltBags: 0,
          misc: 2700,
          copingSupply: 0,
          beam: 0,
          copingLay: 0
        };
      }

      return initialPoolCosts[fixedName || ""] || null;
    },
    enabled: !!pool?.name,
  });

  const calculateExcavationCost = (digType: any) => {
    if (!digType) return 0;
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Pool Specific Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Loading costs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const excavationCost = pool?.pool_excavation_types?.[0]?.excavation_dig_types?.[0]
    ? calculateExcavationCost(pool.pool_excavation_types[0].excavation_dig_types[0])
    : 0;

  if (!poolCosts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Pool Specific Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No costs found for this pool</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalCost = Object.values(poolCosts).reduce((sum, value) => sum + value, 0) + excavationCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Pool Specific Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Pea Gravel/Backfill</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.peaGravel)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Install Fee</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.installFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Trucked Water</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.truckedWater)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Salt Bags</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.saltBags)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Misc.</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.misc)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Coping Supply</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.copingSupply)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beam</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.beam)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Coping Lay</TableCell>
              <TableCell className="text-right">{formatCurrency(poolCosts.copingLay)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Excavation</TableCell>
              <TableCell className="text-right">{formatCurrency(excavationCost)}</TableCell>
            </TableRow>
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totalCost)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const FixedCostsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Fixed Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <p>Fixed costs applied to all pools will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};
