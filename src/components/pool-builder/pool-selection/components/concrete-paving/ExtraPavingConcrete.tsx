
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
        const totalPerMeter = selectedPaving.paver_cost + selectedPaving.margin_cost + selectedPaving.wastage_cost;
        setTotalCost(totalPerMeter * squareMeters);
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedCategory, squareMeters, extraPavingCosts]);
  
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
  
  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Extra Paving</h3>
          </div>
          <p className="text-muted-foreground">
            Add extra paving requirements for your project
          </p>
        </div>
        
        {customerId && (
          <SaveButton 
            onClick={handleSave}
            isSubmitting={isSaving}
            disabled={false}
            buttonText="Save Paving"
            className="bg-primary"
          />
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div>
            <Label htmlFor="paving-category" className="font-medium">
              Select Paving Category
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
          
          {selectedCategory && (
            <div>
              <Label htmlFor="square-meters" className="font-medium">
                Square Meters Required
              </Label>
              <Input
                id="square-meters"
                type="number"
                min="0"
                step="0.5"
                value={squareMeters}
                onChange={handleSquareMetersChange}
                className="mt-2"
                disabled={isLoading}
              />
            </div>
          )}
          
          {selectedCategory && squareMeters > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              
              {extraPavingCosts.find(paving => paving.id === selectedCategory) && (
                <div className="space-y-2">
                  {(() => {
                    const selectedPaving = extraPavingCosts.find(paving => paving.id === selectedCategory)!;
                    const totalPerMeter = selectedPaving.paver_cost + selectedPaving.margin_cost + selectedPaving.wastage_cost;
                    
                    return (
                      <>
                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                          <span>Category:</span>
                          <span className="text-right">{selectedPaving.category}</span>
                          
                          <span>Cost per m²:</span>
                          <span className="text-right">{formatCurrency(totalPerMeter)}</span>
                          
                          <span>Area:</span>
                          <span className="text-right">{squareMeters} m²</span>
                          
                          <span className="font-medium border-t pt-2 mt-1">Total Cost:</span>
                          <span className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</span>
                        </div>
                        
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>This is based on the standard formula: Rate per m² × Area</p>
                          <p className="mt-1">Example: {formatCurrency(totalPerMeter)} × {squareMeters} m² = {formatCurrency(totalCost)}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
          
          {extraPavingCosts.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No paving categories available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
