
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
import type { ConcreteCut } from "@/types/concrete-cut";
import { useToast } from "@/hooks/use-toast";

interface ConcreteCutsTableProps {
  cuts: ConcreteCut[];
}

export const ConcreteCutsTable = ({ cuts: initialCuts }: ConcreteCutsTableProps) => {
  const [cuts, setCuts] = useState(initialCuts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCellClick = (id: string) => {
    setEditingId(id);
  };

  const handlePriceChange = async (id: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    
    // Update local state
    setCuts(currentCuts =>
      currentCuts.map(cut =>
        cut.id === id
          ? { ...cut, price: numericValue }
          : cut
      )
    );

    // Update database
    const { error } = await supabase
      .from('concrete_cuts')
      .update({ price: numericValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating price:', error);
      toast({
        title: "Error",
        description: "Failed to update price. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Price updated successfully",
      });
    }

    setEditingId(null);
  };

  const renderCell = (cut: ConcreteCut) => {
    const isEditing = editingId === cut.id;

    if (isEditing) {
      return (
        <Input
          type="number"
          defaultValue={cut.price.toString()}
          className="w-32"
          autoFocus
          onBlur={(e) => handlePriceChange(cut.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePriceChange(cut.id, (e.target as HTMLInputElement).value);
            }
          }}
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => handleCellClick(cut.id)}
      >
        {formatCurrency(cut.price)}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Concrete Cuts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuts.map((cut) => (
            <TableRow key={cut.id}>
              <TableCell className="font-medium text-left">{cut.type}</TableCell>
              <TableCell className="text-right">{renderCell(cut)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
