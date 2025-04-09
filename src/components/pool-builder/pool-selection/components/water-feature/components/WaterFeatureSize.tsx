
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
import { WATER_FEATURE_SIZES } from "../constants";

interface WaterFeatureSizeProps {
  form: UseFormReturn<WaterFeatureFormValues>;
}

export const WaterFeatureSize: React.FC<WaterFeatureSizeProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="waterFeatureSize"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Water Feature Size</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {WATER_FEATURE_SIZES.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.size} - ${size.total}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
