
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Droplets } from "lucide-react";

export const WaterFeatureFormula = () => {
  return (
    <AccordionItem value="water-feature-formula">
      <AccordionTrigger className="text-left font-medium">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          <span>Water Feature Formula</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground text-sm">
            Placeholder for water feature formula. No data available yet.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
