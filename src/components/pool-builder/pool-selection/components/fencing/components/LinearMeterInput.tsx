
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";
import CostDescription from "./CostDescription";

interface LinearMeterInputProps {
  form: UseFormReturn<FencingFormValues>;
  linearCost: number;
  unitCost?: number;
}

const LinearMeterInput: React.FC<LinearMeterInputProps> = ({ 
  form, 
  linearCost,
  unitCost = 396
}) => {
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
          <CostDescription 
            cost={linearCost} 
            unitCost={unitCost} 
          />
        </FormItem>
      )}
    />
  );
};

export default LinearMeterInput;
