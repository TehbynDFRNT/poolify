
import React from "react";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export const PricingFields = () => {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="rrp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RRP</FormLabel>
            <FormControl>
              <Input type="number" min="0" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="trade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trade</FormLabel>
            <FormControl>
              <Input type="number" min="0" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="margin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margin</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                readOnly
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
