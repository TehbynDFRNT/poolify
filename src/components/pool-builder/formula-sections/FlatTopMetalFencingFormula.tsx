
import React from "react";
import { Fence } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FlatTopMetalFencingFormula: React.FC = () => {
  return (
    <AccordionItem value="flat-top-metal-fencing">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Fence className="h-4 w-4" />
          <span>Flat Top Metal Fencing Formula</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            The flat top metal fencing cost is calculated based on:
          </p>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm whitespace-pre-line">
              Total Cost = 
              (Lineal Meters × $165) 
              + (Gates × $297) 
              + (Simple Retaining Panels × $220) 
              + (Complex Retaining Panels × $385) 
              + (Earthing × Lineal Meters × $150, if selected)
            </code>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Worked Example:</h4>
            <div className="pl-3 border-l-2 border-muted-foreground/20">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Inputs:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-3">
                <li>10 Lineal Meters</li>
                <li>2 Gates</li>
                <li>1 Simple Retaining Panel</li>
                <li>1 Complex Retaining Panel</li>
                <li>Earthing selected</li>
              </ul>
              
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Calculation:</strong>
              </p>
              <ul className="list-none pl-5 text-sm text-muted-foreground space-y-1 mb-3">
                <li>Fence: 10 × $165 = $1,650</li>
                <li>Gates: 2 × $297 = $594</li>
                <li>Retaining: $220 + $385 = $605</li>
                <li>Earthing: 10 × $150 = $1,500</li>
              </ul>
              
              <p className="text-sm font-medium">
                Total = $1,650 + $594 + $605 + $1,500 = $4,349
              </p>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
