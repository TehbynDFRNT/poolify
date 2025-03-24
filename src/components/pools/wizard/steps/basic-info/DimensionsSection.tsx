
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

const DimensionsSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
  
  // Format number to display with 2 decimal places
  const formatDimension = (value: number | undefined) => {
    if (value === undefined || value === null) return '';
    return value.toFixed(2);
  };

  // Handle dimension input with clean decimal format
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    
    // Allow only numbers and a single decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      field.onChange(value === '' ? '' : Number(value));
    }
  };

  return (
    <>
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
    </>
  );
};

export default DimensionsSection;
