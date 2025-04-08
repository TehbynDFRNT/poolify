
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UnderFenceConcreteStripSelection } from "@/types/under-fence-concrete-strip";
import { Fence } from "lucide-react";

interface UnderFenceConcreteStripsProps {
  pool: Pool;
  customerId: string;
}

interface ConcreteStripData {
  id: string;
  length: number;
}

export const UnderFenceConcreteStrips: React.FC<UnderFenceConcreteStripsProps> = ({ pool, customerId }) => {
  const [stripTypes, setStripTypes] = useState<any[]>([]);
  const [selectedStrips, setSelectedStrips] = useState<ConcreteStripData[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchStripTypes();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);
  
  const fetchStripTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('under_fence_concrete_strips')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setStripTypes(data);
      }
    } catch (error) {
      console.error("Error fetching under fence concrete strip types:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select('under_fence_concrete_strips_data, under_fence_concrete_strips_cost')
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching existing under fence concrete strip data:", error);
      } else if (data) {
        // Set total cost
        if (data.under_fence_concrete_strips_cost) {
          setTotalCost(data.under_fence_concrete_strips_cost);
        }
        
        // Set selected strips
        try {
          // Data is stored as a JSON array
          if (data.under_fence_concrete_strips_data) {
            let parsedData;
            
            if (typeof data.under_fence_concrete_strips_data === 'string') {
              parsedData = JSON.parse(data.under_fence_concrete_strips_data);
            } else {
              parsedData = data.under_fence_concrete_strips_data;
            }
            
            if (Array.isArray(parsedData)) {
              const typedData: ConcreteStripData[] = parsedData.map(item => ({
                id: String(item.id || ''),
                length: Number(item.length || 0)
              }));
              setSelectedStrips(typedData);
            }
          } else {
            setSelectedStrips([]);
          }
        } catch (e) {
          console.error("Error parsing under fence concrete strips data:", e);
          setSelectedStrips([]);
        }
      }
    } catch (error) {
      console.error("Error fetching existing under fence concrete strip data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddStrip = (stripId: string) => {
    // Check if this strip type is already added
    const existingStrip = selectedStrips.find(strip => strip.id === stripId);
    
    if (!existingStrip) {
      setSelectedStrips([...selectedStrips, { id: stripId, length: 0 }]);
    }
  };
  
  const handleLengthChange = (stripId: string, length: number) => {
    const updatedStrips = selectedStrips.map(strip => {
      if (strip.id === stripId) {
        return { ...strip, length };
      }
      return strip;
    });
    
    setSelectedStrips(updatedStrips);
    calculateTotalCost(updatedStrips);
  };
  
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = selectedStrips.filter(strip => strip.id !== stripId);
    setSelectedStrips(updatedStrips);
    calculateTotalCost(updatedStrips);
  };
  
  const calculateTotalCost = (strips: ConcreteStripData[]) => {
    let total = 0;
    
    strips.forEach(strip => {
      const stripType = stripTypes.find(type => type.id === strip.id);
      if (stripType && strip.length > 0) {
        // Calculate cost: (cost + margin) * length
        const costPerMeter = stripType.cost + stripType.margin;
        total += costPerMeter * strip.length;
      }
    });
    
    setTotalCost(total);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          under_fence_concrete_strips_data: selectedStrips as any,
          under_fence_concrete_strips_cost: totalCost
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Under fence concrete strip details saved successfully.");
    } catch (error) {
      console.error("Error saving under fence concrete strip details:", error);
      toast.error("Failed to save under fence concrete strip details.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Fence className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Under Fence Concrete Strips</h3>
          </div>
          <p className="text-muted-foreground">
            Add under fence concrete strips for your project
          </p>
        </div>
        
        {customerId && (
          <SaveButton 
            onClick={handleSave}
            isSubmitting={isSaving}
            disabled={false}
            buttonText="Save Strips"
            className="bg-primary"
          />
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div>
            <Label htmlFor="strip-type" className="font-medium">
              Add Strip Type
            </Label>
            <Select 
              onValueChange={handleAddStrip}
              value=""
              disabled={isLoading}
            >
              <SelectTrigger id="strip-type" className="mt-2">
                <SelectValue placeholder="Select a strip type to add" />
              </SelectTrigger>
              <SelectContent>
                {stripTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedStrips.length > 0 && (
            <div className="space-y-4">
              {selectedStrips.map((strip, index) => {
                const stripType = stripTypes.find(type => type.id === strip.id);
                if (!stripType) return null;
                
                const costPerMeter = stripType.cost + stripType.margin;
                const stripTotal = strip.length * costPerMeter;
                
                return (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{stripType.type}</h4>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleRemoveStrip(strip.id)}
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`length-${index}`} className="text-sm">
                          Length (meters)
                        </Label>
                        <Input
                          id={`length-${index}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={strip.length || ''}
                          onChange={(e) => handleLengthChange(strip.id, parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      
                      {strip.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <div className="grid grid-cols-2 gap-y-1">
                            <span>Cost per meter:</span>
                            <span className="text-right">${costPerMeter.toFixed(2)}</span>
                            
                            <span>Length:</span>
                            <span className="text-right">{strip.length} m</span>
                            
                            <span className="font-medium">Total:</span>
                            <span className="text-right font-medium">${stripTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Total Cost:</h4>
                  <span className="font-medium text-lg">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {stripTypes.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No under fence concrete strip types available
            </div>
          )}
          
          {stripTypes.length > 0 && selectedStrips.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Select a strip type to add to your project
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
