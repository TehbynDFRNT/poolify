
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWaterFeatures } from "../hooks/useWaterFeatures";
import { WaterFeature, WaterFeatureInsert } from "@/types/water-feature";
import { WaterFeatureRow } from "./WaterFeatureRow";
import { AddWaterFeatureRow } from "./AddWaterFeatureRow";

export const WaterFeaturesTable = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { waterFeatures, isLoading, error, updateMutation, addMutation, deleteMutation } = useWaterFeatures();

  const handleUpdate = (id: string, updates: Partial<WaterFeature>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleAdd = (feature: WaterFeatureInsert) => {
    addMutation.mutate(feature, {
      onSuccess: () => setIsAdding(false)
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading water features...</div>;
  }

  if (error) {
    return <div>Error loading data: {(error as Error).message}</div>;
  }

  // Get next display order for new items
  const getNextDisplayOrder = () => {
    if (!waterFeatures?.length) return 1;
    return Math.max(...waterFeatures.map(feature => feature.display_order || 0)) + 1;
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
          Add New Water Feature
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <AddWaterFeatureRow 
                onAdd={handleAdd} 
                onCancel={() => setIsAdding(false)}
                displayOrder={getNextDisplayOrder()}
              />
            )}
            {waterFeatures?.map((feature) => (
              <WaterFeatureRow 
                key={feature.id} 
                feature={feature} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {waterFeatures?.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No water features defined. Click "Add New Water Feature" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
