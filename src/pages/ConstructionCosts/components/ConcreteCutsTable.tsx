
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
  const [editingValues, setEditingValues] = useState<{
    type: string;
    price: string;
    margin: string;
  }>({
    type: "",
    price: "",
    margin: "",
  });
  const { toast } = useToast();

  const handleEdit = (cut: ConcreteCut) => {
    setEditingId(cut.id);
    setEditingValues({
      type: cut.type,
      price: cut.price.toString(),
      margin: cut.margin?.toString() || "0",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingValues({
      type: "",
      price: "",
      margin: "",
    });
  };

  const handleChange = (field: keyof typeof editingValues, value: string) => {
    setEditingValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (id: string) => {
    const numericPrice = parseFloat(editingValues.price);
    const numericMargin = parseFloat(editingValues.margin);
    
    if (isNaN(numericPrice)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number for price",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(numericMargin)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number for margin",
        variant: "destructive"
      });
      return;
    }
    
    // Update local state
    setCuts(currentCuts =>
      currentCuts.map(cut =>
        cut.id === id
          ? { 
              ...cut, 
              type: editingValues.type,
              price: numericPrice,
              margin: numericMargin
            }
          : cut
      )
    );

    // Update database
    const { error } = await supabase
      .from('concrete_cuts')
      .update({ 
        type: editingValues.type,
        price: numericPrice,
        margin: numericMargin
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating concrete cut:', error);
      toast({
        title: "Error",
        description: "Failed to update concrete cut. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Concrete cut updated successfully",
      });
    }

    setEditingId(null);
    setEditingValues({
      type: "",
      price: "",
      margin: "",
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Concrete Cuts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuts.map((cut) => (
            <TableRow key={cut.id}>
              <TableCell className="font-medium text-left">
                {editingId === cut.id ? (
                  <Input
                    type="text"
                    value={editingValues.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  cut.type
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === cut.id ? (
                  <Input
                    type="number"
                    value={editingValues.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-32 ml-auto"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cut.price)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === cut.id ? (
                  <Input
                    type="number"
                    value={editingValues.margin}
                    onChange={(e) => handleChange("margin", e.target.value)}
                    className="w-32 ml-auto"
                    step="0.01"
                  />
                ) : (
                  formatCurrency(cut.margin || 0)
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
