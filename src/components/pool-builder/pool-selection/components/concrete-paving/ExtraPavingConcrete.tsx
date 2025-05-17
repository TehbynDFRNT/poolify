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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [pavingSelectionId, setPavingSelectionId] = useState<string | null>(null);
  const { pavingCategoryTotals, labourCostWithMargin, isLoading: isCategoriesLoading } = useFormulaCalculations();

  // Fetch existing data when component mounts
  useEffect(() => {
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);

  // Fetch existing extra paving data for this customer
  const fetchExistingData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pool_paving_selections')
        .select('*')
        .eq('pool_project_id', customerId)
        .maybeSingle(); // Use maybeSingle to handle both existing and non-existing records

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected if no selection exists
        console.error("Error fetching extra paving data:", error);
        return;
      }

      if (data) {
        setPavingSelectionId(data.id);

        if (data.extra_paving_category) {
          setSelectedCategory(data.extra_paving_category);
        }

        if (data.extra_paving_square_meters) {
          setSquareMeters(data.extra_paving_square_meters);
        }
      }
    } catch (error) {
      console.error("Error in fetchExistingData:", error);
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

  // Handle save
  const handleSave = async () => {
    if (!customerId) {
      toast.error("Customer information required to save");
      return;
    }

    if (!selectedCategory || squareMeters <= 0) {
      toast.error("Please select a category and enter square meters");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to database with type-safe update object
      const updateData = {
        extra_paving_category: selectedCategory,
        extra_paving_square_meters: squareMeters,
        extra_paving_total_cost: totalCost
      };

      let result;

      if (pavingSelectionId) {
        // Update existing record
        result = await supabase
          .from('pool_paving_selections')
          .update(updateData)
          .eq('id', pavingSelectionId);
      } else {
        // Create new record
        result = await supabase
          .from('pool_paving_selections')
          .insert({
            ...updateData,
            pool_project_id: customerId,
            // Set default values for other fields to prevent null issues
            existing_concrete_paving_category: null,
            existing_concrete_paving_square_meters: 0,
            existing_concrete_paving_total_cost: 0,
            extra_concreting_type: null,
            extra_concreting_square_meters: 0,
            extra_concreting_total_cost: 0
          });
      }

      if (result.error) throw result.error;

      // If we just inserted a new record, get its ID
      if (!pavingSelectionId && result.data) {
        setPavingSelectionId(result.data[0]?.id);
      }

      toast.success("Extra paving & concreting saved successfully");

      // Call the onSaveComplete callback if provided
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error saving extra paving:", error);
      toast.error("Failed to save extra paving details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!customerId || !pavingSelectionId) {
      toast.error("No data to delete");
      return;
    }

    setIsDeleting(true);
    try {
      // We don't actually delete the row, just clear the specific fields
      // This preserves any other paving selection data
      const updateData = {
        extra_paving_category: null,
        extra_paving_square_meters: 0,
        extra_paving_total_cost: 0
      };

      const { error } = await supabase
        .from('pool_paving_selections')
        .update(updateData)
        .eq('id', pavingSelectionId);

      if (error) throw error;

      // Reset the form
      setSelectedCategory("");
      setSquareMeters(0);

      toast.success("Extra paving & concreting removed successfully");
      setShowDeleteConfirm(false);

      // Call the onSaveComplete callback if provided
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error removing extra paving:", error);
      toast.error("Failed to remove extra paving details");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
            onClick={handleSave}
            isSubmitting={isSubmitting}
            disabled={!selectedCategory || squareMeters <= 0}
            buttonText="Save Details"
            className="bg-primary"
          />
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="paving-category">Paving Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={isLoading || isCategoriesLoading}
            >
              <SelectTrigger id="paving-category" className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {pavingCategoryTotals.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="square-meters">Square Meters</Label>
            <Input
              id="square-meters"
              type="number"
              step="0.1"
              min="0"
              value={squareMeters || ""}
              onChange={handleSquareMetersChange}
              placeholder="Enter area in square meters"
              className="mt-2"
              disabled={!selectedCategory || isLoading}
            />
          </div>
        </div>

        {selectedCategoryDetails && squareMeters > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Cost Summary</h4>
            <div className="grid grid-cols-2 gap-y-2">
              <div>Rate per m²:</div>
              <div className="text-right">{formatCurrency(selectedCategoryDetails.totalRate)}</div>

              <div>Area:</div>
              <div className="text-right">{squareMeters} m²</div>

              <div className="font-medium border-t pt-2 mt-1">Total Cost:</div>
              <div className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Rate Breakdown</h4>
              <div className="grid grid-cols-4 gap-4">
                {/* Per m² Column */}
                <div className="col-span-2">
                  <h5 className="text-sm font-medium mb-2">Per m²</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>Paver Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.paverCost)}</div>

                    <div>Wastage Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.wastageCost)}</div>

                    <div>Margin Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.marginCost)}</div>

                    <div className="font-medium">Materials Subtotal:</div>
                    <div className="text-right font-medium">{formatCurrency(selectedCategoryDetails.categoryTotal)}</div>

                    <div>Labour Cost:</div>
                    <div className="text-right">{formatCurrency(labourCostWithMargin)}</div>
                  </div>
                </div>

                {/* Total Column (multiplied by square meters) */}
                <div className="col-span-2">
                  <h5 className="text-sm font-medium mb-2">Total ({squareMeters} m²)</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>Paver Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.paverCost * squareMeters)}</div>

                    <div>Wastage Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.wastageCost * squareMeters)}</div>

                    <div>Margin Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.marginCost * squareMeters)}</div>

                    <div className="font-medium">Materials Subtotal:</div>
                    <div className="text-right font-medium">{formatCurrency(selectedCategoryDetails.categoryTotal * squareMeters)}</div>

                    <div>Labour Cost:</div>
                    <div className="text-right">{formatCurrency(labourCostWithMargin * squareMeters)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="mt-6">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting || isLoading}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Paving & Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra paving & concreting data? This action cannot be undone.
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
