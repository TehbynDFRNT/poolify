
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface LinearMeterInputProps {
  form: UseFormReturn<FencingFormValues>;
  linearCost: number;
}

const LinearMeterInput: React.FC<LinearMeterInputProps> = ({ form, linearCost }) => {
  return (
    <FormField
      control={form.control}
      name="linearMeters"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Enter total fence length (m)</FormLabel>
          <FormControl>
            <Input type="number" min="0" step="0.1" {...field} />
          </FormControl>
          <FormDescription className="text-xs">
            Cost: ${linearCost.toFixed(2)} (${396} per meter)
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default LinearMeterInput;
