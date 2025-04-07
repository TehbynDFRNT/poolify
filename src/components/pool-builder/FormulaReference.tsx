
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
import { Calculator, Layers } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { formatCurrency } from "@/utils/format";

export const FormulaReference: React.FC = () => {
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  // Calculate the total concrete cost per meter
  const concreteCostPerMeter = concreteCosts?.[0]?.total_cost || 0;
  
  // Calculate the total labour cost with margin per meter
  const calculateLabourCostWithMargin = () => {
    if (!concreteLabourCosts?.length) return 0;
    
    return concreteLabourCosts.reduce((total, cost) => {
      return total + cost.cost + (cost.cost * cost.margin / 100);
    }, 0);
  };
  
  const labourCostWithMargin = calculateLabourCostWithMargin();
  
  const isLoading = isLoadingPaving || isLoadingConcrete || isLoadingLabour;

  return (
    <Card>
      <CardHeader className="bg-white pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Formulas</CardTitle>
        </div>
        <CardDescription>
          Per meter rates by paving category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="extrapaving-concrete">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Extra Paving & Concreting Formula
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              {isLoading ? (
                <div className="text-muted-foreground">Loading paving categories...</div>
              ) : (
                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-base mb-3">Per Meter Rates by Category</h3>
                  <p className="text-muted-foreground mb-3">
                    Based on current rates in the system, here are the calculated costs per meter for each paving category:
                  </p>
                  
                  <div className="space-y-4">
                    {extraPavingCosts?.map(category => {
                      const categoryTotal = category.paver_cost + category.wastage_cost + category.margin_cost;
                      const totalRate = categoryTotal + concreteCostPerMeter + labourCostWithMargin;
                      
                      return (
                        <div key={category.id} className="bg-gray-50 p-3 rounded border">
                          <h4 className="font-medium mb-2">{category.category}</h4>
                          
                          <div className="grid grid-cols-2 gap-y-1 text-sm">
                            <span>Paver Cost:</span>
                            <span className="text-right">{formatCurrency(category.paver_cost)}</span>
                            
                            <span>Wastage Cost:</span>
                            <span className="text-right">{formatCurrency(category.wastage_cost)}</span>
                            
                            <span>Margin Cost:</span>
                            <span className="text-right">{formatCurrency(category.margin_cost)}</span>
                            
                            <span className="font-medium">Paving Material Subtotal:</span>
                            <span className="text-right font-medium">{formatCurrency(categoryTotal)}</span>
                            
                            <span>Concrete Material:</span>
                            <span className="text-right">{formatCurrency(concreteCostPerMeter)}</span>
                            
                            <span>Labour with Margin:</span>
                            <span className="text-right">{formatCurrency(labourCostWithMargin)}</span>
                            
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
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
