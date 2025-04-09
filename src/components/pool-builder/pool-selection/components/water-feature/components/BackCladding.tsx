
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { WaterFeatureFormValues } from "@/types/water-feature";
import { BACK_CLADDING_PRICE, BACK_CLADDING_MARGIN } from "../constants";

interface BackCladdingProps {
  form: UseFormReturn<WaterFeatureFormValues>;
}

export const BackCladding: React.FC<BackCladdingProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="backCladdingNeeded"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              Back Cladding Needed
            </FormLabel>
            <div className="text-sm text-muted-foreground">
              Additional ${BACK_CLADDING_PRICE} (includes ${BACK_CLADDING_MARGIN} margin)
            </div>
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
