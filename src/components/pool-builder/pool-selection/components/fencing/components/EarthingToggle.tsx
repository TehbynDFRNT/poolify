
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface EarthingToggleProps {
  form: UseFormReturn<FencingFormValues>;
}

const EarthingToggle: React.FC<EarthingToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="earthingRequired"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Include earthing?</FormLabel>
            <FormDescription>
              Adds a flat fee of $40 to the total
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
