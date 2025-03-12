
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { ConcreteCost } from "@/types/concrete-cost";

interface ConcreteCostRowProps {
  cost: ConcreteCost;
  onUpdate: (id: string, updates: Partial<ConcreteCost>) => void;
  onDelete: (id: string) => void;
}

export const ConcreteCostRow = ({ cost, onUpdate, onDelete }: ConcreteCostRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ConcreteCost>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      description: cost.description,
      concrete_cost: cost.concrete_cost,
      dust_cost: cost.dust_cost,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = () => {
    if (!editValues.description) {
      return;
    }
    
    // Calculate the total before saving
    const concreteCost = editValues.concrete_cost !== undefined ? editValues.concrete_cost : cost.concrete_cost;
    const dustCost = editValues.dust_cost !== undefined ? editValues.dust_cost : cost.dust_cost;
    const totalCost = concreteCost + dustCost;
    
    onUpdate(cost.id, { ...editValues, total_cost: totalCost });
    setIsEditing(false);
    setEditValues({});
  };

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
            value={editValues.concrete_cost || ''} 
            onChange={(e) => {
              const concrete_cost = parseFloat(e.target.value);
              const dust_cost = editValues.dust_cost !== undefined ? editValues.dust_cost : cost.dust_cost;
              setEditValues({ 
                ...editValues, 
                concrete_cost,
                total_cost: concrete_cost + dust_cost 
              });
            }}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.concrete_cost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editValues.dust_cost || ''} 
            onChange={(e) => {
              const dust_cost = parseFloat(e.target.value);
              const concrete_cost = editValues.concrete_cost !== undefined ? editValues.concrete_cost : cost.concrete_cost;
              setEditValues({ 
                ...editValues, 
                dust_cost,
                total_cost: concrete_cost + dust_cost 
              });
            }}
            className="max-w-[100px]"
            step="0.01"
          />
        ) : (
          formatCurrency(cost.dust_cost)
        )}
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(
          (editValues.concrete_cost !== undefined ? editValues.concrete_cost : cost.concrete_cost) +
          (editValues.dust_cost !== undefined ? editValues.dust_cost : cost.dust_cost)
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
                if (window.confirm("Are you sure you want to delete this concrete cost?")) {
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
