
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PavingTypeSelector } from "./PavingTypeSelector";
import { MetersInput } from "./MetersInput";
import { CostBreakdown } from "./CostBreakdown";
import { NoPoolWarning } from "./NoPoolWarning";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  markAsChanged
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h3 className="text-xl font-semibold">Extra Paving</h3>
        <p className="text-gray-500">Calculate additional paving costs</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-t mt-2 pt-4">
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
                  marginCost={marginCost}
                  totalCost={totalCost}
                  pavingDetails={pavingDetails}
                  concreteDetails={concreteDetails}
                  labourDetails={labourDetails}
                  meters={meters}
                />
              )}

              {/* Only show Remove button */}
              {hasCostData && (
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
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
