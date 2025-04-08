
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Layers } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";

interface ExtraPavingConcreteProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcrete: React.FC<ExtraPavingConcreteProps> = ({ pool, customerId }) => {
  const [pavingCategory, setPavingCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [pavingOptions, setPavingOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPavingRate, setSelectedPavingRate] = useState<number>(0);
  
  // Fetch paving categories on component mount
  useEffect(() => {
    fetchPavingOptions();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);
  
  const fetchPavingOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('extra_paving_costs')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setPavingOptions(data);
      }
    } catch (error) {
      console.error("Error fetching paving options:", error);
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
        console.error("Error fetching existing paving data:", error);
      } else if (data) {
        if (data.extra_paving_category) {
          setPavingCategory(data.extra_paving_category);
          
          // Find the rate for the selected category
          const selectedOption = pavingOptions.find(option => option.id === data.extra_paving_category);
          if (selectedOption) {
            const totalRate = selectedOption.paver_cost + selectedOption.wastage_cost + selectedOption.margin_cost;
            setSelectedPavingRate(totalRate);
          }
        }
        
        if (data.extra_paving_square_meters) {
          setSquareMeters(data.extra_paving_square_meters);
        }
        
        if (data.extra_paving_total_cost) {
          setTotalCost(data.extra_paving_total_cost);
        }
      }
    } catch (error) {
      console.error("Error fetching existing paving data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle paving category change
  const handlePavingCategoryChange = (value: string) => {
    setPavingCategory(value);
    
    // Find the rate for the selected category
    const selectedOption = pavingOptions.find(option => option.id === value);
    if (selectedOption) {
      const totalRate = selectedOption.paver_cost + selectedOption.wastage_cost + selectedOption.margin_cost;
      setSelectedPavingRate(totalRate);
      
      // Recalculate the total cost
      setTotalCost(totalRate * squareMeters);
    }
  };
  
  // Handle square meters change
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSquareMeters(isNaN(value) ? 0 : value);
    
    // Recalculate the total cost
    setTotalCost(selectedPavingRate * (isNaN(value) ? 0 : value));
  };
  
  // Save paving details
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_paving_category: pavingCategory,
          extra_paving_square_meters: squareMeters,
          extra_paving_total_cost: totalCost
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
            <h3 className="text-xl font-semibold">Extra Paving Concrete</h3>
          </div>
          <p className="text-muted-foreground">
            Add additional paving for your pool area
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="paving-category" className="font-medium">
              Paving Category
            </Label>
            <Select 
              value={pavingCategory} 
              onValueChange={handlePavingCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full md:w-1/2 mt-1">
                <SelectValue placeholder="Select a paving category" />
              </SelectTrigger>
              <SelectContent>
                {pavingOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.category} ({formatCurrency(option.paver_cost + option.wastage_cost + option.margin_cost)}/m²)
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
              className="mt-1 w-full md:w-1/3"
              disabled={isLoading || !pavingCategory}
            />
          </div>
          
          {pavingCategory && squareMeters > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              <div className="grid grid-cols-2 gap-y-2">
                <div>Rate per m²:</div>
                <div className="text-right">{formatCurrency(selectedPavingRate)}</div>
                
                <div>Square meters:</div>
                <div className="text-right">{squareMeters}</div>
                
                <div className="font-medium border-t pt-2 mt-1">Total Cost:</div>
                <div className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
