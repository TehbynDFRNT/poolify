
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface GateSelectorProps {
  form: UseFormReturn<FencingFormValues>;
  gatesCost: number;
  freeGateDiscount: number;
}

const GateSelector: React.FC<GateSelectorProps> = ({ form, gatesCost, freeGateDiscount }) => {
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
          <div className="text-xs mt-2">
            <p>Cost: ${gatesCost.toFixed(2)} (${495} per gate)</p>
            {freeGateDiscount !== 0 && (
              <p className="text-green-600">Free Gate Discount: ${freeGateDiscount.toFixed(2)}</p>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default GateSelector;
