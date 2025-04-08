
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { UnderFenceConcreteStrip } from "@/types/under-fence-concrete-strip";

interface UnderFenceConcreteStripRowProps {
  strip: UnderFenceConcreteStrip;
  onUpdate: (id: string, updates: Partial<UnderFenceConcreteStrip>) => void;
  onDelete: (id: string) => void;
}

export const UnderFenceConcreteStripRow = ({ 
  strip, 
  onUpdate, 
  onDelete 
}: UnderFenceConcreteStripRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedType, setEditedType] = useState(strip.type);
  const [editedCost, setEditedCost] = useState(strip.cost.toString());
  const [editedMargin, setEditedMargin] = useState(strip.margin.toString());

  const handleSave = () => {
    onUpdate(strip.id, {
      type: editedType,
      cost: parseFloat(editedCost),
      margin: parseFloat(editedMargin)
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedType(strip.type);
    setEditedCost(strip.cost.toString());
    setEditedMargin(strip.margin.toString());
    setIsEditing(false);
  };

  // Calculate total (cost + margin)
  const getTotalCost = () => {
    if (isEditing) {
      const cost = parseFloat(editedCost) || 0;
      const margin = parseFloat(editedMargin) || 0;
      return cost + margin;
    }
    return strip.cost + strip.margin;
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
          />
        ) : (
          strip.type
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedCost}
            onChange={(e) => setEditedCost(e.target.value)}
          />
        ) : (
          formatCurrency(strip.cost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedMargin}
            onChange={(e) => setEditedMargin(e.target.value)}
          />
        ) : (
          formatCurrency(strip.margin)
        )}
      </TableCell>
      <TableCell>
        {formatCurrency(getTotalCost())}
      </TableCell>
      <TableCell className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(strip.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};
