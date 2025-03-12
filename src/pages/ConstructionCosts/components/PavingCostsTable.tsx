
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PavingCost } from "@/types/paving-cost";
import { formatCurrency } from "@/utils/format";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[];
}

export const PavingCostsTable: React.FC<PavingCostsTableProps> = ({ pavingCosts }) => {
  // Calculate totals for each category
  const totals = pavingCosts.reduce(
    (acc, cost) => {
      return {
        category1: acc.category1 + cost.category1,
        category2: acc.category2 + cost.category2,
        category3: acc.category3 + cost.category3,
        category4: acc.category4 + cost.category4,
      };
    },
    { category1: 0, category2: 0, category3: 0, category4: 0 }
  );

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Paving</TableHead>
            <TableHead>Category 1</TableHead>
            <TableHead>Category 2</TableHead>
            <TableHead>Category 3</TableHead>
            <TableHead>Category 4</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pavingCosts.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell>{formatCurrency(cost.category1)}</TableCell>
              <TableCell>{formatCurrency(cost.category2)}</TableCell>
              <TableCell>{formatCurrency(cost.category3)}</TableCell>
              <TableCell>{formatCurrency(cost.category4)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-semibold bg-muted/50">
            <TableCell>Cat Total</TableCell>
            <TableCell>{formatCurrency(totals.category1)}</TableCell>
            <TableCell>{formatCurrency(totals.category2)}</TableCell>
            <TableCell>{formatCurrency(totals.category3)}</TableCell>
            <TableCell>{formatCurrency(totals.category4)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
