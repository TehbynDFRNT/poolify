
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Layers } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExtraPavingConcreteProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcrete: React.FC<ExtraPavingConcreteProps> = ({ pool, customerId }) => {
  const [extraPavingCosts, setExtraPavingCosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { pavingCategoryTotals, concreteCostPerMeter, labourCostWithMargin } = useFormulaCalculations();
  
  // Fetch extra paving categories on component mount
  useEffect(() => {
    fetchPavingCosts();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);
  
  const fetchPavingCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('extra_paving_costs')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setExtraPavingCosts(data);
      }
    } catch (error) {
      console.error("Error fetching extra paving costs:", error);
    }
  };
  
  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select('extra_paving_category, extra_paving_square_meters, extra_paving_total_cost')
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching existing extra paving data:", error);
      } else if (data) {
        if (data.extra_paving_category) {
          setSelectedCategory(data.extra_paving_category);
        }
        
        if (data.extra_paving_square_meters) {
          setSquareMeters(data.extra_paving_square_meters);
        }
        
        if (data.extra_paving_total_cost) {
          setTotalCost(data.extra_paving_total_cost);
        }
      }
    } catch (error) {
      console.error("Error fetching existing extra paving data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total cost whenever category or square meters change
  useEffect(() => {
    if (selectedCategory && squareMeters > 0) {
      const selectedPaving = extraPavingCosts.find(paving => paving.id === selectedCategory);
      if (selectedPaving) {
        const selectedPavingTotal = pavingCategoryTotals.find(cat => cat.id === selectedCategory);
        if (selectedPavingTotal) {
          // Use formula from reference: Rate per m² × Area
          setTotalCost(selectedPavingTotal.totalRate * squareMeters);
        }
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedCategory, squareMeters, extraPavingCosts, pavingCategoryTotals]);
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  // Handle square meters input
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSquareMeters(isNaN(value) || value < 0 ? 0 : value);
  };
  
  // Save extra paving data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_paving_category: selectedCategory || null,
          extra_paving_square_meters: squareMeters || 0,
          extra_paving_total_cost: totalCost || 0
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Extra paving details saved successfully.");
    } catch (error) {
      console.error("Error saving extra paving details:", error);
      toast.error("Failed to save extra paving details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete operation
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_paving_category: null,
          extra_paving_square_meters: null,
          extra_paving_total_cost: null
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      // Reset form
      setSelectedCategory('');
      setSquareMeters(0);
      setTotalCost(0);
      
      setShowDeleteConfirm(false);
      toast.success("Extra paving removed successfully.");
    } catch (error) {
      console.error("Error removing extra paving:", error);
      toast.error("Failed to remove extra paving.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get the rate per m² for the selected category
  const getRatePerMeter = () => {
    if (!selectedCategory) return 0;
    
    const selectedPavingTotal = pavingCategoryTotals.find(cat => cat.id === selectedCategory);
    return selectedPavingTotal ? selectedPavingTotal.totalRate : 0;
  };

  // Get selected category details
  const getSelectedCategory = () => {
    return extraPavingCosts.find(category => category.id === selectedCategory);
  };
  
  // Get material costs breakdown
  const getMaterialCosts = () => {
    if (!selectedCategory) return { paverCost: 0, wastageCost: 0, marginCost: 0, subtotal: 0 };
    
    const pavingTotal = pavingCategoryTotals.find(cat => cat.id === selectedCategory);
    if (!pavingTotal) return { paverCost: 0, wastageCost: 0, marginCost: 0, subtotal: 0 };
    
    return {
      paverCost: pavingTotal.paverCost,
      wastageCost: pavingTotal.wastageCost,
      marginCost: pavingTotal.marginCost,
      subtotal: pavingTotal.categoryTotal
    };
  };
  
  // Get selected category name
  const getSelectedCategoryName = () => {
    const category = getSelectedCategory();
    return category ? category.category : '';
  };
  
  const hasExistingData = selectedCategory && squareMeters > 0;
  const materials = getMaterialCosts();
  
  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Extra Paving and Concrete</h3>
          <p className="text-muted-foreground">
            Add extra paving requirements for your project
          </p>
        </div>
        
        {customerId && (
          <SaveButton 
            onClick={handleSave}
            isSubmitting={isSaving}
            disabled={!selectedCategory || squareMeters <= 0}
            buttonText="Save Details"
            className="bg-primary"
          />
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="paving-category" className="font-medium">
              Paving Category
            </Label>
            <Select 
              value={selectedCategory} 
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger id="paving-category" className="mt-2">
                <SelectValue placeholder="Select a paving category" />
              </SelectTrigger>
              <SelectContent>
                {extraPavingCosts.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="square-meters" className="font-medium">
              Square Meters
            </Label>
            <Input
              id="square-meters"
              type="number"
              min="0"
              step="0.5"
              value={squareMeters}
              onChange={handleSquareMetersChange}
              className="mt-2"
              disabled={isLoading || !selectedCategory}
              placeholder="Enter area in m²"
            />
          </div>
        </div>
        
        {selectedCategory && squareMeters > 0 && (
          <div className="space-y-6">
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              <div className="grid grid-cols-2 gap-y-1">
                <span>Rate per m²:</span>
                <span className="text-right">{formatCurrency(getRatePerMeter())}</span>
                
                <span>Area:</span>
                <span className="text-right">{squareMeters} m²</span>
                
                <span className="font-medium border-t pt-2 mt-1">Total Cost:</span>
                <span className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Rate Breakdown</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="text-sm font-medium mb-2">Per m²</h5>
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span>Paver Cost:</span>
                    <span className="text-right">{formatCurrency(materials.paverCost)}</span>
                    
                    <span>Wastage Cost:</span>
                    <span className="text-right">{formatCurrency(materials.wastageCost)}</span>
                    
                    <span>Margin Cost:</span>
                    <span className="text-right">{formatCurrency(materials.marginCost)}</span>
                    
                    <span className="font-medium">Materials Subtotal:</span>
                    <span className="text-right font-medium">{formatCurrency(materials.subtotal)}</span>
                    
                    <span>Labour Cost:</span>
                    <span className="text-right">{formatCurrency(labourCostWithMargin)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="text-sm font-medium mb-2">Total ({squareMeters} m²)</h5>
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span>Paver Cost:</span>
                    <span className="text-right">{formatCurrency(materials.paverCost * squareMeters)}</span>
                    
                    <span>Wastage Cost:</span>
                    <span className="text-right">{formatCurrency(materials.wastageCost * squareMeters)}</span>
                    
                    <span>Margin Cost:</span>
                    <span className="text-right">{formatCurrency(materials.marginCost * squareMeters)}</span>
                    
                    <span className="font-medium">Materials Subtotal:</span>
                    <span className="text-right font-medium">{formatCurrency(materials.subtotal * squareMeters)}</span>
                    
                    <span>Labour Cost:</span>
                    <span className="text-right">{formatCurrency(labourCostWithMargin * squareMeters)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {hasExistingData && (
              <div className="mt-6">
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Removing..." : "Remove"}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {extraPavingCosts.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No paving categories available
          </div>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Paving</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra paving data? This action cannot be undone.
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
