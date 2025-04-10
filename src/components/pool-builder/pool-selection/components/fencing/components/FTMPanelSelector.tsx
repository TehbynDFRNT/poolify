
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FTMFencingFormValues } from "../types";

interface FTMPanelSelectorProps {
  form: UseFormReturn<FTMFencingFormValues>;
  simplePanelsCost: number;
  complexPanelsCost: number;
}

const FTMPanelSelector: React.FC<FTMPanelSelectorProps> = ({ 
  form, 
  simplePanelsCost, 
  complexPanelsCost 
}) => {
  return (
    <div className="space-y-4">
      <FormLabel>FTM Retaining Panels</FormLabel>
      
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="simplePanels"
          render={({ field }) => (
            <FormItem className="border p-4 rounded-md">
              <FormLabel>Simple FTM Retaining Panel</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription className="text-xs mt-1">
                Cost: ${simplePanelsCost.toFixed(2)} ($220 per panel)
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="complexPanels"
          render={({ field }) => (
            <FormItem className="border p-4 rounded-md">
              <FormLabel>Complex FTM Retaining Panel</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription className="text-xs mt-1">
                Cost: ${complexPanelsCost.toFixed(2)} ($385 per panel)
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FTMPanelSelector;
