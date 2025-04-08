
import React from "react";
import { Fence } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";

export const UnderFenceConcreteStripsFormula: React.FC = () => {
  const { underFenceConcreteStrips, isLoading } = useUnderFenceConcreteStrips();
  
  return (
    <AccordionItem value="under-fence-concrete-strips">
      <AccordionTrigger className="text-md font-semibold">
        <div className="flex items-center gap-2">
          <Fence className="h-5 w-5 text-primary" />
          Under Fence Concrete Strips Formula
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-2">
        <div className="rounded-md border p-4">
          <h3 className="font-medium text-base mb-3">Under Fence Concrete Strips Per L/M</h3>
          <p className="text-muted-foreground mb-3">
            Formula for calculating cost per linear meter: Cost + Margin = Total Per L/M
          </p>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-muted-foreground">Loading concrete strip types...</div>
            ) : (
              underFenceConcreteStrips?.map((strip, index) => (
                <div key={strip.id} className="bg-gray-50 p-3 rounded border">
                  <h4 className="font-medium mb-2">{index + 1}. {strip.type}</h4>
                  
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span>Cost:</span>
                    <span className="text-right">{formatCurrency(strip.cost)}</span>
                    
                    <span>Margin:</span>
                    <span className="text-right">{formatCurrency(strip.margin)}</span>
                    
                    <span className="font-medium border-t pt-1 mt-1">Total Per L/M:</span>
                    <span className="text-right font-medium border-t pt-1 mt-1">
                      {formatCurrency(strip.cost)} + {formatCurrency(strip.margin)} = {formatCurrency(strip.cost + strip.margin)}
                    </span>
                  </div>
                </div>
              ))
            )}
            
            {(!underFenceConcreteStrips || underFenceConcreteStrips.length === 0) && !isLoading && (
              <p className="text-muted-foreground italic">No under fence concrete strips found in the system.</p>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
