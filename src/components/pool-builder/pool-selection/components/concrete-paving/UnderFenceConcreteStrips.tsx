import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Fence } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";

interface UnderFenceConcreteStripsProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

interface Strip {
  id: string;
  type: string;
  cost: number;
  margin: number;
}

interface SelectedStrip {
  id: string;
  length: number;
}

export const UnderFenceConcreteStrips: React.FC<UnderFenceConcreteStripsProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  const [strips, setStrips] = useState<Strip[]>([]);
  const [selectedStrips, setSelectedStrips] = useState<SelectedStrip[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Use the guarded actions hook
  const {
    handleSave,
    isSubmitting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Fetch strips and existing data on component mount
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
      console.error("Error fetching concrete strips:", error);
    }
  };

  const fetchExistingData = async () => {
    // console.log(`[UnderFenceStrips] FETCHING FOR CUSTOMER: ${customerId} - Time: ${new Date().toLocaleTimeString()}`);
    try {
      const { data, error } = await supabase
        .from('pool_fence_concrete_strips') // Table for selected strips
        .select('*') // Selecting all columns to inspect
        .eq('pool_project_id', customerId)
        .maybeSingle();

      // console.log('[UnderFenceStrips] RAW DB DATA for selected strips:', JSON.stringify(data));
      // console.log('[UnderFenceStrips] DB Error (if any):', error);

      if (error && error.code !== 'PGRST116') {
        // console.error("[UnderFenceStrips] DB Error fetching existing strips data:", error);
        setSelectedStrips([]);
        setTotalCost(0);
        return; // Early exit on significant DB error
      }

      if (data) {
        // console.log('[UnderFenceStrips] Data found in pool_fence_concrete_strips.');
        if (data.strip_data) {
          // console.log('[UnderFenceStrips] data.strip_data (type:', typeof data.strip_data, '):', JSON.stringify(data.strip_data));
          // Ensure strip_data is an array before setting state
          if (Array.isArray(data.strip_data)) {
            setSelectedStrips(data.strip_data);
            // console.log('[UnderFenceStrips] setSelectedStrips with:', data.strip_data);
          } else {
            // console.warn('[UnderFenceStrips] data.strip_data is not an array. Setting selectedStrips to empty array.');
            setSelectedStrips([]);
          }
        } else {
          // console.log('[UnderFenceStrips] No strip_data field in fetched data or it is null. Setting selectedStrips to empty array.');
          setSelectedStrips([]);
        }
        if (data.total_cost !== undefined && data.total_cost !== null) {
          // console.log('[UnderFenceStrips] data.total_cost:', data.total_cost);
          setTotalCost(data.total_cost);
        } else {
          // console.log('[UnderFenceStrips] No total_cost field in fetched data or it is null/undefined. Setting totalCost to 0.');
          setTotalCost(0);
        }
      } else {
        // console.log('[UnderFenceStrips] No data object returned from DB (PGRST116 or other). Resetting form.');
        setSelectedStrips([]);
        setTotalCost(0);
      }
    } catch (err) {
      // console.error("[UnderFenceStrips] CATCH block error in fetchExistingData:", err);
      setSelectedStrips([]);
      setTotalCost(0);
    } finally {
      setIsLoading(false); // This was already here, ensures loading is always turned off.
      // console.log(`[UnderFenceStrips] fetchExistingData finished. Current state - selectedStrips count: ${selectedStrips.length}, totalCost: ${totalCost}`);
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

  // Save strips data using the guarded hook
  const handleSaveClick = async () => {
    console.log('[UnderFenceStrips] handleSaveClick: Initiated.');
    console.log('[UnderFenceStrips] handleSaveClick: Current selectedStrips STATE:', JSON.stringify(selectedStrips));
    console.log('[UnderFenceStrips] handleSaveClick: Current totalCost STATE:', totalCost);

    // Prepare data to save - don't include pool_project_id as the hook will add it
    const dataToSave = {
      strip_data: selectedStrips, // This is an array of objects
      total_cost: totalCost
    };

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleSave(dataToSave, 'pool_fence_concrete_strips');

    console.log('[UnderFenceStrips] handleSaveClick: Save operation result:', result);

    if (result.success) {
      if (onSaveComplete) {
        onSaveComplete();
      }
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
    <>
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
                onClick={handleSaveClick}
                isSubmitting={isSubmitting}
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
                <div className="text-center py-6 text-muted-foreground">
                  No concrete strip types available
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <StatusWarningDialog />
    </>
  );
};
