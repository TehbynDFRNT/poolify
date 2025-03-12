
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { ConcreteLabInsert } from "@/types/concrete-labour";

interface AddConcreteLabRowProps {
  onAdd: (data: ConcreteLabInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddConcreteLabRow = ({ 
  onAdd, 
  onCancel,
  displayOrder
}: AddConcreteLabRowProps) => {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("130.00");
  const [margin, setMargin] = useState("0");

  const handleAdd = () => {
    if (!type) {
      return;
    }

    onAdd({
      type,
      price: parseFloat(price),
      margin: parseFloat(margin),
      display_order: displayOrder
    });

    // Reset form
    setType("");
    setPrice("130.00");
    setMargin("0");
  };

  return (
    <TableRow className="bg-muted/50">
      <TableCell>
        <Input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </TableCell>
      <TableCell className="text-right">
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="text-right"
        />
      </TableCell>
      <TableCell className="text-right">
        <Input
          type="number"
          placeholder="Margin"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
          className="text-right"
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!type}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
