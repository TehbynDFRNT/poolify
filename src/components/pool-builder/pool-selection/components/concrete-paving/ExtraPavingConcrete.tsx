import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";

interface ExtraPavingConcreteProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

// Define an interface for the data we're expecting from Supabase
interface PoolPavingSelectionData {
  id?: string;
  pool_project_id?: string;
  extra_paving_category?: string | null;
  extra_paving_square_meters?: number | null;
  extra_paving_total_cost?: number | null;
}

export const ExtraPavingConcrete: React.FC<ExtraPavingConcreteProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  console.log('[ExtraPavingConcrete] Component mounted/rendered. CustomerId:', customerId);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [pavingSelectionId, setPavingSelectionId] = useState<string | null>(null);
  const { pavingCategoryTotals, labourCostWithMargin, isLoading: isCategoriesLoading, concreteCostPerMeter } = useFormulaCalculations();

  useEffect(() => {
    if (!isCategoriesLoading && pavingCategoryTotals && pavingCategoryTotals.length > 0) {
      // console.log('[ExtraPavingConcrete] pavingCategoryTotals is ready. First item:', pavingCategoryTotals[0]);
    } else if (isCategoriesLoading) {
      // console.log('[ExtraPavingConcrete] pavingCategoryTotals is still loading...');
    }
  }, [pavingCategoryTotals, isCategoriesLoading]);

  const {
    handleSave,
    handleDelete,
    isSubmitting,
    isDeleting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  useEffect(() => {
    if (customerId && !isCategoriesLoading && pavingCategoryTotals && pavingCategoryTotals.length > 0) {
      // console.log('[ExtraPavingConcrete] Conditions met: Fetching existing data.');
      fetchExistingData();
    } else {
      // console.log('[ExtraPavingConcrete] Deferring fetch: customerId or categories not ready.');
      if (!isCategoriesLoading && (!pavingCategoryTotals || pavingCategoryTotals.length === 0)) {
        setIsLoading(false);
      }
    }
  }, [customerId, isCategoriesLoading, pavingCategoryTotals]);

  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      if (!pavingCategoryTotals || pavingCategoryTotals.length === 0) {
        // console.log('[ExtraPavingConcrete] Deferring DB fetch: pavingCategoryTotals not ready or empty.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('pool_paving_selections')
        .select('id, extra_paving_category, extra_paving_square_meters')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("[ExtraPavingConcrete] DB Error fetching extra paving data:", error);
        setSelectedCategory("");
        setSquareMeters(0);
        setPavingSelectionId(null);
      } else if (data) {
        // console.log('[ExtraPavingConcrete] Raw DB data:', data);
        let foundCategoryIdForState = "";
        if (data.extra_paving_category) {
          const dbCategoryValue = data.extra_paving_category;

          // Attempt to match as an ID first
          const categoryById = pavingCategoryTotals.find(cat => cat.id === dbCategoryValue);
          if (categoryById) {
            // console.log('[ExtraPavingConcrete] Matched DB extra_paving_category as an ID:', dbCategoryValue);
            foundCategoryIdForState = dbCategoryValue; // Directly use the ID from DB
          } else {
            // If not an ID, attempt to match as a Name
            // console.log('[ExtraPavingConcrete] DB extra_paving_category not an ID, trying to match as Name:', dbCategoryValue);
            const categoryByName = pavingCategoryTotals.find(cat => cat.category === dbCategoryValue);
            if (categoryByName) {
              // console.log('[ExtraPavingConcrete] Matched DB extra_paving_category as a Name:', dbCategoryValue, 'Mapped to ID:', categoryByName.id);
              foundCategoryIdForState = categoryByName.id;
            } else {
              console.warn('[ExtraPavingConcrete] DB extra_paving_category value:', dbCategoryValue, 'does not match any ID or Name in pavingCategoryTotals. UI will show no selection.');
            }
          }
        }
        setSelectedCategory(foundCategoryIdForState);
        setSquareMeters(data.extra_paving_square_meters || 0);
        setPavingSelectionId(data.id || null);
        // console.log('[ExtraPavingConcrete] Set state: selectedCategory=', foundCategoryIdForState, ', squareMeters=', data.extra_paving_square_meters || 0);
      } else {
        // console.log('[ExtraPavingConcrete] No data object returned from DB (e.g., PGRST116 or new project). Resetting form.');
        setSelectedCategory("");
        setSquareMeters(0);
        setPavingSelectionId(null);
      }
    } catch (err) {
      console.error("[ExtraPavingConcrete] CATCH block error in fetchExistingData:", err);
      setSelectedCategory("");
      setSquareMeters(0);
      setPavingSelectionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected category details
  const selectedCategoryDetails = pavingCategoryTotals.find(
    cat => cat.id === selectedCategory
  );

  // Calculate total cost
  const totalCost = selectedCategoryDetails && squareMeters > 0
    ? selectedCategoryDetails.totalRate * squareMeters
    : 0;

  // Format square meters with max 2 decimal places
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSquareMeters(isNaN(value) ? 0 : value);
  };

  // Handle save using the guarded hook
  const handleSaveClick = async () => {
    console.log('[ExtraPavingConcrete] handleSaveClick: Initiated.');
    console.log('[ExtraPavingConcrete] States at save: selectedCategory (ID):', selectedCategory, ', squareMeters:', squareMeters, ', totalCost:', totalCost);

    if (!selectedCategory || squareMeters <= 0) {
      toast.error("Please select a category and enter square meters");
      console.warn('[ExtraPavingConcrete] Save validation failed: Category or Sqr Meters missing.');
      return;
    }

    // Data for this section: ensure category ID is saved.
    const dataToSave = {
      extra_paving_category: selectedCategory, // This is the ID
      extra_paving_square_meters: squareMeters,
      extra_paving_total_cost: totalCost,
      // Null out other potentially conflicting fields for this specific save.
      // The hook handles pool_project_id for inserts if pavingSelectionId is null.
      existing_concrete_paving_category: null,
      existing_concrete_paving_square_meters: null,
      existing_concrete_paving_total_cost: null,
      extra_concreting_type: null, // Assuming this component doesn't handle extra_concreting
      extra_concreting_square_meters: null,
      extra_concreting_total_cost: null
    };
    console.log('[ExtraPavingConcrete] Prepared dataToSave for DB (should contain category ID):', JSON.stringify(dataToSave));
    console.log('[ExtraPavingConcrete] Current pavingSelectionId:', pavingSelectionId);

    // Use the guarded handleSave for both insert and update
    const result = await handleSave(dataToSave, 'pool_paving_selections', pavingSelectionId);

    console.log('[ExtraPavingConcrete] Save result from hook:', result);

    if (result.success) {
      if (result.newId && !pavingSelectionId) {
        setPavingSelectionId(result.newId);
        toast.success("Extra paving & concreting saved successfully."); // Specific toast for new insert
      } else if (pavingSelectionId) {
        // Update success toast is handled by the hook now
        // toast.success("Extra paving & concreting updated successfully.");
      }
      if (onSaveComplete) {
        console.log('[ExtraPavingConcrete] Calling onSaveComplete due to successful save.');
        onSaveComplete();
      }
    } else {
      // Error toast is handled by the hook or useGuardedMutation's onError
      // toast.error("Failed to save extra paving & concreting. Check console for details.");
      console.error('[ExtraPavingConcrete] Save failed. Result from hook:', result);
    }
  };

  // Handle delete using the guarded hook
  const handleDeleteClick = async () => {
    if (!pavingSelectionId) {
      toast.error("No data to delete");
      return;
    }

    const success = await handleDelete('extra_paving_category', 'pool_paving_selections');

    if (success) {
      // Reset the form
      setSelectedCategory("");
      setSquareMeters(0);
      setShowDeleteConfirm(false);

      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Extra Paving & Concreting</h3>
            </div>
            <p className="text-muted-foreground">
              Add extra paving and concreting to your pool project
            </p>
          </div>

          {customerId && (
            <SaveButton
              onClick={handleSaveClick}
              isSubmitting={isSubmitting}
              disabled={!selectedCategory || squareMeters <= 0}
              buttonText="Save Details"
              className="bg-primary"
            />
          )}
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="paving-category">Paving Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="paving-category">
                      <SelectValue placeholder="Select a paving category" />
                    </SelectTrigger>
                    <SelectContent>
                      {pavingCategoryTotals.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.category} - {formatCurrency(category.totalRate)}/m²
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-0">
                  <Label htmlFor="square-meters">Square Meters</Label>
                  <Input
                    id="square-meters"
                    type="number"
                    step="0.01"
                    min="0"
                    value={squareMeters || ""}
                    onChange={handleSquareMetersChange}
                    placeholder="Enter square meters"
                  />
                </div>
              </div>

              {selectedCategoryDetails && squareMeters > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-medium text-lg mb-2">Cost Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Rate per m²:</span>
                        <span>{formatCurrency(selectedCategoryDetails.totalRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Area:</span>
                        <span>{squareMeters.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Total Cost:</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2">Rate Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
                      <div>
                        <p className="font-medium mb-1">Per m²</p>
                        <div className="flex justify-between"><span>Paver Cost:</span> <span>{formatCurrency(selectedCategoryDetails.paverCost)}</span></div>
                        <div className="flex justify-between"><span>Wastage Cost:</span> <span>{formatCurrency(selectedCategoryDetails.wastageCost)}</span></div>
                        <div className="flex justify-between"><span>Margin Cost:</span> <span>{formatCurrency(selectedCategoryDetails.marginCost)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Materials Subtotal:</span> <span>{formatCurrency(selectedCategoryDetails.categoryTotal)}</span></div>
                        <div className="flex justify-between"><span>Labour Cost:</span> <span>{formatCurrency(labourCostWithMargin)}</span></div>
                      </div>

                      <div>
                        <p className="font-medium mb-1">Total ({squareMeters.toFixed(2)} m²)</p>
                        <div className="flex justify-between"><span>Paver Cost:</span> <span>{formatCurrency(selectedCategoryDetails.paverCost * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Wastage Cost:</span> <span>{formatCurrency(selectedCategoryDetails.wastageCost * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Margin Cost:</span> <span>{formatCurrency(selectedCategoryDetails.marginCost * squareMeters)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Materials Subtotal:</span> <span>{formatCurrency(selectedCategoryDetails.categoryTotal * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Labour Cost:</span> <span>{formatCurrency(labourCostWithMargin * squareMeters)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pavingSelectionId && (
                <div className="flex justify-start mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Removing..." : "Remove"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Paving & Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra paving & concreting selection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <StatusWarningDialog />
    </>
  );
};
