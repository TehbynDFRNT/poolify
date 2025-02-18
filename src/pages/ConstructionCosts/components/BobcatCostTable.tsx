
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { BobcatCost } from "@/types/bobcat-cost";

interface BobcatCostTableProps {
  costs: BobcatCost[];
  editingId: string | null;
  editingPrice: string;
  onEdit: (cost: BobcatCost) => void;
  onSave: (cost: BobcatCost) => void;
  onCancel: () => void;
}

export const BobcatCostTable = ({
  costs,
  editingId,
  editingPrice,
  onEdit,
  onSave,
  onCancel,
}: BobcatCostTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {costs.map((cost) => (
          <TableRow key={cost.id}>
            <TableCell>{cost.day_code}</TableCell>
            <TableCell className="text-right">
              {editingId === cost.id ? (
                <Input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => onEdit({ ...cost, price: parseFloat(e.target.value) })}
                  className="w-32 ml-auto"
                  step="0.01"
                />
              ) : (
                formatCurrency(cost.price)
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === cost.id ? (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSave(cost)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(cost)}
                >
                  Edit
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
