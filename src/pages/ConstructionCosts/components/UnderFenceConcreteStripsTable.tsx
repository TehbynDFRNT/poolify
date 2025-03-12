
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUnderFenceConcreteStrips } from "../hooks/useUnderFenceConcreteStrips";
import { UnderFenceConcreteStripRow } from "./UnderFenceConcreteStripRow";
import { AddUnderFenceConcreteStripRow } from "./AddUnderFenceConcreteStripRow";
import type { UnderFenceConcreteStripInsert } from "@/types/under-fence-concrete-strip";

export const UnderFenceConcreteStripsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { 
    underFenceConcreteStrips, 
    isLoading, 
    error, 
    updateMutation, 
    addMutation, 
    deleteMutation 
  } = useUnderFenceConcreteStrips();

  const handleAdd = (data: UnderFenceConcreteStripInsert) => {
    addMutation.mutate(data, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleUpdate = (id: string, updates: Partial<UnderFenceConcreteStripInsert>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!underFenceConcreteStrips?.length) return 1;
    return Math.max(...underFenceConcreteStrips.map(strip => strip.display_order)) + 1;
  };

  if (isLoading) {
    return <div>Loading under fence concrete strips...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Under Fence Concrete Strip L/M</CardTitle>
            <CardDescription>
              Configure costs and margins for under fence concrete strips
            </CardDescription>
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
              <TableHead>Cost</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddUnderFenceConcreteStripRow
                onAdd={handleAdd}
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {underFenceConcreteStrips?.map((strip) => (
              <UnderFenceConcreteStripRow
                key={strip.id}
                strip={strip}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {underFenceConcreteStrips?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No under fence concrete strips defined. Click "Add New" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
