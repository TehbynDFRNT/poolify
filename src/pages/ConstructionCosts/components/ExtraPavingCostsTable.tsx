
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExtraPavingCostRow } from "./ExtraPavingCostRow";
import { AddExtraPavingCostRow } from "./AddExtraPavingCostRow";
import { useExtraPavingCosts } from "../hooks/useExtraPavingCosts";
import { ExtraPavingCost, ExtraPavingCostInsert } from "@/types/extra-paving-cost";

export const ExtraPavingCostsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { extraPavingCosts, isLoading, error, updateMutation, addMutation, deleteMutation } = useExtraPavingCosts();

  const handleUpdate = (id: string, updates: Partial<ExtraPavingCost>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (cost: ExtraPavingCostInsert) => {
    addMutation.mutate(cost, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading extra paving costs...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!extraPavingCosts?.length) return 1;
    return Math.max(...extraPavingCosts.map(cost => cost.display_order)) + 1;
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
          Add New Category
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Paver Cost</TableHead>
              <TableHead>Wastage Cost</TableHead>
              <TableHead>Margin Cost</TableHead>
              <TableHead>Category Total</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddExtraPavingCostRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {extraPavingCosts?.map((cost) => (
              <ExtraPavingCostRow 
                key={cost.id} 
                cost={cost} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {extraPavingCosts?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No extra paving costs defined. Click "Add New Category" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
