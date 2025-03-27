
import React, { forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquareDashed } from "lucide-react";
import { PavingTypeSelector } from "../PavingTypeSelector";
import { MetersInput } from "../MetersInput";
import { CostBreakdown } from "./components/CostBreakdown";
import { FormActions } from "./components/FormActions";
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
      pavingCost,
      labourCost,
      marginCost,
      totalCost,
      isLoading,
      hasCostData,
      hasExistingData,
      extraPavingCosts,
      
      // Per meter details
      perMeterRate,
      paverCost,
      wastageCost,
      marginPaverCost,
      labourBaseCost,
      labourMarginCost,
      
      // Actions
      setSelectedPavingId,
      setMeters,
      setShowDeleteConfirm,
      handleSave,
      handleDelete,
    } = usePavingOnExistingConcrete(onChanged);
    
    // Expose methods to parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
      getData: () => {
        if (!selectedPavingId || meters <= 0) {
          return null;
        }
        
        return {
          selectedPavingId,
          meters,
          pavingCost,
          labourCost,
          marginCost,
          totalCost,
          save: handleSave
        };
      },
      handleSave,
      reset: () => {
        setSelectedPavingId("");
        setMeters(0);
      }
    }));

    // Prepare the paving details for the cost breakdown
    const pavingDetails = {
      paverCost,
      wastageCost,
      marginCost: marginPaverCost
    };

    // Prepare the labour details for the cost breakdown
    const labourDetails = {
      baseCost: labourBaseCost,
      marginCost: labourMarginCost
    };

    return (
      <Card className="border border-gray-200 mt-6">
        <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SquareDashed className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
          </div>
          {hasExistingData && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Saved
            </Badge>
          )}
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
                  marginCost={marginCost}
                  totalCost={totalCost}
                  meters={meters}
                  pavingDetails={pavingDetails}
                  labourDetails={labourDetails}
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
  }
);

PavingOnExistingConcrete.displayName = "PavingOnExistingConcrete";
