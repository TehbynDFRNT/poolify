
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
