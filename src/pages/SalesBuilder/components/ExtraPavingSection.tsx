
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../types";

interface ExtraPavingSectionProps {
  form: UseFormReturn<QuoteFormData>;
  isOpen: boolean;
  onToggle: () => void;
}

export const ExtraPavingSection = ({ form, isOpen, onToggle }: ExtraPavingSectionProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="bg-white p-6 rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">Extra Paving</h2>
        <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="extra_paving_needed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extra Paving Needed</FormLabel>
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
            name="paving_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paving Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="category1">Category 1</SelectItem>
                    <SelectItem value="category2">Category 2</SelectItem>
                    <SelectItem value="category3">Category 3</SelectItem>
                    <SelectItem value="category4">Category 4</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shallow_end_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width including coping at the shallow end of the pool (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter width" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deep_end_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width including coping at the deep end of the pool (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter width" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="side_one_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width including coping on one long side of the pool (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter width" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="side_two_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width including coping on the other long side of the pool (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter width" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Square Meters</h3>
            <Input type="number" readOnly value={form.watch('square_meters')} />
          </div>
          <div>
            <h3 className="font-medium mb-2">Paving Total ($)</h3>
            <Input type="number" readOnly value={form.watch('paving_total')} />
          </div>
          <div>
            <h3 className="font-medium mb-2">Laying Total ($)</h3>
            <Input type="number" readOnly value={form.watch('laying_total')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="concrete_pump_needed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concrete Pump</FormLabel>
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
            name="concrete_pump_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concrete Pump Total ($)</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="diagonal_cuts_meters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagonal Cuts (Lineal Meters)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter meters" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diagonal_cuts_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagonal Cuts Total ($)</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="round_pool_cuts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Pool Paving Cuts per 1/2 Pool</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="round_pool_cuts_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Pool Cuts Total ($)</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="under_fence_concrete_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Under Fence Concrete Strip L/M</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="under_fence_concrete_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Under Fence Concrete Total ($)</FormLabel>
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
