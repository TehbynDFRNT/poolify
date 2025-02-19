
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
    // Debug logs
    console.log('Pool:', pool.name);
    console.log('Filtration package:', pool.standard_filtration_package);
    
    if (!pool.standard_filtration_package) {
      console.log('No filtration package found');
      return null;
    }
    
    const pkg = pool.standard_filtration_package;
    
    // Debug component prices
    console.log('Light price:', pkg.light?.price);
    console.log('Pump price:', pkg.pump?.price);
    console.log('Sanitiser price:', pkg.sanitiser?.price);
    console.log('Filter price:', pkg.filter?.price);
    console.log('Handover kit:', pkg.handover_kit?.components);
    
    const total = (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      (pkg.handover_kit?.components.reduce((sum, comp) => 
        sum + (comp.component?.price || 0), 0) || 0)
    );

    console.log('Calculated total:', total);
    return total || null;
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
              {calculateFiltrationTotal(pool) ? formatCurrency(calculateFiltrationTotal(pool)!) : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
