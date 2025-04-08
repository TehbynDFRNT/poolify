
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";
import { formatCurrency } from "@/utils/format";
import { SaveButton } from "../SaveButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

// Define an interface for the data we're expecting from Supabase
interface PoolProjectExtensions {
  extra_paving_category?: string | null;
  extra_paving_square_meters?: number | null;
  extra_paving_total_cost?: number | null;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { pavingCategoryTotals, isLoading: isCategoriesLoading } = useFormulaCalculations();

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
        .from('pool_projects')
        .select('*')  // Select all columns to avoid type issues
        .eq('id', customerId)
        .single();

      if (error) {
        console.error("Error fetching extra paving data:", error);
        return;
      }

      if (data) {
        // Type assertion to access the custom properties safely
        const projectData = data as unknown as PoolProjectExtensions;
        
        if (projectData.extra_paving_category) {
          setSelectedCategory(projectData.extra_paving_category);
        }
        
        if (projectData.extra_paving_square_meters) {
          setSquareMeters(projectData.extra_paving_square_meters);
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
      
      // Using explicit typing to avoid TypeScript errors
      const { error } = await supabase
        .from('pool_projects')
        .update(updateData as any)
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success("Extra paving and concreting saved successfully");
    } catch (error) {
      console.error("Error saving extra paving:", error);
      toast.error("Failed to save extra paving details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!customerId) {
      toast.error("Customer information required");
      return;
    }

    setIsDeleting(true);
    try {
      // Clear the values in the database
      const updateData = {
        extra_paving_category: null,
        extra_paving_square_meters: null,
        extra_paving_total_cost: null
      };
      
      const { error } = await supabase
        .from('pool_projects')
        .update(updateData as any)
        .eq('id', customerId);

      if (error) throw error;
      
      // Reset the form
      setSelectedCategory("");
      setSquareMeters(0);
      
      toast.success("Extra paving and concreting removed successfully");
      setShowDeleteConfirm(false);
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
          <h3 className="text-xl font-semibold">Extra Paving and Concreting</h3>
          <p className="text-muted-foreground">
            Add extra paving and concreting options to your pool project
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
                    
                    <div>Concrete Cost:</div>
                    <div className="text-right">{formatCurrency(selectedCategoryDetails.totalRate - selectedCategoryDetails.categoryTotal)}</div>
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
                    
                    <div>Concrete Cost:</div>
                    <div className="text-right">{formatCurrency((selectedCategoryDetails.totalRate - selectedCategoryDetails.categoryTotal) * squareMeters)}</div>
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
            <AlertDialogTitle>Remove Extra Paving and Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra paving and concreting data? This action cannot be undone.
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
