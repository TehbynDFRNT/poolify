
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface GateSelectorProps {
  form: UseFormReturn<FencingFormValues>;
  gatesCost: number;
  freeGateDiscount: number;
  unitCost?: number;
}

const GateSelector: React.FC<GateSelectorProps> = ({ 
  form, 
  gatesCost, 
  freeGateDiscount,
  unitCost = 495
}) => {
  return (
    <FormField
      control={form.control}
      name="gates"
      render={({ field }) => (
        <FormItem className="border p-4 rounded-md">
          <FormLabel>Gate Selection</FormLabel>
          <FormControl>
            <Input type="number" min="0" {...field} />
          </FormControl>
          <div className="text-xs mt-2 space-y-1">
            <FormDescription className="text-xs">
              Cost: ${gatesCost.toFixed(2)} (${unitCost} per gate)
            </FormDescription>
            {freeGateDiscount !== 0 && (
              <p className="text-green-600 text-xs">Free Gate Discount: ${Math.abs(freeGateDiscount).toFixed(2)}</p>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default GateSelector;
