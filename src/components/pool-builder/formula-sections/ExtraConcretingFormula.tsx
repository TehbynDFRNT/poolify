
import React from "react";
import { Shovel } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ExtraConcretingFormula: React.FC = () => {
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
            {/* Cover Crete */}
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-medium mb-3">Cover Crete</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                <span>Base Price:</span>
                <span className="text-right">{formatCurrency(236)}</span>
                
                <span>Margin:</span>
                <span className="text-right">{formatCurrency(89)}</span>
                
                <span className="font-medium">Total Per m²:</span>
                <span className="text-right font-medium">{formatCurrency(325)}</span>
              </div>
              
              <div className="text-sm pt-2 border-t">
                <span className="font-medium">Formula:</span>
                <div className="mt-1">{formatCurrency(236)} + {formatCurrency(89)} = {formatCurrency(325)}</div>
              </div>
            </div>
            
            {/* Exposed Aggregate */}
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-medium mb-3">Exposed Aggregate</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                <span>Base Price:</span>
                <span className="text-right">{formatCurrency(125)}</span>
                
                <span>Margin:</span>
                <span className="text-right">{formatCurrency(40)}</span>
                
                <span className="font-medium">Total Per m²:</span>
                <span className="text-right font-medium">{formatCurrency(165)}</span>
              </div>
              
              <div className="text-sm pt-2 border-t">
                <span className="font-medium">Formula:</span>
                <div className="mt-1">{formatCurrency(125)} + {formatCurrency(40)} = {formatCurrency(165)}</div>
              </div>
            </div>
            
            {/* Standard */}
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-medium mb-3">Standard</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                <span>Base Price:</span>
                <span className="text-right">{formatCurrency(93)}</span>
                
                <span>Margin:</span>
                <span className="text-right">{formatCurrency(42)}</span>
                
                <span className="font-medium">Total Per m²:</span>
                <span className="text-right font-medium">{formatCurrency(135)}</span>
              </div>
              
              <div className="text-sm pt-2 border-t">
                <span className="font-medium">Formula:</span>
                <div className="mt-1">{formatCurrency(93)} + {formatCurrency(42)} = {formatCurrency(135)}</div>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
