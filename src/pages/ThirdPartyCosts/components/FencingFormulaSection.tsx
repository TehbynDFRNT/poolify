
import React from "react";
import { Fence, Calculator } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const FencingFormulaSection: React.FC = () => {
  return (
    <Card className="mt-8">
      <CardHeader className="bg-white pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Fencing Formulas</CardTitle>
        </div>
        <CardDescription>
          Reference for calculations and pricing formulas
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="frameless-glass">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Fence className="h-4 w-4" />
                <span>Frameless Glass Fencing Formula</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  The frameless glass fencing cost is calculated based on:
                </p>
                <div className="rounded-md bg-muted p-3">
                  <code className="text-sm whitespace-pre-line">
                    Total Cost = 
                    (Lineal Meters × Fence Price per Meter) 
                    + (Number of Gates × $495) 
                    − $495 for 1 Free Gate 
                    + Earthing (optional @ $40 total)
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
                      <li>2 Frameless Glass Gates</li>
                      <li>1 Free Gate included</li>
                      <li>Earthing selected</li>
                    </ul>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Calculation:</strong>
                    </p>
                    <ul className="list-none pl-5 text-sm text-muted-foreground space-y-1 mb-3">
                      <li>Fence: 10 × $396 = $3,960</li>
                      <li>Gates: 2 × $495 = $990</li>
                      <li>Free Gate: −$495</li>
                      <li>Earthing: $40</li>
                    </ul>
                    
                    <p className="text-sm font-medium">
                      Total = $3,960 + $990 − $495 + $40 = $4,495
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
