
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

interface PavingOnExistingConcreteProps {
  pool: Pool;
  customerId: string;
}

// Define an interface for the data we're expecting from Supabase
interface PoolProjectExtensions {
  existing_concrete_paving_category?: string | null;
  existing_concrete_paving_square_meters?: number | null;
  existing_concrete_paving_total_cost?: number | null;
}

export const PavingOnExistingConcrete: React.FC<PavingOnExistingConcreteProps> = ({ pool, customerId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pavingOnExistingConcreteTotals, existingConcreteLabourWithMargin, isLoading: isCategoriesLoading } = useFormulaCalculations();

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
        console.error("Error fetching existing concrete paving data:", error);
        return;
      }

      if (data) {
        // Type assertion to access the custom properties safely
        const projectData = data as unknown as PoolProjectExtensions;
        
        if (projectData.existing_concrete_paving_category) {
          setSelectedCategory(projectData.existing_concrete_paving_category);
        }
        
        if (projectData.existing_concrete_paving_square_meters) {
          setSquareMeters(projectData.existing_concrete_paving_square_meters);
        }
      }
    } catch (error) {
      console.error("Error in fetchExistingData:", error);
    } finally {
      setIsLoading(false);
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
        existing_concrete_paving_category: selectedCategory,
        existing_concrete_paving_square_meters: squareMeters,
        existing_concrete_paving_total_cost: totalCost
      };
      
      // Using explicit typing to avoid TypeScript errors
      const { error } = await supabase
        .from('pool_projects')
        .update(updateData as any)
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success("Paving on existing concrete saved successfully");
    } catch (error) {
      console.error("Error saving paving on existing concrete:", error);
      toast.error("Failed to save paving on existing concrete details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Paving on Existing Concrete</h3>
          <p className="text-muted-foreground">
            Add paving on existing concrete areas to your pool project
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
                {pavingOnExistingConcreteTotals.map((category) => (
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
                    <div className="text-right">{formatCurrency(existingConcreteLabourWithMargin)}</div>
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
                    <div className="text-right">{formatCurrency(existingConcreteLabourWithMargin * squareMeters)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
