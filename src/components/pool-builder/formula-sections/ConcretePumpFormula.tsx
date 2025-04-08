
import React from "react";
import { Truck } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";

export const ConcretePumpFormula: React.FC = () => {
  const { concretePump, isLoading } = useConcretePump();
  
  // Default rate if data is not loaded yet
  const pumpRate = concretePump ? concretePump.price : 1050.00;
  
  return (
    <AccordionItem value="concrete-pump">
      <AccordionTrigger className="text-md font-semibold">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Concrete Pump Formula
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-2">
        <div className="rounded-md border p-4">
          <h3 className="font-medium text-base mb-3">Concrete Pump – Calculation Logic</h3>
          
          <div className="space-y-5">
            <div>
              <h4 className="font-medium mb-2">Formula</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm mb-3 font-medium">
                  Total Cost = Unit Price × Quantity
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Base Rate</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span>Standard Pump Cost (per use/day):</span>
                    <span className="text-right">{formatCurrency(pumpRate)}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground pt-2 border-t mt-1">
                    This represents the cost of a single pump setup/service, typically per day or per concrete pour.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Example Calculation</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <div className="space-y-2 text-sm">
                  <p>For a project requiring 2 days of concrete pumping:</p>
                  <div className="font-medium">
                    {formatCurrency(pumpRate)} × 2 days = {formatCurrency(pumpRate * 2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
