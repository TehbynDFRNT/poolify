
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const CalculatedValuesSection: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="volume_liters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume (Liters)</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="Calculated automatically" 
                value={field.value ? Math.round(field.value).toLocaleString() : ''}
                disabled
                className="text-right pr-10 relative"
              />
            </FormControl>
            <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
              L
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="waterline_l_m"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waterline (L/m)</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="Calculated automatically" 
                value={field.value ? field.value.toFixed(2) : ''}
                disabled
                className="text-right pr-10 relative"
              />
            </FormControl>
            <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
              L/m
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CalculatedValuesSection;
