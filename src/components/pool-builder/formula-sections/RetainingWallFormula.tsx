
import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const RetainingWallFormula = () => {
  return (
    <AccordionItem value="retaining-wall">
      <AccordionTrigger>Retaining Wall Cost Calculation</AccordionTrigger>
      <AccordionContent>
        <div className="rounded-md bg-muted p-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Formula Overview:</p>
            <p className="text-sm">
              To calculate the cost of a retaining wall, we first determine the area (in square meters), 
              then multiply by the selected wall type's total rate.
            </p>
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium">Square Meters Formula:</p>
            <p className="text-sm font-mono bg-slate-100 p-2 rounded">
              Square Meters = ((Height 1 + Height 2) ÷ 2) × Length
            </p>
            <p className="text-sm mt-1">
              This calculates the average height across the length of the wall.
            </p>
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium">Total Cost Formula:</p>
            <p className="text-sm font-mono bg-slate-100 p-2 rounded">
              Total Cost = Square Meters × Total Rate
            </p>
            <p className="text-sm mt-1">
              <strong>Total Rate</strong> is pulled from the selected wall type in the pricing table.
            </p>
            <p className="text-sm">
              It includes: Rate + Extra Rate + Margin
            </p>
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium">Example:</p>
            <ul className="text-sm list-disc list-inside mb-2">
              <li>Wall Type: Block Wall – Clad</li>
              <li>Height 1: 0.4m</li>
              <li>Height 2: 1.0m</li>
              <li>Length: 5m</li>
              <li>Total Rate: $600.00</li>
            </ul>
            
            <p className="text-sm font-mono bg-slate-100 p-2 rounded">
              Square Meters = (0.4 + 1.0) ÷ 2 × 5 = 3.5 m²<br />
              Total Cost = 3.5 × $600.00 = $2,100.00
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
