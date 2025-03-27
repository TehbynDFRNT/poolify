
import React, { useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed } from "lucide-react";
import { PavingTypeSelector } from "../PavingTypeSelector";
import { MetersInput } from "../MetersInput";
import { CostBreakdown } from "./components/CostBreakdown";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { usePavingOnExistingConcrete } from "./hooks/usePavingOnExistingConcrete";

interface PavingOnExistingConcreteProps {
  onChanged?: () => void;
}

export const PavingOnExistingConcrete = forwardRef<any, PavingOnExistingConcreteProps>(
  ({ onChanged }, ref) => {
    const {
      // State
      selectedPavingId,
      meters,
      isSubmitting,
      isDeleting,
      showDeleteConfirm,
      hasCostData,
      hasExistingData,
      isLoading,
      
      // Cost breakdown data
      perMeterRate,
      materialCost,
      labourCost,
      marginCost,
      totalCost,
      
      // Cost details
      paverCost,
      wastageCost,
      marginPaverCost,
      labourBaseCost,
      labourMarginCost,
      
      // Dependencies
      extraPavingCosts,
      
      // Actions
      setSelectedPavingId,
      setMeters,
      setShowDeleteConfirm,
      handleSave,
      handleDelete,
      
      // Debug info
      debugInfo
    } = usePavingOnExistingConcrete();

    // Track local unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Expose methods and state to parent via ref
    useImperativeHandle(ref, () => ({
      getData: () => ({
        selectedPavingId,
        meters,
        totalCost,
        save: async () => {
          if (hasCostData) {
            await handleSave();
            setHasUnsavedChanges(false);
          }
        }
      }),
      hasUnsavedChanges
    }));

    // Track changes and notify parent
    useEffect(() => {
      setHasUnsavedChanges(true);
      if (onChanged) {
        onChanged();
      }
    }, [selectedPavingId, meters, onChanged]);

    const handlePavingChange = (id: string) => {
      setSelectedPavingId(id);
    };

    const handleMetersChange = (value: number) => {
      setMeters(value);
    };

    return (
      <Card className="border border-gray-200">
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
                  onSelect={handlePavingChange}
                />
                
                {/* Metres Input */}
                <MetersInput 
                  meters={meters} 
                  onChange={handleMetersChange} 
                />
              </div>
              
              {/* Cost Breakdown */}
              {hasCostData && (
                <CostBreakdown 
                  perMeterRate={perMeterRate}
                  materialCost={materialCost}
                  labourCost={labourCost}
                  marginCost={marginCost}
                  totalCost={totalCost}
                  pavingDetails={{
                    paverCost,
                    wastageCost,
                    marginCost: marginPaverCost
                  }}
                  labourDetails={{
                    baseCost: labourBaseCost,
                    marginCost: labourMarginCost
                  }}
                  meters={meters}
                />
              )}

              {/* Debug Info - Only in Development */}
              {process.env.NODE_ENV === 'development' && debugInfo && (
                <div className="bg-gray-100 p-3 rounded text-xs mt-2 overflow-auto">
                  <details>
                    <summary className="cursor-pointer font-medium">Debug Info</summary>
                    <pre className="mt-2">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </details>
                </div>
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
  }
);

PavingOnExistingConcrete.displayName = "PavingOnExistingConcrete";
