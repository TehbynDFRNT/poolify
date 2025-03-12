
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface ExtraPavingCostRowProps {
  cost: ExtraPavingCost;
  onUpdate: (id: string, updates: Partial<ExtraPavingCost>) => void;
  onDelete: (id: string) => void;
}

export const ExtraPavingCostRow = ({ cost, onUpdate, onDelete }: ExtraPavingCostRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ExtraPavingCost>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      category: cost.category,
      paver_cost: cost.paver_cost,
      wastage_cost: cost.wastage_cost,
      margin_cost: cost.margin_cost,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = () => {
    if (!editValues.category) {
      return;
    }
    
    onUpdate(cost.id, editValues);
    setIsEditing(false);
    setEditValues({});
  };

  // Calculate the total cost
  const calculateTotal = (cost: ExtraPavingCost, editValues?: Partial<ExtraPavingCost>) => {
    const paverCost = editValues?.paver_cost !== undefined ? editValues.paver_cost : cost.paver_cost;
    const wastageCost = editValues?.wastage_cost !== undefined ? editValues.wastage_cost : cost.wastage_cost;
    const marginCost = editValues?.margin_cost !== undefined ? editValues.margin_cost : cost.margin_cost;
    
    return paverCost + wastageCost + marginCost;
  };

  const categoryTotal = calculateTotal(cost, isEditing ? editValues : undefined);

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input 
            value={editValues.category || ''} 
            onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
            className="max-w-[200px]"
          />
        ) : (
          cost.category
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.paver_cost || ''} 
            onChange={(e) => setEditValues({ ...editValues, paver_cost: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.paver_cost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.wastage_cost || ''} 
            onChange={(e) => setEditValues({ ...editValues, wastage_cost: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.wastage_cost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.margin_cost || ''} 
            onChange={(e) => setEditValues({ ...editValues, margin_cost: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.margin_cost)
        )}
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(categoryTotal)}
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
                if (window.confirm("Are you sure you want to delete this paving cost?")) {
                  onDelete(cost.id);
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
