
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

interface FinishOption {
  value: string;
  label: string;
}

interface FinishSelectorProps {
  form: UseFormReturn<WaterFeatureFormValues>;
  name: "frontFinish" | "topFinish" | "sidesFinish"; // Narrowed type to only allow string fields
  label: string;
  options: FinishOption[];
}

export const FinishSelector: React.FC<FinishSelectorProps> = ({ 
  form, 
  name, 
  label, 
  options 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value as string} // Cast to string since we know this field only accepts string values
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
