
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { PavingCost } from "../hooks/usePavingCosts";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[];
  editingId: string | null;
  editingValues: Record<string, number>;
  onEdit: (id: string, cost: PavingCost) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onValueChange: (category: string, value: number) => void;
}

export function PavingCostsTable({
  pavingCosts,
  editingId,
  editingValues,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
}: PavingCostsTableProps) {
  // Calculate totals for each category
  const totals = pavingCosts.reduce(
    (acc, cost) => {
      const isEditing = editingId === cost.id;
      return {
        category1: acc.category1 + (isEditing ? (editingValues.category1 ?? cost.category1) : cost.category1),
        category2: acc.category2 + (isEditing ? (editingValues.category2 ?? cost.category2) : cost.category2),
        category3: acc.category3 + (isEditing ? (editingValues.category3 ?? cost.category3) : cost.category3),
        category4: acc.category4 + (isEditing ? (editingValues.category4 ?? cost.category4) : cost.category4),
      };
    },
    { category1: 0, category2: 0, category3: 0, category4: 0 }
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Paving</TableHead>
            <TableHead>Category 1</TableHead>
            <TableHead>Category 2</TableHead>
            <TableHead>Category 3</TableHead>
            <TableHead>Category 4</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pavingCosts.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    type="number"
                    value={editingValues.category1 ?? cost.category1}
                    onChange={(e) => onValueChange("category1", parseFloat(e.target.value) || 0)}
                    className="w-24"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cost.category1)
                )}
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    type="number"
                    value={editingValues.category2 ?? cost.category2}
                    onChange={(e) => onValueChange("category2", parseFloat(e.target.value) || 0)}
                    className="w-24"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cost.category2)
                )}
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    type="number"
                    value={editingValues.category3 ?? cost.category3}
                    onChange={(e) => onValueChange("category3", parseFloat(e.target.value) || 0)}
                    className="w-24"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cost.category3)
                )}
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    type="number"
                    value={editingValues.category4 ?? cost.category4}
                    onChange={(e) => onValueChange("category4", parseFloat(e.target.value) || 0)}
                    className="w-24"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cost.category4)
                )}
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => onCancel()}>Cancel</Button>
                    <Button size="sm" onClick={() => onSave(cost.id)}>Save</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => onEdit(cost.id, cost)}>
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium">Cat Total</TableCell>
            <TableCell>{formatCurrency(totals.category1)}</TableCell>
            <TableCell>{formatCurrency(totals.category2)}</TableCell>
            <TableCell>{formatCurrency(totals.category3)}</TableCell>
            <TableCell>{formatCurrency(totals.category4)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
