
import React, { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useExtraConcreting } from "./hooks/useExtraConcreting";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ExtraConcretingProps {
  onChanged?: () => void;
}

export const ExtraConcreting: React.FC<ExtraConcretingProps> = ({ onChanged }) => {
  const {
    selectedType,
    meterage,
    totalCost,
    extraConcretingItems,
    isLoading,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice,
    hasExistingData,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
    handleSave
  } = useExtraConcreting(onChanged);

  // Auto-save changes when inputs change
  React.useEffect(() => {
    if (selectedType && meterage > 0) {
      // We add a debounce to avoid saving too frequently
      const timer = setTimeout(() => {
        handleSave();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedType, meterage, handleSave]);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h3 className="text-xl font-semibold">Extra Concreting</h3>
        <p className="text-gray-500">Add extra concrete areas to your project</p>
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
                <div>
                  <Label htmlFor="concrete-type">Concrete Type</Label>
                  <Select
                    value={selectedType}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger id="concrete-type" className="mt-2">
                      <SelectValue placeholder="Select concrete type" />
                    </SelectTrigger>
                    <SelectContent>
                      {extraConcretingItems?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="meterage">Meterage (m²)</Label>
                  <div className="mt-2">
                    <Input
                      id="meterage"
                      type="number"
                      step="0.1"
                      min="0"
                      value={meterage || ''}
                      onChange={handleMeterageChange}
                      disabled={!selectedType}
                      placeholder="Enter area in m²"
                    />
                  </div>
                </div>
              </div>
              
              {selectedType && meterage > 0 && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Cost Summary</h4>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>Price per m²:</div>
                    <div className="text-right">${getSelectedPrice().toFixed(2)}</div>
                    
                    <div>Area:</div>
                    <div className="text-right">{meterage} m²</div>
                    
                    <div className="font-medium border-t pt-2 mt-2">Total Cost:</div>
                    <div className="text-right font-medium border-t pt-2 mt-2">${totalCost.toFixed(2)}</div>
                  </div>
                </div>
              )}
              
              {/* Only show Remove button when needed */}
              {hasExistingData && (
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
            <AlertDialogTitle>Remove Extra Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this extra concreting data? This action cannot be undone.
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
