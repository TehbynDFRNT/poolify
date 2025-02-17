
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
import type { CraneCost } from "@/types/crane-cost";
import type { TrafficControlCost } from "@/types/traffic-control-cost";

interface CostTableProps {
  costs: (CraneCost | TrafficControlCost)[];
  editingId: string | null;
  editingPrice: string;
  onEdit: (cost: CraneCost | TrafficControlCost) => void;
  onSave: (cost: CraneCost | TrafficControlCost) => void;
  onCancel: () => void;
  onPriceChange: (value: string) => void;
  nameLabel: string;
}

export const CostTable = ({
  costs,
  editingId,
  editingPrice,
  onEdit,
  onSave,
  onCancel,
  onPriceChange,
  nameLabel,
}: CostTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{nameLabel}</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {costs.map((cost) => (
          <TableRow key={cost.id}>
            <TableCell>{cost.name}</TableCell>
            <TableCell className="text-right">
              {editingId === cost.id ? (
                <Input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => onPriceChange(e.target.value)}
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
