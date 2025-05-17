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
import { SaveButton } from "../SaveButton";

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
  const [isPumpNeeded, setIsPumpNeeded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Save concrete pump data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First check if a record already exists
      const { data: existingData } = await supabase
        .from('pool_concrete_selections')
        .select('id')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      let error;

      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pool_concrete_selections')
          .update({
            concrete_pump_needed: isPumpNeeded,
            concrete_pump_quantity: isPumpNeeded ? quantity : null,
            concrete_pump_total_cost: isPumpNeeded ? totalCost : 0
          })
          .eq('id', existingData.id);

        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pool_concrete_selections')
          .insert({
            pool_project_id: customerId,
            concrete_pump_needed: isPumpNeeded,
            concrete_pump_quantity: isPumpNeeded ? quantity : null,
            concrete_pump_total_cost: isPumpNeeded ? totalCost : 0
          });

        error = insertError;
      }

      if (error) throw error;

      toast.success("Concrete pump details saved successfully.");

      // Call the onSaveComplete callback if provided
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error("Error saving concrete pump details:", error);
      toast.error("Failed to save concrete pump details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Concrete Pump</h3>
          </div>
          <p className="text-muted-foreground">
            Specify if a concrete pump is required for your project
          </p>
        </div>

        {customerId && (
          <SaveButton
            onClick={handleSave}
            isSubmitting={isSaving}
            disabled={false}
            buttonText="Save Details"
            className="bg-primary"
          />
        )}
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
  );
};
