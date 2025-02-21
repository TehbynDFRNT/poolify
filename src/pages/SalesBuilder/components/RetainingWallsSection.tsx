
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormData } from "../types";
import { WallForm } from "./RetainingWalls/WallForm";
import { ConcretePumpSection } from "./RetainingWalls/ConcretePumpSection";

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
      <CollapsibleContent className="pt-4 space-y-4">
        <WallForm wallNumber={1} form={form} />
        <WallForm wallNumber={2} form={form} />
        <WallForm wallNumber={3} form={form} />
        <WallForm wallNumber={4} form={form} />
        <ConcretePumpSection form={form} />
      </CollapsibleContent>
    </Collapsible>
  );
};
