
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

const PriceSection: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="buy_price_ex_gst"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Buy Price (Ex GST)</FormLabel>
            <FormControl>
              <Input 
                type="text"
                inputMode="decimal"
                placeholder="$0.00" 
                value={field.value ? `$${field.value.toFixed(2)}` : ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.]/g, '');
                  if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
                    field.onChange(value === '' ? null : Number(value));
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="buy_price_inc_gst"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Buy Price (Inc GST)</FormLabel>
            <FormControl>
              <Input 
                type="text"
                inputMode="decimal"
                placeholder="$0.00" 
                value={field.value ? `$${field.value.toFixed(2)}` : ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.]/g, '');
                  if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
                    field.onChange(value === '' ? null : Number(value));
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceSection;
