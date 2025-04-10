
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FencingFormValues } from "../types";

interface PanelSelectorProps {
  form: UseFormReturn<FencingFormValues>;
  simplePanelsCost: number;
  complexPanelsCost: number;
  simplePanelUnitCost?: number;
  complexPanelUnitCost?: number;
}

const PanelSelector: React.FC<PanelSelectorProps> = ({ 
  form, 
  simplePanelsCost, 
  complexPanelsCost,
  simplePanelUnitCost = 220,
  complexPanelUnitCost = 660
}) => {
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
        <FormDescription className="text-xs">
          Simple Panels: ${simplePanelsCost.toFixed(2)} (${simplePanelUnitCost} each)
        </FormDescription>
        <FormDescription className="text-xs">
          Complex Panels: ${complexPanelsCost.toFixed(2)} (${complexPanelUnitCost} each)
        </FormDescription>
      </div>
    </div>
  );
};

export default PanelSelector;
