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
import { Layers } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { useQueryClient } from "@tanstack/react-query";

interface PavingOnExistingConcreteProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const PavingOnExistingConcrete: React.FC<PavingOnExistingConcreteProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  console.log('[PavingOnExistingConcrete] Component mounted/rendered. CustomerId:', customerId);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { pavingOnExistingConcreteTotals, existingConcreteLabourWithMargin, isLoading: isCategoriesLoading } = useFormulaCalculations();
  const queryClient = useQueryClient();
  
  // Track previous values to prevent unnecessary saves
  const prevValuesRef = useRef({ selectedCategory, squareMeters });

  // Log pavingOnExistingConcreteTotals structure once available
  useEffect(() => {
    if (!isCategoriesLoading && pavingOnExistingConcreteTotals && pavingOnExistingConcreteTotals.length > 0) {
      // console.log('[PavingOnExistingConcrete] pavingOnExistingConcreteTotals is ready. First item:', pavingOnExistingConcreteTotals[0]);
    } else if (isCategoriesLoading) {
      // console.log('[PavingOnExistingConcrete] pavingOnExistingConcreteTotals is still loading...');
    } else {
      // console.log('[PavingOnExistingConcrete] pavingOnExistingConcreteTotals is not yet available or empty.');
    }
  }, [pavingOnExistingConcreteTotals, isCategoriesLoading]);

  // Use the guarded actions hook
  const {
    handleSave,
    handleDelete,
    isSubmitting,
    isDeleting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Fetch existing data when component mounts and categories are loaded
  useEffect(() => {
    // Only fetch if we have a customerId AND categories are loaded
    if (customerId && !isCategoriesLoading && pavingOnExistingConcreteTotals && pavingOnExistingConcreteTotals.length > 0) {
      // console.log('[PavingOnExistingConcrete] Conditions met: Fetching existing data now.');
      fetchExistingData();
    } else {
      let reason = "";
      if (!customerId) reason += " customerId not available.";
      if (isCategoriesLoading) reason += " categories still loading.";
      if (!pavingOnExistingConcreteTotals || pavingOnExistingConcreteTotals.length === 0) reason += " categories list empty/unavailable.";
      // console.log(`[PavingOnExistingConcrete] Deferring fetchExistingData because:${reason}`);
      // If categories are not loading but list is empty, implies no categories available
      if (!isCategoriesLoading && (!pavingOnExistingConcreteTotals || pavingOnExistingConcreteTotals.length === 0)) {
        setIsLoading(false); // Stop main loading indicator if categories just aren't there
      }
    }
  }, [customerId, isCategoriesLoading, pavingOnExistingConcreteTotals]); // Added dependencies

  // Fetch existing extra paving data for this customer
  const fetchExistingData = async () => {
    // console.log('[PavingOnExistingConcrete] Inside fetchExistingData for customerId:', customerId);
    setIsLoading(true); // Set loading true when fetch begins
    try {
      // Ensure pavingOnExistingConcreteTotals is available
      if (!pavingOnExistingConcreteTotals || pavingOnExistingConcreteTotals.length === 0) {
        // console.log('[PavingOnExistingConcrete] Deferring DB fetch: pavingOnExistingConcreteTotals not ready or empty.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('pool_paving_selections')
        .select('existing_concrete_paving_category, existing_concrete_paving_square_meters')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      let foundCategoryIdForState = "";
      if (data && data.existing_concrete_paving_category) {
        const dbCategoryValue = data.existing_concrete_paving_category;
        // console.log('[PavingOnExistingConcrete] DB existing_concrete_paving_category value:', dbCategoryValue);

        // Attempt to match as an ID first
        const categoryById = pavingOnExistingConcreteTotals.find(cat => cat.id === dbCategoryValue);
        if (categoryById) {
          // console.log('[PavingOnExistingConcrete] Matched DB value as an ID:', dbCategoryValue);
          foundCategoryIdForState = dbCategoryValue; // DB stores an ID, use it directly
        } else {
          // If not an ID, attempt to match as a Name
          // console.log('[PavingOnExistingConcrete] DB value not an ID, trying to match as Name:', dbCategoryValue);
          const categoryByName = pavingOnExistingConcreteTotals.find(cat => cat.category === dbCategoryValue);
          if (categoryByName) {
            // console.log('[PavingOnExistingConcrete] Matched DB value as a Name:', dbCategoryValue, 'Mapped to ID:', categoryByName.id);
            foundCategoryIdForState = categoryByName.id; // DB stores a name, use its corresponding ID
          } else {
            console.warn('[PavingOnExistingConcrete] DB value:', dbCategoryValue, 'does not match any ID or Name in pavingOnExistingConcreteTotals. UI will show no selection.');
          }
        }
      }
      setSelectedCategory(foundCategoryIdForState);

      if (error && error.code !== 'PGRST116') {
        console.error("[PavingOnExistingConcrete] Error fetching existing concrete paving data:", error);
        // setSelectedCategory(""); // Already handled by foundCategoryIdForState initialization
        setSquareMeters(0);
      } else if (data) {
        setSquareMeters(data.existing_concrete_paving_square_meters || 0);
      } else {
        setSquareMeters(0);
      }
    } catch (errorCatch) {
      console.error("[PavingOnExistingConcrete] Error in fetchExistingData CATCH BLOCK:", errorCatch);
      setSelectedCategory("");
      setSquareMeters(0);
    } finally {
      setIsLoading(false);
      // console.log('[PavingOnExistingConcrete] fetchExistingData finished.');
    }
  };

  // Get selected category details
  const selectedCategoryDetails = pavingOnExistingConcreteTotals.find(
    cat => cat.id === selectedCategory
  );

  // Calculate total cost
  const totalCost = selectedCategoryDetails && squareMeters > 0
    ? selectedCategoryDetails.totalRate * squareMeters
    : 0;

  // Auto-save effect - only trigger on user input changes
  useEffect(() => {
    // Check if values actually changed
    const hasChanged = 
      prevValuesRef.current.selectedCategory !== selectedCategory ||
      prevValuesRef.current.squareMeters !== squareMeters;
    
    if (!hasChanged || !customerId || isLoading || isCategoriesLoading) return;
    
    // Update ref with new values
    prevValuesRef.current = { selectedCategory, squareMeters };

    const timer = setTimeout(async () => {
      // Only save if there's actually data to save
      if (selectedCategory || squareMeters > 0) {
        // Find category details to calculate total
        const categoryDetails = pavingOnExistingConcreteTotals.find(cat => cat.id === selectedCategory);
        const calculatedTotalCost = categoryDetails && squareMeters > 0
          ? categoryDetails.totalRate * squareMeters
          : 0;
        
        const dataToSave = {
          existing_concrete_paving_category: selectedCategory || null,
          existing_concrete_paving_square_meters: squareMeters || null,
          existing_concrete_paving_total_cost: calculatedTotalCost || null
        };

        console.log('[PavingOnExistingConcrete] Auto-saving data:', dataToSave);

        try {
          // Check if any record exists first
          const { data: existingData } = await supabase
            .from('pool_paving_selections')
            .select('id')
            .eq('pool_project_id', customerId)
            .maybeSingle();

          // Perform upsert directly to avoid hook dependency issues
          if (existingData?.id) {
            const { error } = await supabase
              .from('pool_paving_selections')
              .update(dataToSave)
              .eq('id', existingData.id);

            if (error) {
              console.error('[PavingOnExistingConcrete] Auto-save failed:', error);
              toast.error("Failed to save paving data");
            } else {
              // Invalidate the snapshot query after successful save
              queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] });
            }
          } else {
            const { error } = await supabase
              .from('pool_paving_selections')
              .insert({
                ...dataToSave,
                pool_project_id: customerId
              });

            if (error) {
              console.error('[PavingOnExistingConcrete] Auto-save failed:', error);
              toast.error("Failed to save paving data");
            } else {
              // Invalidate the snapshot query after successful save
              queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] });
            }
          }
        } catch (error) {
          console.error('[PavingOnExistingConcrete] Auto-save error:', error);
        }
      }
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(timer);
  }, [selectedCategory, squareMeters, customerId, isLoading, isCategoriesLoading, pavingOnExistingConcreteTotals]); // Only depend on actual user inputs and stable values

  // Format square meters with max 2 decimal places
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSquareMeters(isNaN(value) ? 0 : value);
  };

  // Handle save using the guarded hook
  const handleSaveClick = async () => {
    const dataToSave = {
      existing_concrete_paving_category: selectedCategory || null, // Set to null if empty
      existing_concrete_paving_square_meters: squareMeters || null, // Set to null if 0
      existing_concrete_paving_total_cost: totalCost || null // Set to null if 0
    };

    console.log('[PavingOnExistingConcrete] Attempting save. Data to save:', dataToSave);

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleSave(dataToSave, 'pool_paving_selections');

    console.log('[PavingOnExistingConcrete] Save result from hook:', result);

    if (result.success) {
      if (onSaveComplete) onSaveComplete();
    } else {
      console.error('[PavingOnExistingConcrete] Save failed. Result from hook:', result);
    }
  };

  // Handle delete using the guarded hook
  const handleDeleteClick = async () => {
    const success = await handleDelete('existing_concrete_paving_category', 'pool_paving_selections');

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
        <CardHeader className="bg-white pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Paving on Existing Concrete</h3>
            </div>
            <p className="text-muted-foreground">
              Add paving on existing concrete areas to your pool project
            </p>
          </div>
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
                  <Label htmlFor="existing-paving-category">Paving Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="existing-paving-category">
                      <SelectValue placeholder="Select a paving category" />
                    </SelectTrigger>
                    <SelectContent>
                      {pavingOnExistingConcreteTotals.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.category} - {formatCurrency(category.totalRate)}/m²
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-0">
                  <Label htmlFor="existing-square-meters">Square Meters</Label>
                  <Input
                    id="existing-square-meters"
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
                        <div className="flex justify-between"><span>Labour Cost:</span> <span>{formatCurrency(existingConcreteLabourWithMargin)}</span></div>
                      </div>

                      <div>
                        <p className="font-medium mb-1">Total ({squareMeters.toFixed(2)} m²)</p>
                        <div className="flex justify-between"><span>Paver Cost:</span> <span>{formatCurrency(selectedCategoryDetails.paverCost * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Wastage Cost:</span> <span>{formatCurrency(selectedCategoryDetails.wastageCost * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Margin Cost:</span> <span>{formatCurrency(selectedCategoryDetails.marginCost * squareMeters)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Materials Subtotal:</span> <span>{formatCurrency(selectedCategoryDetails.categoryTotal * squareMeters)}</span></div>
                        <div className="flex justify-between"><span>Labour Cost:</span> <span>{formatCurrency(existingConcreteLabourWithMargin * squareMeters)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory && (
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
            <AlertDialogTitle>Remove Paving on Existing Concrete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the paving on existing concrete selection? This action cannot be undone.
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


