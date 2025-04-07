
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ConcreteLabourCostInsert } from "@/types/concrete-labour-cost";

interface AddConcreteLabourCostRowProps {
  onAdd: (cost: ConcreteLabourCostInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddConcreteLabourCostRow = ({ onAdd, onCancel, displayOrder }: AddConcreteLabourCostRowProps) => {
  const [newCost, setNewCost] = useState<Partial<ConcreteLabourCostInsert>>({
    description: '',
    cost: 0,
    margin: 0,
    display_order: displayOrder,
  });

  const handleSave = () => {
    if (!newCost.description) return;
    onAdd(newCost as ConcreteLabourCostInsert);
  };

  // Calculate the total cost (cost + margin)
  const totalCost = (newCost.cost || 0) + ((newCost.cost || 0) * (newCost.margin || 0) / 100);

  return (
    <TableRow>
      <TableCell>
        <Input 
          value={newCost.description || ''} 
          onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
          className="max-w-[200px]"
          placeholder="Description"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.cost || ''} 
          onChange={(e) => setNewCost({ ...newCost, cost: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.margin || ''} 
          onChange={(e) => setNewCost({ ...newCost, margin: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0"
        />
      </TableCell>
      <TableCell>
        {formatCurrency(totalCost)}
      </TableCell>
      <TableCell className="w-[150px]">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>Save</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
