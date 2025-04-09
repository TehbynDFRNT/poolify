
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { WaterFeatureFormValues } from "@/types/water-feature";
import { LED_BLADE_OPTIONS } from "../constants";

interface LedBladeSelectorProps {
  form: UseFormReturn<WaterFeatureFormValues>;
}

export const LedBladeSelector: React.FC<LedBladeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="ledBlade"
      render={({ field }) => (
        <FormItem>
          <FormLabel>LED Blade Selection</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select LED blade" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LED_BLADE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {option.price > 0 && ` - $${option.price} (includes $${option.margin} margin)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
