
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed } from "lucide-react";
import { PavingTypeSelector } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingTypeSelector";
import { MetersInput } from "@/pages/Quotes/components/ExtraPavingStep/components/MetersInput";
import { CostBreakdown } from "./components/CostBreakdown";
import { FormActions } from "./components/FormActions";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { usePavingOnExistingConcrete } from "./hooks/usePavingOnExistingConcrete";

export const PavingOnExistingConcrete: React.FC = () => {
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
  } = usePavingOnExistingConcrete();

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
              <PavingTypeSelector 
                selectedPavingId={selectedPavingId}
                extraPavingCosts={extraPavingCosts}
                onSelect={setSelectedPavingId}
              />
              
              {/* Metres Input */}
              <MetersInput 
                meters={meters} 
                onChange={setMeters} 
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
                onDelete={() => setShowDeleteConfirm(true)}
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
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};
