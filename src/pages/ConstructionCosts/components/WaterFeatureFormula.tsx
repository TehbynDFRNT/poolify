
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
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This section provides formulas and rates for water feature calculations.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Water Feature Calculation</h4>
            <p className="text-sm">Base Water Feature Price + Margin = Total</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Standard Pricing</h4>
              <ul className="text-sm space-y-2">
                <li>Small Water Feature: Base + 10% margin</li>
                <li>Medium Water Feature: Base + 15% margin</li>
                <li>Large Water Feature: Base + 20% margin</li>
              </ul>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Additional Considerations</h4>
              <ul className="text-sm space-y-2">
                <li>Installation complexity factor</li>
                <li>Material quality multiplier</li>
                <li>Seasonal adjustments</li>
              </ul>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
