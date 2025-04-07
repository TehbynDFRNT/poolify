
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";

interface ConcreteLabourCostRowProps {
  cost: ConcreteLabourCost;
  onUpdate: (id: string, updates: Partial<ConcreteLabourCost>) => void;
  onDelete: (id: string) => void;
}

export const ConcreteLabourCostRow = ({ cost, onUpdate, onDelete }: ConcreteLabourCostRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ConcreteLabourCost>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      description: cost.description,
      cost: cost.cost,
      margin: cost.margin,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = () => {
    if (!editValues.description) return;
    onUpdate(cost.id, editValues);
    setIsEditing(false);
    setEditValues({});
  };

  // Calculate the total (cost + margin)
  const totalCost = cost.cost + (cost.cost * cost.margin / 100);

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input 
            value={editValues.description || ''} 
            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
            className="max-w-[200px]"
          />
        ) : (
          cost.description
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.cost || ''} 
            onChange={(e) => setEditValues({ ...editValues, cost: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.cost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.margin || ''} 
            onChange={(e) => setEditValues({ ...editValues, margin: parseFloat(e.target.value) })}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          `${cost.margin}%`
        )}
      </TableCell>
      <TableCell>
        {formatCurrency(totalCost)}
      </TableCell>
      <TableCell className="w-[150px]">
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
                if (window.confirm("Are you sure you want to delete this concrete labour cost?")) {
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
