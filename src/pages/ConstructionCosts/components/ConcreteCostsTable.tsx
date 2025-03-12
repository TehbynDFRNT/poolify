
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConcreteCostRow } from "./ConcreteCostRow";
import { AddConcreteCostRow } from "./AddConcreteCostRow";
import { useConcreteCosts } from "../hooks/useConcreteCosts";
import { ConcreteCost, ConcreteCostInsert } from "@/types/concrete-cost";
import { formatCurrency } from "@/utils/format";

export const ConcreteCostsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { concreteCosts, isLoading, error, updateMutation, addMutation, deleteMutation } = useConcreteCosts();

  const handleUpdate = (id: string, updates: Partial<ConcreteCost>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (cost: ConcreteCostInsert) => {
    addMutation.mutate(cost, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading concrete costs...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!concreteCosts?.length) return 1;
    return Math.max(...concreteCosts.map(cost => cost.display_order)) + 1;
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
          Add New Concrete Cost
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Concrete ($/m)</TableHead>
              <TableHead>Dust ($/m)</TableHead>
              <TableHead>Total ($/m)</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddConcreteCostRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {concreteCosts?.map((cost) => (
              <ConcreteCostRow 
                key={cost.id} 
                cost={cost} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {concreteCosts?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No concrete costs defined. Click "Add New Concrete Cost" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
