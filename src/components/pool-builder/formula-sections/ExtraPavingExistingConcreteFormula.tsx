
import React from "react";
import { Sparkles } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";

export const ExtraPavingExistingConcreteFormula: React.FC = () => {
  const {
    pavingOnExistingConcreteTotals,
    existingConcreteLabourCost,
    existingConcreteLabourMargin,
    existingConcreteLabourWithMargin,
    isLoadingPaving
  } = useFormulaCalculations();
  
  return (
    <AccordionItem value="extrapaving-existing-concrete">
      <AccordionTrigger className="text-md font-semibold">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Extra Paving on Existing Concrete
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-2">
        <div className="rounded-md border p-4">
          <h3 className="font-medium text-base mb-3">Extra Paving on Existing Concrete</h3>
          <p className="text-muted-foreground mb-3">
            Formula for calculating cost per meter: 
            (Paver Cost + Wastage Cost + Margin Cost) + (Labour Cost + Labour Cost × Margin %)
          </p>
          
          <div className="mb-4 bg-gray-50 p-3 rounded border">
            <h4 className="font-medium mb-2">Labour Component</h4>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span>Labour Cost:</span>
              <span className="text-right">{formatCurrency(existingConcreteLabourCost)}</span>
              
              <span>Labour Margin:</span>
              <span className="text-right">{existingConcreteLabourMargin}%</span>
              
              <span className="font-medium">Labour with Margin:</span>
              <span className="text-right font-medium">{formatCurrency(existingConcreteLabourWithMargin)}</span>
            </div>
          </div>
          
          {isLoadingPaving ? (
            <div className="text-muted-foreground">Loading paving categories...</div>
          ) : (
            <div className="space-y-4">
              {pavingOnExistingConcreteTotals.slice(0, 4).map((category, index) => (
                <div key={category.id} className="bg-gray-50 p-3 rounded border">
                  <h4 className="font-medium mb-2">Category {index + 1}</h4>
                  
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span>Paver Cost:</span>
                    <span className="text-right">{formatCurrency(category.paverCost)}</span>
                    
                    <span>Wastage Cost:</span>
                    <span className="text-right">{formatCurrency(category.wastageCost)}</span>
                    
                    <span>Margin Cost:</span>
                    <span className="text-right">{formatCurrency(category.marginCost)}</span>
                    
                    <span className="font-medium">Paving Material Subtotal:</span>
                    <span className="text-right font-medium">{formatCurrency(category.categoryTotal)}</span>
                    
                    <span>Labour with Margin:</span>
                    <span className="text-right">{formatCurrency(existingConcreteLabourWithMargin)}</span>
                    
                    <span className="font-medium border-t pt-1 mt-1">Total Cost Per Meter:</span>
                    <span className="text-right font-medium border-t pt-1 mt-1">{formatCurrency(category.totalRate)}</span>
                  </div>
                </div>
              ))}
              
              {(!pavingOnExistingConcreteTotals || pavingOnExistingConcreteTotals.length === 0) && (
                <p className="text-muted-foreground italic">No paving categories found in the system.</p>
              )}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
