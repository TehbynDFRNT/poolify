
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

const AdditionalDetailsSection: React.FC = () => {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="text"
                  inputMode="decimal"
                  placeholder="0" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) || value === '') {
                      field.onChange(value === '' ? null : Number(value));
                    }
                  }}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                kg
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="salt_volume_bags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salt Volume (Bags)</FormLabel>
              <FormControl>
                <Input 
                  type="text"
                  inputMode="decimal"
                  placeholder="0" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) || value === '') {
                      field.onChange(value === '' ? null : Number(value));
                    }
                  }}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                bags
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AdditionalDetailsSection;
