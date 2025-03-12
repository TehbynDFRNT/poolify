
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { PavingCost } from "@/types/paving-cost";
import { formatCurrency } from "@/utils/format";
import { EditPavingCostDialog } from "./EditPavingCostDialog";
import { Pencil } from "lucide-react";

interface PavingCostRowProps {
  cost: PavingCost;
  onUpdate: (id: string, updates: Partial<PavingCost>) => Promise<void>;
}

export const PavingCostRow: React.FC<PavingCostRowProps> = ({ cost, onUpdate }) => {
  return (
    <TableRow key={cost.id}>
      <TableCell className="font-medium">{cost.name}</TableCell>
      <TableCell>{formatCurrency(cost.category1)}</TableCell>
      <TableCell>{formatCurrency(cost.category2)}</TableCell>
      <TableCell>{formatCurrency(cost.category3)}</TableCell>
      <TableCell>{formatCurrency(cost.category4)}</TableCell>
      <TableCell>
        <EditPavingCostDialog cost={cost} onUpdate={onUpdate}>
          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </EditPavingCostDialog>
      </TableCell>
    </TableRow>
  );
};
