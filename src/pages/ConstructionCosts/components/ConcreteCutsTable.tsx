
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  const [editingValue, setEditingValue] = useState<string>("");
  const { toast } = useToast();

  const handleEdit = (cut: ConcreteCut) => {
    setEditingId(cut.id);
    setEditingValue(cut.price.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSave = async (id: string) => {
    const numericValue = parseFloat(editingValue);
    if (isNaN(numericValue)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
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
    setEditingValue("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Concrete Cuts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuts.map((cut) => (
            <TableRow key={cut.id}>
              <TableCell className="font-medium text-left">{cut.type}</TableCell>
              <TableCell className="text-right">
                {editingId === cut.id ? (
                  <Input
                    type="number"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-32 ml-auto"
                    step="0.01"
                    autoFocus
                  />
                ) : (
                  formatCurrency(cut.price)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === cut.id ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(cut.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cut)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
