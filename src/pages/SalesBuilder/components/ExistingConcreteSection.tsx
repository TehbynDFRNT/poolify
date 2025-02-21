
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../types";

interface ExistingConcreteSectionProps {
  form: UseFormReturn<QuoteFormData>;
  isOpen: boolean;
  onToggle: () => void;
}

export const ExistingConcreteSection = ({ form, isOpen, onToggle }: ExistingConcreteSectionProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="bg-white p-6 rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">🧱 Extra Paving on Existing Concrete</h2>
        <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="modification_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modification Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="resurfacing">Resurfacing</SelectItem>
                    <SelectItem value="removal">Removal</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additional_concrete_work"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Concrete Work</FormLabel>
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
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
