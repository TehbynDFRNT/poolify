
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
import { formatCurrency } from "@/utils/format";

type PricingTableProps = {
  pools: SupabasePoolResponse[];
};

export const PricingTable = ({ pools }: PricingTableProps) => {
  const navigate = useNavigate();

  const calculateFiltrationTotal = (pool: SupabasePoolResponse) => {
    if (!pool.standard_filtration_package) return null;
    
    const pkg = pool.standard_filtration_package;
    const total = (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      (pkg.handover_kit?.components.reduce((sum, comp) => 
        sum + ((comp.component?.price || 0) * (comp.quantity || 1)), 0) || 0)
    );

    return total;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead>Price (inc GST)</TableHead>
          <TableHead>Standard Filtration</TableHead>
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
            <TableCell>{pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : 'N/A'}</TableCell>
            <TableCell>
              {calculateFiltrationTotal(pool) !== null ? formatCurrency(calculateFiltrationTotal(pool)!) : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
