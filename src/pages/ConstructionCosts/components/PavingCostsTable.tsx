
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";

interface PavingCost {
  id: string;
  name: string;
  category1: number;
  category2: number;
  category3: number;
  category4: number;
}

interface PavingCostsTableProps {
  pavingCosts: PavingCost[];
  totals: {
    category1: number;
    category2: number;
    category3: number;
    category4: number;
  };
  onUpdate: (id: string, category: string, value: number) => void;
}

export function PavingCostsTable({ pavingCosts, totals, onUpdate }: PavingCostsTableProps) {
  const [editingCell, setEditingCell] = useState<{
    id: string;
    category: string;
    value: string;
  } | null>(null);

  const handleEdit = (id: string, category: string, value: number) => {
    setEditingCell({
      id,
      category,
      value: value.toString(),
    });
  };

  const handleChange = (value: string) => {
    if (editingCell) {
      setEditingCell({
        ...editingCell,
        value,
      });
    }
  };

  const handleSave = () => {
    if (editingCell) {
      const value = parseFloat(editingCell.value);
      if (!isNaN(value)) {
        onUpdate(editingCell.id, editingCell.category, value);
      }
      setEditingCell(null);
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {pavingCosts.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell>
                <EditableCell
                  value={cost.category1}
                  isEditing={editingCell?.id === cost.id && editingCell?.category === "category1"}
                  onEdit={() => handleEdit(cost.id, "category1", cost.category1)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  type="number"
                  align="right"
                  format={formatCurrency}
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={cost.category2}
                  isEditing={editingCell?.id === cost.id && editingCell?.category === "category2"}
                  onEdit={() => handleEdit(cost.id, "category2", cost.category2)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  type="number"
                  align="right"
                  format={formatCurrency}
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={cost.category3}
                  isEditing={editingCell?.id === cost.id && editingCell?.category === "category3"}
                  onEdit={() => handleEdit(cost.id, "category3", cost.category3)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  type="number"
                  align="right"
                  format={formatCurrency}
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={cost.category4}
                  isEditing={editingCell?.id === cost.id && editingCell?.category === "category4"}
                  onEdit={() => handleEdit(cost.id, "category4", cost.category4)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  type="number"
                  align="right"
                  format={formatCurrency}
                  step="0.01"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium">Cat Total</TableCell>
            <TableCell className="text-right">{formatCurrency(totals.category1)}</TableCell>
            <TableCell className="text-right">{formatCurrency(totals.category2)}</TableCell>
            <TableCell className="text-right">{formatCurrency(totals.category3)}</TableCell>
            <TableCell className="text-right">{formatCurrency(totals.category4)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
