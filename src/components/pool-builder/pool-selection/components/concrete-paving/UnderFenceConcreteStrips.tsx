
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SaveButton } from "../SaveButton";
import { formatCurrency } from "@/utils/format";
import { ConcreteStripData } from "@/types/concrete-paving-summary";

interface UnderFenceConcreteStripsProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const UnderFenceConcreteStrips: React.FC<UnderFenceConcreteStripsProps> = ({ 
  pool, 
  customerId,
  onSaveComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [strips, setStrips] = useState<any[]>([]);
  const [selectedStrips, setSelectedStrips] = useState<ConcreteStripData[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch strips data on component mount
  useEffect(() => {
    fetchStrips();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);
  
  const fetchStrips = async () => {
    try {
      const { data, error } = await supabase
        .from('under_fence_concrete_strips')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setStrips(data);
      }
    } catch (error) {
      console.error("Error fetching under fence concrete strips:", error);
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
        console.error("Error fetching existing under fence strips data:", error);
      } else if (data) {
        if (data.under_fence_concrete_strips_data) {
          try {
            // Parse the data based on its type
            let parsedData;
            if (typeof data.under_fence_concrete_strips_data === 'string') {
              parsedData = JSON.parse(data.under_fence_concrete_strips_data);
            } else {
              // If it's already an object/array, use it directly
              parsedData = data.under_fence_concrete_strips_data;
            }
            setSelectedStrips(parsedData);
          } catch (e) {
            console.error("Error parsing under fence strips data:", e);
          }
        }
        
        if (data.under_fence_concrete_strips_cost) {
          setTotalCost(data.under_fence_concrete_strips_cost);
        }
      }
    } catch (error) {
      console.error("Error fetching existing under fence strips data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle add strip to selection
  const handleAddStrip = (stripId: string) => {
    // Check if strip already exists
    const existingStrip = selectedStrips.find(s => s.id === stripId);
    if (existingStrip) {
      // Update quantity if exists
      const updatedStrips = selectedStrips.map(s => 
        s.id === stripId ? { ...s, quantity: (s.quantity || 1) + 1 } : s
      );
      setSelectedStrips(updatedStrips);
    } else {
      // Add new strip
      setSelectedStrips([...selectedStrips, { id: stripId, quantity: 1 }]);
    }
  };
  
  // Handle strip length change
  const handleLengthChange = (stripId: string, length: number) => {
    const updatedStrips = selectedStrips.map(s => 
      s.id === stripId ? { ...s, length } : s
    );
    setSelectedStrips(updatedStrips);
  };
  
  // Handle strip quantity change
  const handleQuantityChange = (stripId: string, quantity: number) => {
    const updatedStrips = selectedStrips.map(s => 
      s.id === stripId ? { ...s, quantity } : s
    );
    setSelectedStrips(updatedStrips);
  };
  
  // Handle remove strip
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
    setSelectedStrips(updatedStrips);
  };
  
  // Calculate total cost when selected strips change
  useEffect(() => {
    let total = 0;
    selectedStrips.forEach(selectedStrip => {
      const strip = strips.find(s => s.id === selectedStrip.id);
      if (strip) {
        const quantity = selectedStrip.quantity || 1;
        const length = selectedStrip.length || 1;
        total += (strip.cost + strip.margin) * quantity * length;
      }
    });
    setTotalCost(total);
  }, [selectedStrips, strips]);
  
  // Save strips data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          under_fence_concrete_strips_data: JSON.stringify(selectedStrips),
          under_fence_concrete_strips_cost: totalCost
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Under fence concrete strips saved successfully.");
      
      // Call onSaveComplete callback to refresh the summary
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error saving under fence concrete strips:", error);
      toast.error("Failed to save under fence concrete strips.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Fence className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Under Fence Concrete Strips</h3>
          </div>
          <p className="text-muted-foreground">
            Manage concrete strips under the fence for your project
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
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            Loading concrete strip types...
          </div>
        ) : (
          <div className="space-y-4">
            {strips.map((strip) => (
              <div key={strip.id} className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">{strip.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    Cost: {formatCurrency(strip.cost)} + Margin: {formatCurrency(strip.margin)}
                  </p>
                </div>
                
                <div className="flex items-end gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Length (m)</label>
                    <input
                      type="number"
                      className="w-24 h-8 rounded-md bg-black text-white px-2 text-sm"
                      value={selectedStrips.find(s => s.id === strip.id)?.length || ''}
                      onChange={(e) => handleLengthChange(strip.id, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Quantity</label>
                    <input
                      type="number"
                      className="w-24 h-8 rounded-md bg-black text-white px-2 text-sm"
                      value={selectedStrips.find(s => s.id === strip.id)?.quantity || ''}
                      onChange={(e) => handleQuantityChange(strip.id, parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleAddStrip(strip.id)}
                    className="h-8 px-4 bg-teal-500 text-white rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            
            {selectedStrips.length > 0 && (
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Selected Strips</h4>
                <div className="space-y-2">
                  {selectedStrips.map(selectedStrip => {
                    const strip = strips.find(s => s.id === selectedStrip.id);
                    if (!strip) return null;
                    
                    const quantity = selectedStrip.quantity || 1;
                    const length = selectedStrip.length || 1;
                    const itemTotal = (strip.cost + strip.margin) * quantity * length;
                    
                    return (
                      <div key={selectedStrip.id} className="flex justify-between items-center py-2 px-4 bg-white rounded border">
                        <div>
                          <span className="font-medium">{strip.type}</span>
                          <div className="text-sm text-gray-600">
                            {quantity} × {length}m × {formatCurrency(strip.cost + strip.margin)} = {formatCurrency(itemTotal)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStrip(selectedStrip.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {strips.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No under fence concrete strip types available
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
