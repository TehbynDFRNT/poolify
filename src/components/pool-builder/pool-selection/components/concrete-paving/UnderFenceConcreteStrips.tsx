
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Layers } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  
  // Fetch strip types on component mount
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
        console.error("Error fetching existing strips data:", error);
      } else if (data) {
        try {
          // Data is stored as a JSON array
          if (data.under_fence_concrete_strips_data && Array.isArray(data.under_fence_concrete_strips_data)) {
            // Ensure we have the right type
            const stripsData = data.under_fence_concrete_strips_data as ConcreteStripData[];
            setSelectedStrips(stripsData);
          } else {
            setSelectedStrips([]);
          }
          
          if (data.under_fence_concrete_strips_cost) {
            setTotalCost(data.under_fence_concrete_strips_cost);
          }
        } catch (parseError) {
          console.error("Error parsing strips data:", parseError);
        }
      }
    } catch (error) {
      console.error("Error fetching existing strips data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total cost whenever selected strips change
  useEffect(() => {
    let total = 0;
    selectedStrips.forEach(strip => {
      const stripType = stripTypes.find(type => type.id === strip.id);
      if (stripType) {
        const stripCost = stripType.cost + stripType.margin;
        total += stripCost * strip.length;
      }
    });
    setTotalCost(total);
  }, [selectedStrips, stripTypes]);
  
  // Handle strip selection
  const handleStripSelection = (stripId: string, checked: boolean) => {
    if (checked) {
      const exists = selectedStrips.some(strip => strip.id === stripId);
      if (!exists) {
        setSelectedStrips([...selectedStrips, { id: stripId, length: 1 }]);
      }
    } else {
      setSelectedStrips(selectedStrips.filter(strip => strip.id !== stripId));
    }
  };
  
  // Handle length change
  const handleLengthChange = (stripId: string, value: string) => {
    const length = parseFloat(value);
    
    setSelectedStrips(selectedStrips.map(strip => {
      if (strip.id === stripId) {
        return { ...strip, length: isNaN(length) || length <= 0 ? 1 : length };
      }
      return strip;
    }));
  };
  
  // Save strips data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          under_fence_concrete_strips_data: selectedStrips,
          under_fence_concrete_strips_cost: totalCost
        })
        .eq('id', customerId);
        
      if (error) throw error;
      
      toast.success("Under fence concrete strips saved successfully.");
    } catch (error) {
      console.error("Error saving under fence concrete strips:", error);
      toast.error("Failed to save under fence concrete strips.");
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
            <h3 className="text-xl font-semibold">Under Fence Concrete Strips</h3>
          </div>
          <p className="text-muted-foreground">
            Add concrete strips under fences for your project
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
        <div className="space-y-4">
          {stripTypes.map((stripType) => (
            <div key={stripType.id} className="flex items-start space-x-4 p-3 border rounded-md hover:bg-slate-50">
              <div className="flex items-center h-5 mt-1">
                <Checkbox 
                  id={`strip-${stripType.id}`} 
                  checked={selectedStrips.some(strip => strip.id === stripType.id)}
                  onCheckedChange={(checked) => handleStripSelection(stripType.id, checked === true)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-grow">
                <Label htmlFor={`strip-${stripType.id}`} className="font-medium">
                  {stripType.type}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(stripType.cost + stripType.margin)} per meter
                </p>
              </div>
              
              {selectedStrips.some(strip => strip.id === stripType.id) && (
                <div className="w-24">
                  <Label htmlFor={`length-${stripType.id}`} className="text-sm">Length (m)</Label>
                  <Input
                    id={`length-${stripType.id}`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={selectedStrips.find(strip => strip.id === stripType.id)?.length || 1}
                    onChange={(e) => handleLengthChange(stripType.id, e.target.value)}
                    className="mt-1 h-8"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          ))}
          
          {selectedStrips.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              <div className="space-y-2">
                {selectedStrips.map(selectedStrip => {
                  const stripType = stripTypes.find(type => type.id === selectedStrip.id);
                  if (!stripType) return null;
                  
                  const ratePerMeter = stripType.cost + stripType.margin;
                  const itemTotal = ratePerMeter * selectedStrip.length;
                  
                  return (
                    <div key={selectedStrip.id} className="grid grid-cols-3 gap-y-1 text-sm">
                      <span>{stripType.type}</span>
                      <span className="text-right">{selectedStrip.length}m × {formatCurrency(ratePerMeter)}</span>
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
          
          {stripTypes.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No concrete strip types available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
