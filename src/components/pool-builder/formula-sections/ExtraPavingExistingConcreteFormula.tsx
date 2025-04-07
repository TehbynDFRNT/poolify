
import React from "react";
import { Sparkles } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ExtraPavingExistingConcreteFormula: React.FC = () => {
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  
  // Define fixed labour values for paving on existing concrete
  const existingConcreteLabourCost = 100;
  const existingConcreteLabourMargin = 30;
  const existingConcreteLabourWithMargin = existingConcreteLabourCost + (existingConcreteLabourCost * existingConcreteLabourMargin / 100);
  
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
              {extraPavingCosts?.map((category, index) => {
                const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
                const totalRate = categoryTotal + existingConcreteLabourWithMargin;
                
                // Only show the first 4 categories (assuming they match the ones provided in the user message)
                if (index > 3) return null;
                
                return (
                  <div key={category.id} className="bg-gray-50 p-3 rounded border">
                    <h4 className="font-medium mb-2">Category {index + 1}</h4>
                    
                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                      <span>Paver Cost:</span>
                      <span className="text-right">{formatCurrency(category.paver_cost)}</span>
                      
                      <span>Wastage Cost:</span>
                      <span className="text-right">{formatCurrency(category.wastage_cost)}</span>
                      
                      <span>Margin Cost:</span>
                      <span className="text-right">{formatCurrency(category.margin_cost)}</span>
                      
                      <span className="font-medium">Paving Material Subtotal:</span>
                      <span className="text-right font-medium">{formatCurrency(categoryTotal)}</span>
                      
                      <span>Labour with Margin:</span>
                      <span className="text-right">{formatCurrency(existingConcreteLabourWithMargin)}</span>
                      
                      <span className="font-medium border-t pt-1 mt-1">Total Cost Per Meter:</span>
                      <span className="text-right font-medium border-t pt-1 mt-1">{formatCurrency(totalRate)}</span>
                    </div>
                  </div>
                );
              })}
              
              {(!extraPavingCosts || extraPavingCosts.length === 0) && (
                <p className="text-muted-foreground italic">No paving categories found in the system.</p>
              )}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
