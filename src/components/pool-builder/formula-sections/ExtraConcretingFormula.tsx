
import React from "react";
import { Shovel } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";

export const ExtraConcretingFormula: React.FC = () => {
  const { extraConcretingTotals } = useFormulaCalculations();
  
  return (
    <AccordionItem value="extra-concreting">
      <AccordionTrigger className="text-md font-semibold">
        <div className="flex items-center gap-2">
          <Shovel className="h-5 w-5 text-primary" />
          Extra Concreting Formula
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-2">
        <div className="rounded-md border p-4">
          <h3 className="font-medium text-base mb-3">Extra Concreting Formula</h3>
          <p className="text-muted-foreground mb-3">
            Per Meter Rates by Type
          </p>
          <p className="text-muted-foreground mb-3">
            Based on current rates in the system, here are the calculated costs per square meter for each concrete type:
          </p>
          
          <div className="space-y-6">
            {extraConcretingTotals.map(item => (
              <div key={item.id} className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-3">{item.type}</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                  <span>Base Price:</span>
                  <span className="text-right">{formatCurrency(item.price)}</span>
                  
                  <span>Margin:</span>
                  <span className="text-right">{formatCurrency(item.margin)}</span>
                  
                  <span className="font-medium">Total Per m²:</span>
                  <span className="text-right font-medium">{formatCurrency(item.totalCost)}</span>
                </div>
                
                <div className="text-sm pt-2 border-t">
                  <span className="font-medium">Formula:</span>
                  <div className="mt-1">
                    {formatCurrency(item.price)} + {formatCurrency(item.margin)} = {formatCurrency(item.totalCost)}
                  </div>
                </div>
              </div>
            ))}
            
            {(!extraConcretingTotals || extraConcretingTotals.length === 0) && (
              <p className="text-muted-foreground italic">No extra concreting types found in the system.</p>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
