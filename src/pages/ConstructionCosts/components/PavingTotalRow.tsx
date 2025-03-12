
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

interface PavingTotalRowProps {
  totals: {
    category1: number;
    category2: number;
    category3: number;
    category4: number;
  };
}

export const PavingTotalRow: React.FC<PavingTotalRowProps> = ({ totals }) => {
  return (
    <TableRow className="font-semibold bg-muted/50">
      <TableCell>Cat Total</TableCell>
      <TableCell>{formatCurrency(totals.category1)}</TableCell>
      <TableCell>{formatCurrency(totals.category2)}</TableCell>
      <TableCell>{formatCurrency(totals.category3)}</TableCell>
      <TableCell>{formatCurrency(totals.category4)}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
