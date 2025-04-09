
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Scissors } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConcreteCutsProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const ConcreteCuts: React.FC<ConcreteCutsProps> = ({ pool, customerId, onSaveComplete }) => {
  const [cutTypes, setCutTypes] = useState<any[]>([]);
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch cut types on component mount
  useEffect(() => {
    fetchCutTypes();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);
  
  const fetchCutTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('concrete_cuts')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setCutTypes(data);
      }
    } catch (error) {
      console.error("Error fetching concrete cut types:", error);
    }
  };
  
  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      // Fetch project data
      const { data, error } = await supabase
        .from('pool_projects')
        .select('*')
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching existing concrete cuts data:", error);
      } else if (data) {
        try {
          // Data is stored as a string in the format "id:quantity,id:quantity"
          if (data.concrete_cuts) {
            const cutsData = data.concrete_cuts.split(',').filter(Boolean);
            const selectedCutsIds: string[] = [];
            const quantitiesObj: Record<string, number> = {};
            
            cutsData.forEach(cut => {
              const [id, quantity] = cut.split(':');
              if (id && quantity) {
                selectedCutsIds.push(id);
                quantitiesObj[id] = parseInt(quantity, 10);
              }
            });
            
            setSelectedCuts(selectedCutsIds);
            setQuantities(quantitiesObj);
          }
          
          if (data.concrete_cuts_cost) {
            setTotalCost(data.concrete_cuts_cost);
          }
        } catch (parseError) {
          console.error("Error parsing concrete cuts data:", parseError);
        }
      }
    } catch (error) {
      console.error("Error fetching existing concrete cuts data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total cost whenever selected cuts or quantities change
  useEffect(() => {
    let total = 0;
    selectedCuts.forEach(cutId => {
      const cutType = cutTypes.find(type => type.id === cutId);
      if (cutType) {
        total += cutType.price * (quantities[cutId] || 1);
      }
    });
    setTotalCost(total);
  }, [selectedCuts, quantities, cutTypes]);
  
  // Handle cut selection/deselection
  const handleCutSelection = (cutId: string, checked: boolean) => {
    if (checked) {
      setSelectedCuts([...selectedCuts, cutId]);
      // Initialize quantity to 1 if not already set
      if (!quantities[cutId]) {
        setQuantities({...quantities, [cutId]: 1});
      }
    } else {
      setSelectedCuts(selectedCuts.filter(id => id !== cutId));
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (cutId: string, value: string) => {
    const quantity = parseInt(value, 10);
    setQuantities({
      ...quantities,
      [cutId]: isNaN(quantity) || quantity < 1 ? 1 : quantity
    });
  };
  
  // Remove a specific cut from selection
  const handleRemoveCut = (cutId: string) => {
    setSelectedCuts(selectedCuts.filter(id => id !== cutId));
    
    // Create a new quantities object without the removed cut
    const newQuantities = {...quantities};
    delete newQuantities[cutId];
    setQuantities(newQuantities);
  };
  
  // Save concrete cuts data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Format data for storage
      const cutsData = selectedCuts.map(cutId => 
        `${cutId}:${quantities[cutId] || 1}`
      ).join(',');
      
      const { error } = await supabase
        .from('pool_projects')
        .update({
          concrete_cuts: cutsData,
          concrete_cuts_cost: totalCost
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Concrete cuts saved successfully.");
      
      // Call the callback function to notify parent components
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error saving concrete cuts:", error);
      toast.error("Failed to save concrete cuts.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Clear all selected cuts
  const handleClearAll = () => {
    if (selectedCuts.length === 0) return;
    
    if (window.confirm("Are you sure you want to remove all selected concrete cuts?")) {
      setSelectedCuts([]);
      setQuantities({});
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Concrete Cuts</h3>
          </div>
          <p className="text-muted-foreground">
            Select concrete cuts required for your project
          </p>
        </div>
        
        <div className="flex gap-2">
          {selectedCuts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
          
          {customerId && (
            <SaveButton 
              onClick={handleSave}
              isSubmitting={isSaving}
              disabled={false}
              buttonText="Save Cuts"
              className="bg-primary"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          {cutTypes.map((cutType) => (
            <div key={cutType.id} className="flex items-start space-x-4 p-3 border rounded-md hover:bg-slate-50">
              <div className="flex items-center h-5 mt-1">
                <Checkbox 
                  id={`cut-${cutType.id}`} 
                  checked={selectedCuts.includes(cutType.id)}
                  onCheckedChange={(checked) => handleCutSelection(cutType.id, checked === true)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-grow">
                <Label htmlFor={`cut-${cutType.id}`} className="font-medium">
                  {cutType.cut_type}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(cutType.price)} per cut
                </p>
              </div>
              
              {selectedCuts.includes(cutType.id) && (
                <div className="flex items-end gap-2">
                  <div className="w-24">
                    <Label htmlFor={`quantity-${cutType.id}`} className="text-sm">Quantity</Label>
                    <Input
                      id={`quantity-${cutType.id}`}
                      type="number"
                      min="1"
                      value={quantities[cutType.id] || 1}
                      onChange={(e) => handleQuantityChange(cutType.id, e.target.value)}
                      className="mt-1 h-8"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-8 w-8 p-0"
                    onClick={() => handleRemoveCut(cutType.id)}
                    title="Remove this cut"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {selectedCuts.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              <div className="space-y-2">
                {selectedCuts.map(cutId => {
                  const cutType = cutTypes.find(type => type.id === cutId);
                  if (!cutType) return null;
                  
                  const quantity = quantities[cutId] || 1;
                  const itemTotal = cutType.price * quantity;
                  
                  return (
                    <div key={cutId} className="grid grid-cols-3 gap-y-1 text-sm">
                      <span>{cutType.cut_type}</span>
                      <span className="text-right">{quantity} × {formatCurrency(cutType.price)}</span>
                      <span className="text-right">{formatCurrency(itemTotal)}</span>
                    </div>
                  );
                })}
                
                <div className="grid grid-cols-3 gap-y-1 pt-2 border-t mt-2 font-medium">
                  <span>Total</span>
                  <span></span>
                  <span className="text-right">{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          )}
          
          {cutTypes.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No concrete cut types available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
