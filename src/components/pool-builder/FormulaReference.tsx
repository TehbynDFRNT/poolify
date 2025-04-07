
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
import { Calculator, Layers, HardHat } from "lucide-react";
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
          Documentation of formulas used for paving and concrete calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="extrapaving-concrete">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Extra Paving and Concrete Formula
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Extra Paving Cost Calculation</h3>
                <p className="text-muted-foreground mb-2">
                  The total cost for extra paving is calculated as follows:
                </p>
                <div className="bg-gray-50 p-3 rounded border mb-2">
                  <p className="font-mono">Total Cost = Paver Cost + Wastage Cost + Margin Cost</p>
                </div>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Paver Cost: Base cost of the paving material</li>
                  <li>Wastage Cost: Additional cost to account for material wastage</li>
                  <li>Margin Cost: Profit margin added to the material costs</li>
                </ul>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Concrete Labour Cost Calculation</h3>
                <p className="text-muted-foreground mb-2">
                  The total cost for concrete labour is calculated as follows:
                </p>
                <div className="bg-gray-50 p-3 rounded border mb-2">
                  <p className="font-mono">Total Cost = Base Cost + (Base Cost × Margin / 100)</p>
                </div>
                <p className="text-muted-foreground">
                  Example: If Base Cost is $100 and Margin is 30%, then:<br />
                  Total Cost = $100 + ($100 × 30 / 100) = $100 + $30 = $130
                </p>
              </div>
              
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
          
          <AccordionItem value="concrete-labour">
            <AccordionTrigger className="text-md font-semibold">
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-primary" />
                Concrete Labour Cost Formula
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-base mb-2">Calculating Labour Costs with Margin</h3>
                <p className="text-muted-foreground mb-2">
                  Labour costs are calculated by adding a percentage margin to the base cost:
                </p>
                <div className="bg-gray-50 p-3 rounded border mb-3">
                  <p className="font-mono">Total Cost = Base Cost + (Base Cost × Margin Percentage / 100)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Example:</p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Base Labour Cost: $100.00</li>
                    <li>Margin: 30%</li>
                    <li>Calculation: $100 + ($100 × 30/100) = $100 + $30 = $130</li>
                    <li>Total Cost: $130.00</li>
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
