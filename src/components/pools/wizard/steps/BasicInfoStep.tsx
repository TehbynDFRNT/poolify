
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

  // Handle dimension input with clean decimal format
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    
    // Allow only numbers and a single decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      field.onChange(value === '' ? '' : Number(value));
    }
  };

  // Format number to display with 2 decimal places
  const formatDimension = (value: number | undefined) => {
    if (value === undefined || value === null) return '';
    return value.toFixed(2);
  };

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
                  type="text" 
                  inputMode="decimal"
                  placeholder="0.00" 
                  value={formatDimension(field.value)}
                  onChange={(e) => handleDimensionChange(e, field)}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                m
              </div>
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
                  type="text" 
                  inputMode="decimal"
                  placeholder="0.00" 
                  value={formatDimension(field.value)}
                  onChange={(e) => handleDimensionChange(e, field)}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                m
              </div>
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
                  type="text" 
                  inputMode="decimal"
                  placeholder="0.00" 
                  value={formatDimension(field.value)}
                  onChange={(e) => handleDimensionChange(e, field)}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                m
              </div>
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
                  type="text" 
                  inputMode="decimal"
                  placeholder="0.00" 
                  value={formatDimension(field.value)}
                  onChange={(e) => handleDimensionChange(e, field)}
                  className="text-right pr-10 relative"
                />
              </FormControl>
              <div className="absolute right-3 top-[38px] text-muted-foreground pointer-events-none">
                m
              </div>
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
    </div>
  );
};

export default BasicInfoStep;
