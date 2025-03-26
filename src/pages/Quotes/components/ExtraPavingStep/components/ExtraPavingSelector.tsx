
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PavingSelection } from "../types";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { AvailablePavingList } from "./AvailablePavingList";
import { PavingCostSummary } from "./PavingCostSummary";
import { PavingTotalSummary } from "./PavingTotalSummary";
import { useState } from "react";
import { CostBreakdown } from "./CostBreakdown";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import type { ConcreteCost } from "@/types/concrete-cost";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
  totalCost: number;
  totalMargin: number;
  concreteLabourCosts: ConcreteLabourCost[];
  concreteCosts?: ConcreteCost[];
}

export const ExtraPavingSelector = ({ 
  quoteId, 
  selections, 
  onAdd, 
  onUpdate, 
  onRemove, 
  totalCost,
  totalMargin,
  concreteLabourCosts,
  concreteCosts = []
}: ExtraPavingSelectorProps) => {
  const [activeSelection, setActiveSelection] = useState<PavingSelection | null>(
    selections.length > 0 ? selections[0] : null
  );
  
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  
  const handleSelectChange = (value: string) => {
    if (!value) return;
    
    // Check if this paving type is already selected
    const existingSelection = selections.find(s => s.pavingId === value);
    
    if (existingSelection) {
      // If it exists, just switch to it
      setActiveSelection(existingSelection);
    } else {
      // If it doesn't exist, add it
      onAdd(value);
    }
  };

  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSelection) return;
    
    // Get value from input
    const inputValue = e.target.value;
    
    // Convert to number (default to 0 if empty)
    let numericValue = 0;
    if (inputValue !== "") {
      numericValue = parseFloat(inputValue);
      if (isNaN(numericValue)) numericValue = 0;
    }
    
    // Update with the numeric value
    onUpdate(activeSelection.pavingId, numericValue);
  };
  
  // Get the cost per meter for the active selection
  const getCostPerMeter = () => {
    if (!activeSelection) return 0;
    
    const materialCost = activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost;
    
    const laborCost = concreteLabourCosts.reduce((total, cost) => {
      return total + cost.cost + cost.margin;
    }, 0);
    
    return materialCost + laborCost;
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h2 className="text-xl font-semibold">Extra Paving</h2>
        <p className="text-gray-500">Add additional paving to your quote</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-t mt-2 pt-4">
          <div className="flex items-center">
            <div className="text-teal-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                <rect x="10" y="10" width="4" height="4"></rect>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Extra Paving</h3>
            <div className="ml-auto text-right">
              <div className="text-sm text-green-600">
                Total Margin: ${totalMargin.toFixed(2)}
              </div>
              <div className="text-xl font-semibold">
                Total: ${totalCost.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border border-gray-200 rounded-md p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="paving-category" className="text-gray-700 font-medium">
                  Paving Category
                </Label>
                <Select
                  value={activeSelection?.pavingId || ""}
                  onValueChange={handleSelectChange}
                  disabled={isLoading || !quoteId}
                >
                  <SelectTrigger id="paving-category" className="mt-2">
                    <SelectValue placeholder="Select paving type" />
                  </SelectTrigger>
                  <SelectContent>
                    {extraPavingCosts?.map((cost) => (
                      <SelectItem key={cost.id} value={cost.id}>
                        {cost.category}
                      </SelectItem>
                    ))}
                    {!extraPavingCosts?.length && (
                      <SelectItem value="none" disabled>
                        No paving types available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="meters" className="text-gray-700 font-medium">
                  Meters
                </Label>
                <Input
                  id="meters"
                  type="number"
                  step="0.1"
                  min="0"
                  className="mt-2"
                  value={activeSelection?.meters ?? ""}
                  placeholder="Enter meters"
                  onChange={handleMetersChange}
                  disabled={!activeSelection}
                />
              </div>
              
              <div>
                <div className="flex items-baseline justify-between">
                  <Label className="text-gray-700 font-medium">
                    Cost per meter
                  </Label>
                </div>
                <div className="mt-2 text-lg font-semibold">
                  ${getCostPerMeter().toFixed(2)}
                </div>
                <div className="font-medium">
                  Total Cost
                </div>
                <div className="text-lg font-semibold">
                  ${activeSelection?.totalCost.toFixed(2) || "0.00"}
                </div>
                {activeSelection && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(activeSelection.pavingId)}
                    className="mt-2 text-red-500 hover:text-red-700 p-0 h-8 justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            
            {activeSelection && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-700 mb-4">Cost Breakdown</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h5 className="font-medium mb-2">Materials (per meter)</h5>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div>Paver Cost:</div>
                      <div className="text-right">${activeSelection.paverCost.toFixed(2)}</div>
                      
                      <div>Wastage Cost:</div>
                      <div className="text-right">${activeSelection.wastageCost.toFixed(2)}</div>
                      
                      <div>Material Margin:</div>
                      <div className="text-right text-green-600">${activeSelection.marginCost.toFixed(2)}</div>
                      
                      <div className="border-t pt-2 mt-1 font-medium">Total Material Cost (per m):</div>
                      <div className="text-right border-t pt-2 mt-1 font-medium">
                        ${(activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost).toFixed(2)}
                      </div>
                      
                      <div className="font-medium">Total Materials Cost:</div>
                      <div className="text-right font-medium">
                        ${((activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost) * activeSelection.meters).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h5 className="font-medium mb-2">Labour (per meter)</h5>
                    <div className="grid grid-cols-2 gap-y-2">
                      {concreteLabourCosts.map((cost, index) => (
                        <React.Fragment key={cost.id}>
                          <div>{cost.description}:</div>
                          <div className="text-right">${cost.cost.toFixed(2)}</div>
                          
                          <div>{cost.description} Margin:</div>
                          <div className="text-right text-green-600">${cost.margin.toFixed(2)}</div>
                        </React.Fragment>
                      ))}
                      
                      {concreteLabourCosts.length === 0 && (
                        <React.Fragment>
                          <div>Labour Cost:</div>
                          <div className="text-right">$0.00</div>
                        </React.Fragment>
                      )}
                      
                      <div className="border-t pt-2 mt-1 font-medium">Total Labour Cost (per m):</div>
                      <div className="text-right border-t pt-2 mt-1 font-medium">
                        ${concreteLabourCosts.reduce((total, cost) => total + cost.cost + cost.margin, 0).toFixed(2)}
                      </div>
                      
                      <div className="font-medium">Total Labour Cost:</div>
                      <div className="text-right font-medium">
                        ${(concreteLabourCosts.reduce((total, cost) => total + cost.cost + cost.margin, 0) * activeSelection.meters).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
