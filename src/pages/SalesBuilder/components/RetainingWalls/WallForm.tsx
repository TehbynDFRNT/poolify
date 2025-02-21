
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../../types";
import { useState } from "react";

interface WallFormProps {
  wallNumber: 1 | 2 | 3 | 4;
  form: UseFormReturn<QuoteFormData>;
}

export const WallForm = ({ wallNumber, form }: WallFormProps) => {
  const [isWallOpen, setIsWallOpen] = useState(false);
  const baseFieldName = `retaining_walls.wall_${wallNumber}` as const;

  return (
    <Collapsible open={isWallOpen} onOpenChange={setIsWallOpen} className="border rounded-md p-4 mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">Retaining Wall {wallNumber}</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isWallOpen ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${baseFieldName}.needed` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Needed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select yes/no" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.wall_type` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wall Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="drop_edge_clad">Drop Edge - Clad</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.cladding_style` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cladding Style</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cladding style" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.paint_color` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paint Colour</FormLabel>
                <FormControl>
                  <Input placeholder="Enter paint colour" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.height_1` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height 1 (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter height 1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.height_2` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height 2 (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter height 2" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.length` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter length" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.square_meters` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Square Meters</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${baseFieldName}.total` as const}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Wall Total ($)</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
