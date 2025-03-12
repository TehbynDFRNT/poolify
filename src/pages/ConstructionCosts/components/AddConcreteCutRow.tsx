
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConcreteCutInsert } from "@/types/concrete-cut";

interface AddConcreteCutRowProps {
  onAdd: (cut: ConcreteCutInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddConcreteCutRow = ({ onAdd, onCancel, displayOrder }: AddConcreteCutRowProps) => {
  const [newCut, setNewCut] = useState<Partial<ConcreteCutInsert>>({
    cut_type: `Cut Type ${displayOrder}`,
    price: 0,
    display_order: displayOrder,
  });

  const handleSave = () => {
    if (!newCut.cut_type) {
      return;
    }
    
    onAdd(newCut as ConcreteCutInsert);
  };

  return (
    <TableRow>
      <TableCell>
        <Input 
          value={newCut.cut_type || ''} 
          onChange={(e) => setNewCut({ ...newCut, cut_type: e.target.value })}
          className="max-w-[200px]"
          placeholder="Cut type"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          value={newCut.price || ''} 
          onChange={(e) => setNewCut({ ...newCut, price: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
          placeholder="0.00"
        />
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
