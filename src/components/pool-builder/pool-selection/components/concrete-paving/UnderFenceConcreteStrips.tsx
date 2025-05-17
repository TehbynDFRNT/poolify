import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ConcreteStripData } from "@/types/concrete-paving-summary";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Fence } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { SaveButton } from "../SaveButton";

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
        .from('pool_fence_concrete_strips')
        .select('strip_data, total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching existing under fence strips data:", error);
      } else if (data) {
        if (data.strip_data) {
          try {
            // Parse the data based on its type
            let parsedData;
            if (typeof data.strip_data === 'string') {
              parsedData = JSON.parse(data.strip_data);
            } else {
              // If it's already an object/array, use it directly
              parsedData = data.strip_data;
            }
            setSelectedStrips(parsedData);
          } catch (e) {
            console.error("Error parsing under fence strips data:", e);
          }
        }

        if (data.total_cost) {
          setTotalCost(data.total_cost);
        }
      }
    } catch (error) {
      console.error("Error fetching existing under fence strips data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle strip selection/deselection
  const handleStripSelection = (stripId: string, checked: boolean) => {
    if (checked) {
      // Check if strip already exists
      const existingStrip = selectedStrips.find(s => s.id === stripId);
      if (!existingStrip) {
        setSelectedStrips([...selectedStrips, { id: stripId, length: 1 }]);
      }
    } else {
      // Remove the strip
      setSelectedStrips(selectedStrips.filter(s => s.id !== stripId));
    }
  };

  // Handle strip length change
  const handleLengthChange = (stripId: string, length: number) => {
    const updatedStrips = selectedStrips.map(s =>
      s.id === stripId ? { ...s, length } : s
    );
    setSelectedStrips(updatedStrips);
  };

  // Calculate total cost when selected strips change
  useEffect(() => {
    let total = 0;
    selectedStrips.forEach(selectedStrip => {
      const strip = strips.find(s => s.id === selectedStrip.id);
      if (strip) {
        const length = selectedStrip.length || 1;
        total += (strip.cost + strip.margin) * length;
      }
    });
    setTotalCost(total);
  }, [selectedStrips, strips]);

  // Save strips data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First check if a record already exists
      const { data: existingData } = await supabase
        .from('pool_fence_concrete_strips')
        .select('id')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      let error;

      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pool_fence_concrete_strips')
          .update({
            strip_data: selectedStrips,
            total_cost: totalCost
          })
          .eq('id', existingData.id);

        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pool_fence_concrete_strips')
          .insert({
            pool_project_id: customerId,
            strip_data: selectedStrips,
            total_cost: totalCost
          });

        error = insertError;
      }

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

  // Clear all selected strips
  const handleClearAll = () => {
    if (selectedStrips.length === 0) return;

    if (window.confirm("Are you sure you want to remove all selected concrete strips?")) {
      setSelectedStrips([]);
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
            Select concrete strips under the fence for your project
          </p>
        </div>

        <div className="flex gap-2">
          {selectedStrips.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}

          {customerId && (
            <SaveButton
              onClick={handleSave}
              isSubmitting={isSaving}
              disabled={false}
              buttonText="Save Strips"
              className="bg-primary"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            Loading concrete strip types...
          </div>
        ) : (
          <div className="space-y-4">
            {strips.map((strip) => {
              const selectedStrip = selectedStrips.find(s => s.id === strip.id);
              const isSelected = !!selectedStrip;
              const price = strip.cost + strip.margin;

              return (
                <div key={strip.id} className="border rounded-md hover:bg-slate-50 p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`strip-${strip.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleStripSelection(strip.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`strip-${strip.id}`} className="font-medium">
                        {strip.type}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(price)} per L/M
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex items-end space-x-2">
                        <div>
                          <Label htmlFor={`length-${strip.id}`} className="text-sm">Meters</Label>
                          <Input
                            id={`length-${strip.id}`}
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={selectedStrip.length || 1}
                            onChange={(e) => handleLengthChange(strip.id, parseFloat(e.target.value) || 1)}
                            className="w-20 h-8"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {selectedStrips.length > 0 && (
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Cost Summary</h4>
                <div className="space-y-2">
                  {selectedStrips.map(selectedStrip => {
                    const strip = strips.find(s => s.id === selectedStrip.id);
                    if (!strip) return null;

                    const length = selectedStrip.length || 1;
                    const unitPrice = strip.cost + strip.margin;
                    const itemTotal = unitPrice * length;

                    return (
                      <div key={selectedStrip.id} className="grid grid-cols-3 gap-y-1 text-sm">
                        <span>{strip.type}</span>
                        <span className="text-right">{length} m × {formatCurrency(unitPrice)}</span>
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

            {strips.length === 0 && (
              <div className="text-center py-6 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">
                  No under fence concrete strip types available
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
