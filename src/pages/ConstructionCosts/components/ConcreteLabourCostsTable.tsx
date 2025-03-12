
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useConcreteLabourCosts } from "../hooks/useConcreteLabourCosts";
import { ConcreteLabourCostRow } from "./ConcreteLabourCostRow";
import { AddConcreteLabourCostRow } from "./AddConcreteLabourCostRow";
import type { ConcreteLabourCost, ConcreteLabourCostInsert } from "@/types/concrete-labour-cost";

export const ConcreteLabourCostsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { concreteLabourCosts, isLoading, error, updateMutation, addMutation, deleteMutation } = useConcreteLabourCosts();

  const handleUpdate = (id: string, updates: Partial<ConcreteLabourCost>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (cost: ConcreteLabourCostInsert) => {
    addMutation.mutate(cost, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const getNextDisplayOrder = () => {
    if (!concreteLabourCosts?.length) return 1;
    return Math.max(...concreteLabourCosts.map(cost => cost.display_order)) + 1;
  };

  if (isLoading) return <div>Loading concrete labour costs...</div>;
  if (error) return <div>Error loading data: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(true)} 
          disabled={isAdding}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Concrete Labour Cost
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddConcreteLabourCostRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {concreteLabourCosts?.map((cost) => (
              <ConcreteLabourCostRow 
                key={cost.id} 
                cost={cost} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {concreteLabourCosts?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No concrete labour costs defined. Click "Add New Concrete Labour Cost" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
