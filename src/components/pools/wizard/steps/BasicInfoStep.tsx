
import React, { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { usePoolWizard } from "@/contexts/PoolWizardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const BasicInfoStep: React.FC = () => {
  const { form } = usePoolWizard();
  const { control, watch, setValue } = useFormContext();
  const [poolRanges, setPoolRanges] = useState<string[]>([]);
  
  const length = watch("length");
  const width = watch("width");
  const depthShallow = watch("depth_shallow");
  const depthDeep = watch("depth_deep");
  
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
  
  // Calculate volume when dimensions change
  useEffect(() => {
    if (length && width && depthShallow && depthDeep) {
      // Average depth calculation
      const avgDepth = (Number(depthShallow) + Number(depthDeep)) / 2;
      
      // Volume calculation in cubic meters, then converted to liters
      const volumeCubicMeters = Number(length) * Number(width) * avgDepth;
      const volumeLiters = volumeCubicMeters * 1000;
      
      // Waterline calculation (simplified assumption)
      const waterlineLM = 2 * (Number(length) + Number(width));
      
      setValue("volume_liters", volumeLiters);
      setValue("waterline_l_m", waterlineLM);
    }
  }, [length, width, depthShallow, depthDeep, setValue]);

  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (m)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Pool length" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width (m)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Pool width" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="depth_shallow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shallow Depth (m)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Shallow depth" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="depth_deep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deep Depth (m)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Deep depth" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="volume_liters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume (Liters)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Calculated automatically" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled
                />
              </FormControl>
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
                  type="number" 
                  placeholder="Calculated automatically" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Pool weight" 
                  {...field}
                  onChange={(e) => 
                    field.onChange(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </FormControl>
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
                  type="number" 
                  placeholder="Salt volume" 
                  {...field}
                  onChange={(e) => 
                    field.onChange(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="buy_price_ex_gst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy Price (Ex GST)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Price excluding GST" 
                  {...field}
                  onChange={(e) => 
                    field.onChange(e.target.value ? Number(e.target.value) : null)
                  }
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
                  type="number" 
                  placeholder="Price including GST" 
                  {...field}
                  onChange={(e) => 
                    field.onChange(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
