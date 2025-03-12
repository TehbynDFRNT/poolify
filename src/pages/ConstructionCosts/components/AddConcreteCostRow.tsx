
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConcreteCostInsert } from "@/types/concrete-cost";

interface AddConcreteCostRowProps {
  onAdd: (cost: ConcreteCostInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddConcreteCostRow = ({ onAdd, onCancel, displayOrder }: AddConcreteCostRowProps) => {
  const [newCost, setNewCost] = useState<Partial<ConcreteCostInsert>>({
    description: '',
    concrete_cost: 0,
    dust_cost: 0,
    total_cost: 0,
    display_order: displayOrder,
  });

  const handleConcreteCostChange = (value: string) => {
    const concrete_cost = parseFloat(value) || 0;
    setNewCost({ 
      ...newCost, 
      concrete_cost,
      total_cost: concrete_cost + (newCost.dust_cost || 0)
    });
  };

  const handleDustCostChange = (value: string) => {
    const dust_cost = parseFloat(value) || 0;
    setNewCost({ 
      ...newCost, 
      dust_cost,
      total_cost: (newCost.concrete_cost || 0) + dust_cost
    });
  };

  const handleSave = () => {
    if (!newCost.description) {
      return;
    }
    
    onAdd(newCost as ConcreteCostInsert);
  };

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
          value={newCost.concrete_cost || ''} 
          onChange={(e) => handleConcreteCostChange(e.target.value)}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCost.dust_cost || ''} 
          onChange={(e) => handleDustCostChange(e.target.value)}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        {(newCost.concrete_cost || 0) + (newCost.dust_cost || 0)}
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
