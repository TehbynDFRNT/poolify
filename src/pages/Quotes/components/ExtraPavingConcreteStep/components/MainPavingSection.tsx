
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PavingTypeSelector } from "./PavingTypeSelector";
import { MetersInput } from "./MetersInput";
import { CostBreakdown } from "./CostBreakdown";
import { NoPoolWarning } from "./NoPoolWarning";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Save, SquareDashed } from "lucide-react";

interface MainPavingSectionProps {
  quoteData: any;
  selectedPavingId: string;
  meters: number;
  hasCostData: boolean;
  isLoading: boolean;
  extraPavingCosts?: ExtraPavingCost[];
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails: any;
  concreteDetails: any;
  labourDetails: any;
  onSelectedPavingChange: (id: string) => void;
  onMetersChange: (value: number) => void;
  onRemove: () => void;
  markAsChanged: () => void;
  onSave: () => void;
  isSubmitting: boolean;
  hasExistingData: boolean;
}

export const MainPavingSection: React.FC<MainPavingSectionProps> = ({
  quoteData,
  selectedPavingId,
  meters,
  hasCostData,
  isLoading,
  extraPavingCosts,
  perMeterCost,
  materialCost,
  labourCost,
  marginCost,
  totalCost,
  pavingDetails,
  concreteDetails,
  labourDetails,
  onSelectedPavingChange,
  onMetersChange,
  onRemove,
  markAsChanged,
  onSave,
  isSubmitting,
  hasExistingData
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Log selected paving for debugging
  useEffect(() => {
    console.log("MainPavingSection: Selected paving ID =", selectedPavingId, "meters =", meters);
    console.log("Has existing data:", hasExistingData);
  }, [selectedPavingId, meters, hasExistingData]);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await onRemove();
      toast.success("Extra paving data removed successfully");
    } catch (error) {
      console.error("Error removing extra paving:", error);
      toast.error("Failed to remove extra paving data");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Determine if we should show the saved cost in the header
  const showHeaderCost = hasExistingData && (totalCost > 0 || quoteData.selected_paving_cost > 0);
  const headerCostValue = hasExistingData ? (totalCost || quoteData.selected_paving_cost || 0) : 0;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashed className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Extra Paving and Concrete</h3>
        </div>
        {showHeaderCost && (
          <span className="text-green-600 text-sm font-medium">
            ${headerCostValue.toFixed(2)}
          </span>
        )}
      </CardHeader>
      
      <CardContent className="p-5">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading paving options...</div>
        ) : (
          <div className="space-y-6">
            {!quoteData.pool_id && <NoPoolWarning />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paving Selection */}
              <PavingTypeSelector 
                selectedPavingId={selectedPavingId}
                extraPavingCosts={extraPavingCosts}
                onSelect={onSelectedPavingChange}
              />
              
              {/* Metres Input */}
              <MetersInput 
                meters={meters} 
                onChange={onMetersChange} 
              />
            </div>
            
            {/* Cost Breakdown */}
            {hasCostData && (
              <CostBreakdown
                perMeterCost={perMeterCost}
                materialCost={materialCost}
                labourCost={labourCost}
                totalCost={totalCost}
                marginCost={marginCost}
                pavingDetails={pavingDetails}
                concreteDetails={concreteDetails}
                labourDetails={labourDetails}
                meters={meters}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                onClick={onSave}
                disabled={isSubmitting || (!hasCostData && !hasExistingData)}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              
              {(hasCostData || hasExistingData) && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting || isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Removing..." : "Remove"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Paving</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this extra paving data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemove}
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
