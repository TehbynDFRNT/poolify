
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
          <TableHead className="text-right">True Cost</TableHead>
          <TableHead className="text-right">Web Price</TableHead>
          <TableHead className="text-right">Margin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
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
