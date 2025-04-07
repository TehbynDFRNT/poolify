
import React from "react";
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
import { Calculator, Layers, HardHat, Ruler, Truck } from "lucide-react";

export const FormulaReference: React.FC = () => {
  return (
    <Card>
      <CardHeader className="bg-white pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Formula Reference</CardTitle>
        </div>
        <CardDescription>
          Documentation of formulas and calculations used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="extra-paving-concrete">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Extra Paving and Concrete
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Paving and Concrete Calculations Placeholder</h3>
                <p className="text-muted-foreground">
                  This section will contain detailed formulas for paving and concrete calculations, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Material cost calculations</li>
                  <li>Labor cost calculations</li>
                  <li>Margin calculations</li>
                  <li>Total cost formulas</li>
                  <li>Concrete volume calculations</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
