
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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

  // Find concrete cost and dust cost
  const concreteCost = costs.find(cost => cost.name === 'Concrete Cost')?.amount || 0;
  const dustCost = costs.find(cost => cost.name === 'Dust')?.amount || 0;
  const concreteTotal = concreteCost + dustCost;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Costs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Base Cost</TableHead>
            <TableHead className="text-right">Dust</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Concrete Cost</TableCell>
            <TableCell className="text-right">{formatCurrency(concreteCost)}</TableCell>
            <TableCell className="text-right">{formatCurrency(dustCost)}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(concreteTotal)}</TableCell>
          </TableRow>
          {costs.filter(cost => !['Concrete Cost', 'Dust'].includes(cost.name)).map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell className="text-right">{renderAmount(cost)}</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">{formatCurrency(cost.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
