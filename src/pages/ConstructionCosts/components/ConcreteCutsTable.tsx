
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConcreteCutRow } from "./ConcreteCutRow";
import { AddConcreteCutRow } from "./AddConcreteCutRow";
import { useConcreteCuts } from "../hooks/useConcreteCuts";
import { ConcreteCut, ConcreteCutInsert } from "@/types/concrete-cut";
import { formatCurrency } from "@/utils/format";

export const ConcreteCutsTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { concreteCuts, isLoading, error, updateMutation, addMutation, deleteMutation } = useConcreteCuts();

  const handleUpdate = (id: string, updates: Partial<ConcreteCut>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (cut: ConcreteCutInsert) => {
    addMutation.mutate(cut, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading concrete cuts...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!concreteCuts?.length) return 1;
    return Math.max(...concreteCuts.map(cut => cut.display_order)) + 1;
  };

  // Calculate grand total of all cuts
  const grandTotal = concreteCuts?.reduce((sum, cut) => {
    return sum + cut.price;
  }, 0) || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(true)} 
          disabled={isAdding}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Cut Type
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cut Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddConcreteCutRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {concreteCuts?.map((cut) => (
              <ConcreteCutRow 
                key={cut.id} 
                cut={cut} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {concreteCuts?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No concrete cuts defined. Click "Add New Cut Type" to create one.
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-muted/50">
              <TableCell className="font-bold">Grand Total</TableCell>
              <TableCell className="font-bold">{formatCurrency(grandTotal)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
