
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
          <AccordionItem value="fence-per-meter">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Fence className="h-4 w-4" />
                <span>Fence Cost Per Meter</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  The fence cost per meter is calculated based on:
                </p>
                <div className="rounded-md bg-muted p-3">
                  <code className="text-sm">
                    Total cost = Length (in meters) × Unit price
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  This base formula applies to standard fence installations.
                  Additional factors may apply for special circumstances.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="gate-cost">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Fence className="h-4 w-4" />
                <span>Gate Cost Calculation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Gate costs are calculated as a fixed unit price per gate:
                </p>
                <div className="rounded-md bg-muted p-3">
                  <code className="text-sm">
                    Total gate cost = Number of gates × Unit price per gate
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Additional customization options may affect the final gate price.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
