
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash, X } from "lucide-react";
import { ExtraConcreting } from "@/types/extra-concreting";
import { formatCurrency } from "@/utils/format";

interface ExtraConcretingRowProps {
  item: ExtraConcreting;
  onUpdate: (id: string, updates: Partial<ExtraConcreting>) => void;
  onDelete: (id: string) => void;
}

export const ExtraConcretingRow = ({ item, onUpdate, onDelete }: ExtraConcretingRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(item.type);
  const [price, setPrice] = useState(item.price);
  const [margin, setMargin] = useState(item.margin);

  const handleSave = () => {
    if (!type || isNaN(Number(price)) || isNaN(Number(margin))) {
      return;
    }

    onUpdate(item.id, {
      type,
      price: Number(price),
      margin: Number(margin),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setType(item.type);
    setPrice(item.price);
    setMargin(item.margin);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(item.id);
    }
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full"
          />
        ) : (
          type
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full"
          />
        ) : (
          formatCurrency(price)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full"
          />
        ) : (
          margin
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
