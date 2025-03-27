
import React, { useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed } from "lucide-react";
import { PavingSelect } from "./components/PavingSelect";
import { MetersInput } from "./components/MetersInput";
import { CostBreakdown } from "./components/CostBreakdown";
import { FormActions } from "./components/FormActions";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { usePavingOnExistingConcrete } from "./hooks/usePavingOnExistingConcrete";

interface PavingOnExistingConcreteProps {
  onChanged?: () => void;
}

export const PavingOnExistingConcrete: React.FC<PavingOnExistingConcreteProps> = React.memo(({ onChanged }) => {
  const {
    // State
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    pavingCost,
    labourCost,
    totalCost,
    isLoading,
    hasCostData,
    hasExistingData,
    extraPavingCosts,
    
    // Actions
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  } = usePavingOnExistingConcrete(onChanged);

  // Memoized callbacks to prevent recreation on renders
  const handleSelectPaving = useCallback((id: string) => {
    setSelectedPavingId(id);
  }, [setSelectedPavingId]);

  const handleMetersChange = useCallback((value: number) => {
    setMeters(value);
  }, [setMeters]);

  const handleOpenDeleteDialog = useCallback(() => {
    setShowDeleteConfirm(true);
  }, [setShowDeleteConfirm]);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteConfirm(false);
  }, [setShowDeleteConfirm]);

  return (
    <Card className="border border-gray-200 mt-6">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashed className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading paving options...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paving Selection */}
              <PavingSelect 
                selectedPavingId={selectedPavingId}
                pavingOptions={extraPavingCosts || []}
                onChange={handleSelectPaving}
                disabled={isSubmitting}
              />
              
              {/* Metres Input */}
              <MetersInput 
                meters={meters} 
                onChange={handleMetersChange}
                disabled={isSubmitting || !selectedPavingId}
              />
            </div>
            
            {/* Cost Breakdown */}
            {hasCostData && (
              <CostBreakdown 
                pavingCost={pavingCost}
                labourCost={labourCost}
                totalCost={totalCost}
              />
            )}

            {/* Action Buttons */}
            {hasCostData && (
              <FormActions
                onSave={handleSave}
                onDelete={handleOpenDeleteDialog}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                hasExistingData={hasExistingData}
              />
            )}
          </div>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
});

PavingOnExistingConcrete.displayName = "PavingOnExistingConcrete";
