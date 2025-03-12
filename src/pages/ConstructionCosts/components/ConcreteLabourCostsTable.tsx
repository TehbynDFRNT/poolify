
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!concreteLabourCosts?.length) return 1;
    return Math.max(...concreteLabourCosts.map(cost => cost.display_order)) + 1;
  };

  if (isLoading) {
    return <div>Loading concrete labour costs...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Concrete Labour Costs</CardTitle>
            <CardDescription>Configure and manage prices for concrete labour costs</CardDescription>
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No concrete labour costs defined. Click "Add New" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
