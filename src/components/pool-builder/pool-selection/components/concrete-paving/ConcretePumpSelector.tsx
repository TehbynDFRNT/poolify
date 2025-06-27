import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { useQueryClient } from "@tanstack/react-query";

interface ConcretePumpSelectorProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const ConcretePumpSelector: React.FC<ConcretePumpSelectorProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  const [isPumpNeeded, setIsPumpNeeded] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Use the guarded actions hook
  const {
    handleSave,
    isSubmitting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);
  
  const queryClient = useQueryClient();

  // Get concrete pump base rate from database
  const { concretePump, isLoading: isPumpLoading } = useConcretePump();

  // Default pump rate if data is not loaded yet
  const pumpRate = concretePump ? concretePump.price : 1050.00;

  // Fetch existing data when component mounts
  useEffect(() => {
    fetchExistingData();
  }, [customerId]);

  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_concrete_selections')
        .select('concrete_pump_needed, concrete_pump_quantity, concrete_pump_total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching concrete pump data:", error);
      } else if (data) {
        setIsPumpNeeded(data.concrete_pump_needed || false);
        setQuantity(data.concrete_pump_quantity || 1);
        setTotalCost(data.concrete_pump_total_cost || 0);
      }
    } catch (error) {
      console.error("Error fetching concrete pump data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate cost whenever pump status or quantity changes
  useEffect(() => {
    if (isPumpNeeded && quantity > 0) {
      setTotalCost(pumpRate * quantity);
    } else {
      setTotalCost(0);
    }
  }, [isPumpNeeded, quantity, pumpRate]);

  // Auto-save effect - only trigger on user input changes
  useEffect(() => {
    if (!customerId || isLoading || isPumpLoading || !pumpRate) return;

    const timer = setTimeout(async () => {
      // Calculate total cost inline
      const calculatedTotalCost = isPumpNeeded && quantity > 0 ? quantity * pumpRate : 0;
      
      // Always save the current state, even if pump is not needed
      const dataToSave = {
        concrete_pump_needed: isPumpNeeded,
        concrete_pump_quantity: isPumpNeeded ? quantity : null,
        concrete_pump_total_cost: calculatedTotalCost
      };

      console.log('[ConcretePumpSelector] Auto-saving data:', dataToSave);

      try {
        // Check if record exists
        const { data: existingData, error: checkError } = await supabase
          .from('pool_concrete_selections')
          .select('id')
          .eq('pool_project_id', customerId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('[ConcretePumpSelector] Error checking existing data:', checkError);
          return;
        }

        if (existingData?.id) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('pool_concrete_selections')
            .update(dataToSave)
            .eq('id', existingData.id);

          if (updateError) {
            console.error('[ConcretePumpSelector] Error updating:', updateError);
            toast.error("Failed to save concrete pump selection");
          } else {
            // Invalidate the snapshot query after successful save
            queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] });
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('pool_concrete_selections')
            .insert({
              ...dataToSave,
              pool_project_id: customerId
            });

          if (insertError) {
            console.error('[ConcretePumpSelector] Error inserting:', insertError);
            toast.error("Failed to save concrete pump selection");
          } else {
            // Invalidate the snapshot query after successful save
            queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] });
          }
        }
      } catch (error) {
        console.error('[ConcretePumpSelector] Auto-save error:', error);
      }
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(timer);
  }, [isPumpNeeded, quantity, customerId, pumpRate]); // Only depend on actual user inputs and stable values

  // Handle pump toggle
  const handlePumpToggle = (checked: boolean) => {
    setIsPumpNeeded(checked);
    if (!checked) {
      setQuantity(1);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  // Save concrete pump data using the guarded hook
  const handleSaveClick = async () => {
    // Prepare data to save
    const dataToSave = {
      concrete_pump_needed: isPumpNeeded,
      concrete_pump_quantity: isPumpNeeded ? quantity : null,
      concrete_pump_total_cost: isPumpNeeded ? totalCost : 0
    };

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleSave(dataToSave, 'pool_concrete_selections');

    if (result.success) {
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-white pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Concrete Pump</h3>
            </div>
            <p className="text-muted-foreground">
              Specify if a concrete pump is required for your project
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="pump-needed"
                checked={isPumpNeeded}
                onCheckedChange={handlePumpToggle}
                disabled={isLoading}
              />
              <Label htmlFor="pump-needed" className="font-medium">
                Concrete Pump Required
              </Label>
            </div>

            <div className="text-sm text-muted-foreground">
              Base rate: {formatCurrency(pumpRate)}/day
            </div>
          </div>

          {isPumpNeeded && (
            <>
              <div className="mt-4">
                <Label htmlFor="pump-quantity" className="font-medium">
                  Number of Days/Instances Required
                </Label>
                <Input
                  id="pump-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mt-2 w-full md:w-1/3"
                  disabled={isLoading || !isPumpNeeded}
                />
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Cost Summary</h4>
                <div className="grid grid-cols-2 gap-y-2">
                  <div>Rate per day:</div>
                  <div className="text-right">{formatCurrency(pumpRate)}</div>

                  <div>Number of days:</div>
                  <div className="text-right">{quantity}</div>

                  <div className="font-medium border-t pt-2 mt-1">Total Cost:</div>
                  <div className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>This is based on the standard formula: Rate × Number of Days</p>
                  <p className="mt-1">Example: {formatCurrency(pumpRate)} × {quantity} = {formatCurrency(totalCost)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <StatusWarningDialog />
    </>
  );
};
