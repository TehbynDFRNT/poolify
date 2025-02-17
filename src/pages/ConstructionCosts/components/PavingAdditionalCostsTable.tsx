
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PavingAdditionalCost } from "@/types/paving-additional-cost";

interface PavingAdditionalCostsTableProps {
  costs: PavingAdditionalCost[];
}

export const PavingAdditionalCostsTable = ({ costs: initialCosts }: PavingAdditionalCostsTableProps) => {
  const [costs, setCosts] = useState(initialCosts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCellClick = (id: string) => {
    setEditingId(id);
  };

  const handleAmountChange = async (id: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    // Update local state
    setCosts(currentCosts =>
      currentCosts.map(cost =>
        cost.id === id
          ? { ...cost, amount: numericValue }
          : cost
      )
    );

    // Update database
    const { error } = await supabase
      .from('paving_additional_costs')
      .update({ amount: numericValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating cost:', error);
    }

    setEditingId(null);
  };

  const renderAmount = (cost: PavingAdditionalCost) => {
    const isEditing = editingId === cost.id;

    if (isEditing) {
      return (
        <Input
          type="number"
          defaultValue={cost.amount.toString()}
          className="w-32"
          autoFocus
          onBlur={(e) => handleAmountChange(cost.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAmountChange(cost.id, (e.target as HTMLInputElement).value);
            }
          }}
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => handleCellClick(cost.id)}
      >
        {formatCurrency(cost.amount)}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Costs</h2>
      <Table>
        <TableBody>
          {costs.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell className="text-right">{renderAmount(cost)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
