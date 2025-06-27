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
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { pavingCategoryTotals, labourCostWithMargin, isLoading: isCategoriesLoading, concreteCostPerMeter } = useFormulaCalculations();
  
  // Track previous values to prevent unnecessary saves
  const prevValuesRef = useRef({ selectedCategory, squareMeters });

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
        .select('extra_paving_category, extra_paving_square_meters')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("[ExtraPavingConcrete] DB Error fetching extra paving data:", error);
        setSelectedCategory("");
        setSquareMeters(0);
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
        // console.log('[ExtraPavingConcrete] Set state: selectedCategory=', foundCategoryIdForState, ', squareMeters=', data.extra_paving_square_meters || 0);
      } else {
        // console.log('[ExtraPavingConcrete] No data object returned from DB (e.g., PGRST116 or new project). Resetting form.');
        setSelectedCategory("");
        setSquareMeters(0);
      }
    } catch (err) {
      console.error("[ExtraPavingConcrete] CATCH block error in fetchExistingData:", err);
      setSelectedCategory("");
      setSquareMeters(0);
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

  // Auto-save when category or square meters change
  useEffect(() => {
    // Check if values actually changed
    const hasChanged = 
      prevValuesRef.current.selectedCategory !== selectedCategory ||
      prevValuesRef.current.squareMeters !== squareMeters;
    
    if (!hasChanged || !customerId || isLoading || isCategoriesLoading) return;
    
    // Update ref with new values
    prevValuesRef.current = { selectedCategory, squareMeters };
    
    const timeoutId = setTimeout(async () => {
      // Find category details to calculate total
      const categoryDetails = pavingCategoryTotals.find(cat => cat.id === selectedCategory);
      const calculatedTotalCost = categoryDetails && squareMeters > 0
        ? categoryDetails.totalRate * squareMeters
        : 0;
      
      // Data for this section: ensure category ID is saved.
      const dataToSave = {
        extra_paving_category: selectedCategory || null,
        extra_paving_square_meters: squareMeters || null,
        extra_paving_total_cost: calculatedTotalCost || null
      };

      // Check if any record exists first
      const { data: existingData } = await supabase
        .from('pool_paving_selections')
        .select('id')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      // Perform upsert directly to avoid hook dependency issues
      const { error } = await supabase
        .from('pool_paving_selections')
        .upsert(
          {
            ...dataToSave,
            pool_project_id: customerId,
            ...(existingData?.id && { id: existingData.id })
          },
          { onConflict: 'pool_project_id' }
        );

      if (!error) {
        // Invalidate snapshot query after successful save
        queryClient.invalidateQueries({ 
          queryKey: ['project-snapshot', customerId] 
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, squareMeters, customerId, isLoading, isCategoriesLoading, queryClient, pavingCategoryTotals]);

  // Handle save using the guarded hook
  const handleSaveClick = async () => {
    console.log('[ExtraPavingConcrete] handleSaveClick: Initiated.');
    console.log('[ExtraPavingConcrete] States at save: selectedCategory (ID):', selectedCategory, ', squareMeters:', squareMeters, ', totalCost:', totalCost);

    // Data for this section: ensure category ID is saved.
    const dataToSave = {
      extra_paving_category: selectedCategory || null, // Set to null if empty
      extra_paving_square_meters: squareMeters || null, // Set to null if 0
      extra_paving_total_cost: totalCost || null // Set to null if 0
    };
    console.log('[ExtraPavingConcrete] Prepared dataToSave for DB (should contain category ID):', JSON.stringify(dataToSave));

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleSave(dataToSave, 'pool_paving_selections');

    console.log('[ExtraPavingConcrete] Save result from hook:', result);

    if (result.success) {
      if (onSaveComplete) {
        console.log('[ExtraPavingConcrete] Calling onSaveComplete due to successful save.');
        onSaveComplete();
      }
    } else {
      console.error('[ExtraPavingConcrete] Save failed. Result from hook:', result);
    }
  };

  // Handle delete using the guarded hook
  const handleDeleteClick = async () => {
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
        <CardHeader className="bg-white pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Extra Paving & Concreting</h3>
            </div>
            <p className="text-muted-foreground">
              Add extra paving and concreting to your pool project
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

              {(selectedCategory || squareMeters > 0) && (
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
