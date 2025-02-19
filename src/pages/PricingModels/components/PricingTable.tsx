
import { formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import type { SupabasePoolResponse } from "../types";
import { 
  calculateFiltrationTotal,
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal
} from "../utils/calculateCosts";

type PricingTableProps = {
  pools: SupabasePoolResponse[];
  calculateTrueCost: (pool: SupabasePoolResponse) => number;
};

export const PricingTable = ({ pools, calculateTrueCost }: PricingTableProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead className="text-right">Shell Price</TableHead>
          <TableHead className="text-right">Filtration</TableHead>
          <TableHead className="text-right">Pool Specific</TableHead>
          <TableHead className="text-right">Fixed Costs</TableHead>
          <TableHead className="text-right">True Cost</TableHead>
          <TableHead className="text-right">Web Price</TableHead>
          <TableHead className="text-right">Margin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const shellPrice = pool.buy_price_inc_gst || 0;
          const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
          const poolSpecificCosts = calculatePoolSpecificCosts(pool.name, null); // We'll get digType in next update
          const fixedCostsTotal = calculateFixedCostsTotal([]);  // We'll get fixed costs in next update
          const trueCost = calculateTrueCost(pool);
          
          return (
            <TableRow 
              key={pool.id} 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => navigate(`/pricing-models/pools/${pool.id}`)}
            >
              <TableCell>{pool.range}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(shellPrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(filtrationTotal)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(poolSpecificCosts)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(fixedCostsTotal)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(trueCost)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(0)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(0)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
