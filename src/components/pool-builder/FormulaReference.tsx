
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
          <AccordionItem value="extra-paving">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Extra Paving Calculations
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              {/* Total Cost Per Selection Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Selection Cost Formula</h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    The cost for a single paving selection is calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalSelectionCost = meters × (paverCost + wastageCost + marginCost + laborCostPerMeter + concreteCostPerMeter)
                  </div>
                  <p className="text-muted-foreground mt-2">Where:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><span className="font-medium">meters</span>: Area in square meters</li>
                    <li><span className="font-medium">paverCost</span>: Base cost of the paver material per meter</li>
                    <li><span className="font-medium">wastageCost</span>: Cost of waste material per meter</li>
                    <li><span className="font-medium">marginCost</span>: Profit margin per meter</li>
                    <li><span className="font-medium">laborCostPerMeter</span>: Sum of all labor costs per meter</li>
                    <li><span className="font-medium">concreteCostPerMeter</span>: Sum of concrete material costs per meter</li>
                  </ul>
                </div>
              </div>

              {/* Material Costs Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Material Cost Formula</h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Material costs are calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalMaterialCost = meters × (paverCost + wastageCost)
                  </div>
                </div>
              </div>

              {/* Labor Costs Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4" />
                    Labor Cost Formula
                  </div>
                </h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Labor costs are calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalLaborCost = meters × (sum of all labor costs from database)
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Where labor costs include both the base labor cost and the labor margin.
                  </p>
                </div>
              </div>

              {/* Concrete Costs Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Concrete Cost Formula
                  </div>
                </h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Concrete costs are calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalConcreteCost = meters × (concrete_cost + dust_cost)
                  </div>
                </div>
              </div>

              {/* Total Margin Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Total Margin Formula</h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    The total margin across all selections is calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalMargin = sum(selections.map(selection => selection.meters × (selection.marginCost + sum(laborMargins))))
                  </div>
                  <p className="text-muted-foreground mt-2">Where:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><span className="font-medium">selection.marginCost</span>: Profit margin per meter for materials</li>
                    <li><span className="font-medium">laborMargins</span>: Sum of all labor margin costs per meter from the database</li>
                  </ul>
                </div>
              </div>

              {/* Total Cost Calculation */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Total Cost Formula</h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    The total cost across all paving selections is calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalCost = sum(calculateSelectionCost(selection) for each selection)
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="extra-concreting">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Extra Concreting Calculations
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Extra Concreting Cost Formula</h3>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Extra concreting cost is calculated as:
                  </p>
                  <div className="bg-slate-50 p-3 rounded-md border font-mono text-sm">
                    totalCost = meterage × (price + margin)
                  </div>
                  <p className="text-muted-foreground mt-2">Where:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><span className="font-medium">meterage</span>: Area in square meters</li>
                    <li><span className="font-medium">price</span>: Base price per square meter</li>
                    <li><span className="font-medium">margin</span>: Profit margin per square meter</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
