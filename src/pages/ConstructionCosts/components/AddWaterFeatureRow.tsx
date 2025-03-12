
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { WaterFeatureInsert } from "@/types/water-feature";

interface AddWaterFeatureRowProps {
  onAdd: (feature: WaterFeatureInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddWaterFeatureRow = ({ onAdd, onCancel, displayOrder }: AddWaterFeatureRowProps) => {
  const [newFeature, setNewFeature] = useState<Partial<WaterFeatureInsert>>({
    name: "Water Feature",
    description: "",
    price: 0,
    margin: 0,
    display_order: displayOrder
  });

  const handleSave = () => {
    if (!newFeature.description || newFeature.price === undefined || newFeature.margin === undefined) {
      return;
    }

    onAdd(newFeature as WaterFeatureInsert);
  };

  const isValid = 
    newFeature.description && 
    newFeature.description.trim() !== "" && 
    newFeature.price !== undefined &&
    newFeature.margin !== undefined;

  return (
    <TableRow className="bg-muted/30">
      <TableCell>
        <Input 
          placeholder="Description (e.g. 1.6m x 0.8m)"
          value={newFeature.description || ''} 
          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
          className="max-w-[200px]"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          placeholder="Price"
          value={newFeature.price || ''} 
          onChange={(e) => setNewFeature({ ...newFeature, price: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="number"
          placeholder="Margin"
          value={newFeature.margin || ''} 
          onChange={(e) => setNewFeature({ ...newFeature, margin: parseFloat(e.target.value) })}
          className="max-w-[100px]"
          step="0.01"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
            disabled={!isValid}
          >
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
