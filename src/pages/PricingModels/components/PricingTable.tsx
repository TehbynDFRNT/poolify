
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead>Price (inc GST)</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
