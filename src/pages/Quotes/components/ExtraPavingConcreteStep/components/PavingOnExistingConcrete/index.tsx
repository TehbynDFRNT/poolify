
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PavingSelectionForm } from "./components/PavingSelectionForm";
import { CostBreakdown } from "../../components/CostBreakdown";
import { usePavingOnExistingConcrete } from "./hooks/usePavingOnExistingConcrete";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Layers } from "lucide-react";
import { LoadingIndicator } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/PavingOnExistingConcrete/components/LoadingIndicator";

interface PavingOnExistingConcreteProps {
  onChanged?: () => void;
}

export const PavingOnExistingConcrete: React.FC<PavingOnExistingConcreteProps> = ({ onChanged }) => {
  const {
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    perMeterRate,
    pavingCost,
    labourCost,
    marginCost,
    totalCost,
    paverCost,
    wastageCost,
    marginPaverCost,
    labourBaseCost,
    labourMarginCost,
    isLoading,
    hasCostData,
    hasExistingData,
    extraPavingCosts,
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  } = usePavingOnExistingConcrete(onChanged);

  const handleSelectPaving = (id: string) => {
    setSelectedPavingId(id);
  };

  const handleChangeMeter = (value: number) => {
    setMeters(value);
  };

  // Early rendering states
  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <LoadingIndicator message="Loading paving options..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
        </div>
        {hasExistingData && (
          <div className="text-right">
            <div className="text-lg font-semibold">${totalCost.toFixed(2)}</div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5">
        <div className="space-y-6">
          <PavingSelectionForm
            selectedPavingId={selectedPavingId}
            meters={meters}
            extraPavingCosts={extraPavingCosts}
            onSelectPaving={handleSelectPaving}
            onChangeMeter={handleChangeMeter}
          />

          {hasCostData && (
            <CostBreakdown
              perMeterCost={perMeterRate}
              materialCost={pavingCost}
              labourCost={labourCost}
              totalCost={totalCost}
              marginCost={marginCost}
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

          {/* Action buttons */}
          {hasCostData && (
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>

              {hasExistingData && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Removing..." : "Remove"}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Paving on Existing Concrete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this paving on existing concrete data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
