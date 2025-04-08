
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { UnderFenceConcreteStripInsert } from "@/types/under-fence-concrete-strip";
import { formatCurrency } from "@/utils/format";

interface AddUnderFenceConcreteStripRowProps {
  onAdd: (data: UnderFenceConcreteStripInsert) => void;
  onCancel: () => void;
  displayOrder: number;
}

export const AddUnderFenceConcreteStripRow = ({ 
  onAdd, 
  onCancel,
  displayOrder
}: AddUnderFenceConcreteStripRowProps) => {
  const [type, setType] = useState("");
  const [cost, setCost] = useState("");
  const [margin, setMargin] = useState("");

  const handleAdd = () => {
    if (!type || !cost || !margin) {
      return;
    }

    onAdd({
      type,
      cost: parseFloat(cost),
      margin: parseFloat(margin),
      display_order: displayOrder
    });

    // Reset form
    setType("");
    setCost("");
    setMargin("");
  };

  // Calculate total (cost + margin)
  const getTotal = () => {
    const costValue = parseFloat(cost) || 0;
    const marginValue = parseFloat(margin) || 0;
    return costValue + marginValue;
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
      <TableCell>
        <Input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Margin"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
        />
      </TableCell>
      <TableCell>
        {(cost || margin) ? formatCurrency(getTotal()) : "-"}
      </TableCell>
      <TableCell className="flex justify-end gap-2">
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
          disabled={!type || !cost || !margin}
        >
          <Check className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
