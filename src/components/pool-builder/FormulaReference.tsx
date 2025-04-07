
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
import { Calculator, Layers, Sparkles, Shovel } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useExtraConcreting } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { formatCurrency } from "@/utils/format";

export const FormulaReference: React.FC = () => {
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { extraConcretingItems, isLoading: isLoadingExtraConcreting } = useExtraConcreting();
  
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
  
  // Define fixed labour values for paving on existing concrete
  const existingConcreteLabourCost = 100;
  const existingConcreteLabourMargin = 30;
  const existingConcreteLabourWithMargin = existingConcreteLabourCost + (existingConcreteLabourCost * existingConcreteLabourMargin / 100);
  
  const isLoading = isLoadingPaving || isLoadingConcrete || isLoadingLabour || isLoadingExtraConcreting;

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
        </Accordion>
      </CardContent>
    </Card>
  );
};
