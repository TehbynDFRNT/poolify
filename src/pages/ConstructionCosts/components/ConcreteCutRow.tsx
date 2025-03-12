
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ConcreteCut } from "@/types/concrete-cut";

interface ConcreteCutRowProps {
  cut: ConcreteCut;
  onUpdate: (id: string, updates: Partial<ConcreteCut>) => void;
  onDelete: (id: string) => void;
}

export const ConcreteCutRow = ({ cut, onUpdate, onDelete }: ConcreteCutRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ConcreteCut>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      cut_type: cut.cut_type,
      price: cut.price,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = () => {
    if (!editValues.cut_type) {
      return;
    }
    
    onUpdate(cut.id, editValues);
    setIsEditing(false);
    setEditValues({});
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input 
            value={editValues.cut_type || ''} 
            onChange={(e) => setEditValues({ ...editValues, cut_type: e.target.value })}
            className="max-w-[200px]"
          />
        ) : (
          cut.cut_type
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.price || ''} 
            onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cut.price)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>Edit</Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive" 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this concrete cut?")) {
                  onDelete(cut.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
