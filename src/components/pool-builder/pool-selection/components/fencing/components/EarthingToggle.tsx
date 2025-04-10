
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface EarthingToggleProps {
  form: UseFormReturn<any>;
  isPerMeter?: boolean;
  meterCount?: number;
  perMeterCost?: number;
  earthingCost?: number;
}

const EarthingToggle: React.FC<EarthingToggleProps> = ({ 
  form,
  isPerMeter = false,
  meterCount = 0,
  perMeterCost = 150,
  earthingCost = 40
}) => {
  const description = isPerMeter 
    ? `Adds $${perMeterCost} per meter (${meterCount} meters = $${(meterCount * perMeterCost).toFixed(2)})`
    : `Adds a flat fee of $${earthingCost} to the total`;

  return (
    <FormField
      control={form.control}
      name="earthingRequired"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Include earthing?</FormLabel>
            <FormDescription>
              {description}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EarthingToggle;
