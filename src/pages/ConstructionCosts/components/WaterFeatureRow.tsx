
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { WaterFeature } from "@/types/water-feature";

interface WaterFeatureRowProps {
  feature: WaterFeature;
  onUpdate: (id: string, updates: Partial<WaterFeature>) => void;
  onDelete: (id: string) => void;
}

export const WaterFeatureRow = ({ feature, onUpdate, onDelete }: WaterFeatureRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<WaterFeature>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      name: feature.name,
      description: feature.description,
      price: feature.price,
      margin: feature.margin,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = () => {
    if (!editValues.description || editValues.price === undefined || editValues.margin === undefined) {
      return;
    }
    
    onUpdate(feature.id, editValues);
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
          feature.description
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
          formatCurrency(feature.price)
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
          formatCurrency(feature.margin)
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
                if (window.confirm("Are you sure you want to delete this water feature?")) {
                  onDelete(feature.id);
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
