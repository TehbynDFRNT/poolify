
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { usePavingOnExistingConcrete } from "./hooks/usePavingOnExistingConcrete";
import { PavingSelect } from "./components/PavingSelect";
import { MetersInput } from "./components/MetersInput";
import { CostBreakdown } from "./components/CostBreakdown";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    hasCostData,
    hasExistingData,
    isLoading,
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
    extraPavingCosts,
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  } = usePavingOnExistingConcrete(onChanged);

  // Auto-save changes when inputs change
  React.useEffect(() => {
    if (selectedPavingId && meters > 0) {
      // We add a debounce to avoid saving too frequently
      const timer = setTimeout(() => {
        handleSave();
      }, 1000); 
      
      return () => clearTimeout(timer);
    }
  }, [selectedPavingId, meters]);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h3 className="text-xl font-semibold">Paving on Existing Concrete</h3>
        <p className="text-gray-500">Calculate costs for placing pavers on existing concrete</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-t mt-2 pt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PavingSelect 
                  selectedPavingId={selectedPavingId}
                  pavingOptions={extraPavingCosts || []}
                  onChange={setSelectedPavingId}
                  disabled={isSubmitting}
                />
                
                <MetersInput 
                  meters={meters}
                  onChange={setMeters}
                  disabled={isSubmitting || !selectedPavingId}
                />
              </div>
              
              {hasCostData && (
                <CostBreakdown 
                  perMeterRate={perMeterRate}
                  pavingCost={pavingCost}
                  labourCost={labourCost}
                  marginCost={marginCost}
                  totalCost={totalCost}
                  meters={meters}
                  paverCost={paverCost}
                  wastageCost={wastageCost}
                  marginPaverCost={marginPaverCost}
                  labourBaseCost={labourBaseCost}
                  labourMarginCost={labourMarginCost}
                />
              )}
              
              {/* Only show Remove button */}
              {hasExistingData && (
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Paving on Existing Concrete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this paving data? This action cannot be undone.
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
