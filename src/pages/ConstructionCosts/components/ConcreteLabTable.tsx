
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useConcreteLab } from "../hooks/useConcreteLab";
import { ConcreteLabRow } from "./ConcreteLabRow";
import { AddConcreteLabRow } from "./AddConcreteLabRow";
import type { ConcreteLab, ConcreteLabInsert } from "@/types/concrete-labour";

export const ConcreteLabTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { concreteLab, isLoading, error, updateMutation, addMutation, deleteMutation } = useConcreteLab();

  const handleUpdate = (id: string, updates: Partial<ConcreteLab>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (lab: ConcreteLabInsert) => {
    addMutation.mutate(lab, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading concrete labour...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!concreteLab?.length) return 1;
    return Math.max(...concreteLab.map(lab => lab.display_order)) + 1;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Concrete Labour</CardTitle>
            <CardDescription>Concrete labour costs per meter</CardDescription>
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
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price per L/M</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddConcreteLabRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {concreteLab?.map((lab) => (
              <ConcreteLabRow 
                key={lab.id} 
                lab={lab} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {concreteLab?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No concrete labour defined. Click "Add New" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
