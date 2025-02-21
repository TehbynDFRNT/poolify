
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../types";

interface RetainingWallsSectionProps {
  form: UseFormReturn<QuoteFormData>;
  isOpen: boolean;
  onToggle: () => void;
}

export const RetainingWallsSection = ({ form, isOpen, onToggle }: RetainingWallsSectionProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="bg-white p-6 rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">🧱 Retaining Walls</h2>
        <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="wall_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wall Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter wall type" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wall_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wall Length (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter wall length" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
