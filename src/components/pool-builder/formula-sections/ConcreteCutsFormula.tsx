
import React from "react";
import { Scissors } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ConcreteCutsFormula: React.FC = () => {
  // Fixed cut types pricing
  const fixedCutTypes = [
    { name: "1/4 Pool", price: 320.00 },
    { name: "1/2 Pool", price: 640.00 },
    { name: "3/4 Pool", price: 960.00 },
    { name: "Full Pool", price: 1280.00 }
  ];
  
  // Variable cut type
  const diagonalCutPrice = 50.00;
  
  return (
    <AccordionItem value="concrete-cuts">
      <AccordionTrigger className="text-md font-semibold">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          Concrete Cuts Formula
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-2">
        <div className="rounded-md border p-4">
          <h3 className="font-medium text-base mb-3">Concrete Cuts Pricing</h3>
          
          <div className="space-y-5">
            <div>
              <h4 className="font-medium mb-2">Fixed Cut Types</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm mb-3">
                  For fixed cut types, the formula is straightforward:
                  <span className="block mt-1 font-medium">Total Cost = Fixed Price</span>
                </p>
                
                <div className="space-y-3">
                  {fixedCutTypes.map((cut, index) => (
                    <div key={index} className="grid grid-cols-2 gap-y-1 text-sm">
                      <span>{cut.name}:</span>
                      <span className="text-right">{formatCurrency(cut.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Variable Cut Type</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm mb-3">
                  For variable cut types, the formula is:
                  <span className="block mt-1 font-medium">Total Cost = Unit Price × Quantity</span>
                </p>
                
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span>Diagonal Cuts (per unit):</span>
                  <span className="text-right">{formatCurrency(diagonalCutPrice)}</span>
                  
                  <span className="font-medium mt-2">Formula Example:</span>
                  <span className="text-right mt-2">
                    <div className="text-sm">
                      {formatCurrency(diagonalCutPrice)} × 3 units = {formatCurrency(diagonalCutPrice * 3)}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
