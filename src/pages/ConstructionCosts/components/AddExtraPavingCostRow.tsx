
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExtraPavingCostInsert } from "@/types/extra-paving-cost";
import { formatCurrency } from "@/utils/format";

interface AddExtraPavingCostRowProps {
  onAdd: (cost: ExtraPavingCostInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddExtraPavingCostRow = ({ onAdd, onCancel, displayOrder }: AddExtraPavingCostRowProps) => {
  const [newCost, setNewCost] = useState<Partial<ExtraPavingCostInsert>>({
    category: `Category ${displayOrder}`,
    paver_cost: 0,
    wastage_cost: 0,
    margin_cost: 0,
    display_order: displayOrder,
  });

  const handleSave = () => {
    if (!newCost.category) {
      return;
    }
    
    onAdd(newCost as ExtraPavingCostInsert);
  };

  // Calculate the total
  const calculateTotal = () => {
    return (newCost.paver_cost || 0) + (newCost.wastage_cost || 0) + (newCost.margin_cost || 0);
  };

  return (
    <TableRow>
      <TableCell>
        <Input 
          value={newCost.category || ''} 
          onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}
          className="max-w-[200px]"
          placeholder="Category name"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.paver_cost || ''} 
          onChange={(e) => setNewCost({ ...newCost, paver_cost: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.wastage_cost || ''} 
          onChange={(e) => setNewCost({ ...newCost, wastage_cost: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.margin_cost || ''} 
          onChange={(e) => setNewCost({ ...newCost, margin_cost: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(calculateTotal())}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>Save</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
