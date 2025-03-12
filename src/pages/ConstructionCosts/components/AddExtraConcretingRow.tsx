
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { ExtraConcretingInsert } from "@/types/extra-concreting";

interface AddExtraConcretingRowProps {
  onAdd: (item: ExtraConcretingInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddExtraConcretingRow = ({ onAdd, onCancel, displayOrder }: AddExtraConcretingRowProps) => {
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);

  const handleSave = () => {
    if (!type || isNaN(Number(price)) || isNaN(Number(margin))) {
      return;
    }

    onAdd({
      type,
      price: Number(price),
      margin: Number(margin),
      display_order: displayOrder,
    });
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Price"
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Margin"
          value={margin || ""}
          onChange={(e) => setMargin(Number(e.target.value))}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
