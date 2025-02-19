
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateFiltrationTotal, calculatePoolSpecificCosts, calculateFixedCostsTotal } from "../utils/calculateCosts";
import type { SupabasePoolResponse } from "../types";

type PricingTableProps = {
  pools: SupabasePoolResponse[];
};

export const PricingTable = ({ pools }: PricingTableProps) => {
  const navigate = useNavigate();

  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  const calculateTrueCost = (pool: SupabasePoolResponse) => {
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, null); // We don't have dig type here, so passing null
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);

    return poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead className="text-right">True Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => (
          <TableRow 
            key={pool.id} 
            className="cursor-pointer hover:bg-gray-50" 
            onClick={() => navigate(`/pricing-models/pools/${pool.id}`)}
          >
            <TableCell>{pool.range}</TableCell>
            <TableCell>{pool.name}</TableCell>
            <TableCell className="text-right">{formatCurrency(calculateTrueCost(pool))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
