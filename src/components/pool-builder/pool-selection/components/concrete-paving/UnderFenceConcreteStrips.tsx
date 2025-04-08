
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SaveButton } from "../SaveButton";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Fence } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface UnderFenceConcreteStripsProps {
  pool: Pool;
  customerId: string;
}

export const UnderFenceConcreteStrips: React.FC<UnderFenceConcreteStripsProps> = ({ pool, customerId }) => {
  const [stripTypes, setStripTypes] = useState<any[]>([]);
  const [selectedStrips, setSelectedStrips] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
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
      console.error("Error fetching under fence concrete strips:", error);
    }
  };
  
  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      // Fetch project data
      const { data, error } = await supabase
        .from('pool_projects')
        .select('site_requirements_data')
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching existing under fence strips data:", error);
      } else if (data && data.site_requirements_data) {
        // Extract under fence strips data from site requirements
        const underFenceData = data.site_requirements_data.filter(
          (item: any) => item.type === 'under_fence_strip'
        );
        
        if (underFenceData.length > 0) {
          const selectedStripsIds: string[] = [];
          const quantitiesObj: Record<string, number> = {};
          
          underFenceData.forEach((item: any) => {
            if (item.stripId && item.length) {
              selectedStripsIds.push(item.stripId);
              quantitiesObj[item.stripId] = item.length;
            }
          });
          
          setSelectedStrips(selectedStripsIds);
          setQuantities(quantitiesObj);
          
          // Calculate total cost
          let total = 0;
          underFenceData.forEach((item: any) => {
            const stripType = stripTypes.find(type => type.id === item.stripId);
            if (stripType) {
              total += (stripType.cost + stripType.margin) * item.length;
            }
          });
          
          setTotalCost(total);
        }
      }
    } catch (error) {
      console.error("Error fetching existing under fence strips data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total cost whenever selected strips or quantities change
  useEffect(() => {
    let total = 0;
    selectedStrips.forEach(stripId => {
      const stripType = stripTypes.find(type => type.id === stripId);
      if (stripType) {
        total += (stripType.cost + stripType.margin) * (quantities[stripId] || 1);
      }
    });
    setTotalCost(total);
  }, [selectedStrips, quantities, stripTypes]);
  
  // Handle strip selection
  const handleStripSelection = (stripId: string, checked: boolean) => {
    if (checked) {
      setSelectedStrips([...selectedStrips, stripId]);
      // Initialize quantity to 1 if not already set
      if (!quantities[stripId]) {
        setQuantities({...quantities, [stripId]: 1});
      }
    } else {
      setSelectedStrips(selectedStrips.filter(id => id !== stripId));
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (stripId: string, value: string) => {
    const quantity = parseFloat(value);
    setQuantities({
      ...quantities,
      [stripId]: isNaN(quantity) || quantity <= 0 ? 1 : quantity
    });
  };
  
  // Save under fence concrete strips data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Fetch existing site requirements data
      const { data, error } = await supabase
        .from('pool_projects')
        .select('site_requirements_data')
        .eq('id', customerId)
        .single();
        
      if (error) throw error;
      
      // Remove existing under fence strips data
      let siteRequirementsData = data.site_requirements_data || [];
      siteRequirementsData = siteRequirementsData.filter(
        (item: any) => item.type !== 'under_fence_strip'
      );
      
      // Add new under fence strips data
      selectedStrips.forEach(stripId => {
        const stripType = stripTypes.find(type => type.id === stripId);
        if (stripType) {
          const length = quantities[stripId] || 1;
          const cost = (stripType.cost + stripType.margin) * length;
          
          siteRequirementsData.push({
            type: 'under_fence_strip',
            stripId,
            stripType: stripType.type,
            length,
            cost
          });
        }
      });
      
      // Update the database
      const { error: updateError } = await supabase
        .from('pool_projects')
        .update({
          site_requirements_data: siteRequirementsData
        })
        .eq('id', customerId);
        
      if (updateError) throw updateError;
      
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
            <Fence className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Under Fence Concrete Strips</h3>
          </div>
          <p className="text-muted-foreground">
            Add concrete strips under fences where required
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
                  checked={selectedStrips.includes(stripType.id)}
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
              
              {selectedStrips.includes(stripType.id) && (
                <div className="w-24">
                  <Label htmlFor={`length-${stripType.id}`} className="text-sm">Length (m)</Label>
                  <Input
                    id={`length-${stripType.id}`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantities[stripType.id] || 1}
                    onChange={(e) => handleQuantityChange(stripType.id, e.target.value)}
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
                {selectedStrips.map(stripId => {
                  const stripType = stripTypes.find(type => type.id === stripId);
                  if (!stripType) return null;
                  
                  const length = quantities[stripId] || 1;
                  const ratePerMeter = stripType.cost + stripType.margin;
                  const itemTotal = ratePerMeter * length;
                  
                  return (
                    <div key={stripId} className="grid grid-cols-3 gap-y-1 text-sm">
                      <span>{stripType.type}</span>
                      <span className="text-right">{length}m × {formatCurrency(ratePerMeter)}</span>
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
              No under fence concrete strip types available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
