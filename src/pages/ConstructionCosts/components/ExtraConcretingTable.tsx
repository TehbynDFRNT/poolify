
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExtraConcreting } from "../hooks/useExtraConcreting";
import { ExtraConcreting, ExtraConcretingInsert } from "@/types/extra-concreting";
import { ExtraConcretingRow } from "./ExtraConcretingRow";
import { AddExtraConcretingRow } from "./AddExtraConcretingRow";
import { formatCurrency } from "@/utils/format";
import { calculateExtraConcretingCost } from "@/utils/calculations";

export const ExtraConcretingTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { extraConcretingItems, isLoading, error, updateMutation, addMutation, deleteMutation } = useExtraConcreting();

  const handleUpdate = (id: string, updates: Partial<ExtraConcreting>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (item: ExtraConcretingInsert) => {
    addMutation.mutate(item, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading extra concreting data...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!extraConcretingItems?.length) return 1;
    return Math.max(...extraConcretingItems.map(item => item.display_order)) + 1;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(true)} 
          disabled={isAdding}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddExtraConcretingRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {extraConcretingItems?.map((item) => (
              <ExtraConcretingRow 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {extraConcretingItems?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No extra concreting items defined. Click "Add New" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
