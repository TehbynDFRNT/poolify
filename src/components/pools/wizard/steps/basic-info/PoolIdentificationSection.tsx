
import React, { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

const PoolIdentificationSection: React.FC = () => {
  const { control } = useFormContext();
  const [poolRanges, setPoolRanges] = useState<string[]>([]);
  
  // Fetch pool ranges
  useEffect(() => {
    const fetchPoolRanges = async () => {
      const { data, error } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      if (error) {
        console.error("Error fetching pool ranges:", error);
        return;
      }

      if (data) {
        const ranges = data.map((item) => item.name);
        setPoolRanges(ranges);
      }
    };

    fetchPoolRanges();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pool Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter pool name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pool Range</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {poolRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PoolIdentificationSection;
