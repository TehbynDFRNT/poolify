
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

export const PoolDetailsFields = () => {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="pool_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pool Range</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Piazza" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pool_model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pool Model</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Alto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
