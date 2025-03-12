
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { ConcreteLab } from "@/types/concrete-labour";

interface ConcreteLabRowProps {
  lab: ConcreteLab;
  onUpdate: (id: string, updates: Partial<ConcreteLab>) => void;
  onDelete: (id: string) => void;
}

export const ConcreteLabRow = ({ 
  lab, 
  onUpdate, 
  onDelete 
}: ConcreteLabRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedType, setEditedType] = useState(lab.type);
  const [editedPrice, setEditedPrice] = useState(lab.price.toString());
  const [editedMargin, setEditedMargin] = useState(lab.margin.toString());

  const handleSave = () => {
    onUpdate(lab.id, {
      type: editedType,
      price: parseFloat(editedPrice),
      margin: parseFloat(editedMargin)
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedType(lab.type);
    setEditedPrice(lab.price.toString());
    setEditedMargin(lab.margin.toString());
    setIsEditing(false);
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
          lab.type
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
          />
        ) : (
          formatCurrency(lab.price)
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
          formatCurrency(lab.margin)
        )}
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
              onClick={() => onDelete(lab.id)}
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
