
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface PanelSelectorProps {
  form: UseFormReturn<FencingFormValues>;
  simplePanelsCost: number;
  complexPanelsCost: number;
}

const PanelSelector: React.FC<PanelSelectorProps> = ({ form, simplePanelsCost, complexPanelsCost }) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-sm font-medium">FG Retaining Panels</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="simplePanels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Simple FG Retaining Panel</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="complexPanels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complex FG Retaining Panel</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="text-xs space-y-1">
        <p>Simple Panels: ${simplePanelsCost.toFixed(2)} (${220} each)</p>
        <p>Complex Panels: ${complexPanelsCost.toFixed(2)} (${660} each)</p>
      </div>
    </div>
  );
};

export default PanelSelector;
