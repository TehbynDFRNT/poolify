
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../../types";

interface ConcretePumpSectionProps {
  form: UseFormReturn<QuoteFormData>;
}

export const ConcretePumpSection = ({ form }: ConcretePumpSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
      <FormField
        control={form.control}
        name="retaining_walls.concrete_pump_needed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Pump Needed</FormLabel>
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
        name="retaining_walls.concrete_pump_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Pump Price ($)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter pump price" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
