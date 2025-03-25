import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PavingSelection } from "../hooks/useExtraPavingQuote";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
}

export const ExtraPavingSelector = ({
  quoteId,
  selections,
  onAdd,
  onUpdate,
  onRemove
}: ExtraPavingSelectorProps) => {
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState<PavingSelection | null>(null);

  useEffect(() => {
    // Set active selection to the first one if available and none selected
    if (selections.length > 0 && !activeSelection) {
      setActiveSelection(selections[0]);
    } else if (selections.length === 0) {
      setActiveSelection(null);
    } else if (activeSelection && !selections.find(s => s.pavingId === activeSelection.pavingId)) {
      // If active selection was removed, set to first available one
      setActiveSelection(selections[0]);
    }
  }, [selections, activeSelection]);

  const calculateTotalMargin = () => {
    if (!selections.length) return 0;
    return selections.reduce((sum, sel) => {
      const materialMargin = sel.marginCost * sel.meters;
      // Assuming labor margin is 30% of material margin for this example
      const laborMargin = materialMargin * 0.3; 
      return sum + materialMargin + laborMargin;
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!selections.length) return 0;
    return selections.reduce((sum, sel) => sum + sel.totalCost, 0);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">⊞</span>
          <CardTitle className="text-lg font-medium">Extra Paving</CardTitle>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-600 font-medium">Total Margin: ${calculateTotalMargin().toFixed(2)}</div>
          <div className="text-xl font-semibold">Total: ${calculateTotalCost().toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <Label htmlFor="paving-category" className="text-gray-700 font-medium">
              Paving Category
            </Label>
            <Select
              value={activeSelection?.pavingId || ""}
              onValueChange={(value) => {
                if (value && !selections.find(s => s.pavingId === value)) {
                  onAdd(value);
                } else {
                  const selection = selections.find(s => s.pavingId === value);
                  if (selection) {
                    setActiveSelection(selection);
                  }
                }
              }}
              disabled={isLoading || !quoteId}
            >
              <SelectTrigger id="paving-category" className="mt-2">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                {extraPavingCosts?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.category}
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
          
          <div className="col-span-4">
            <Label htmlFor="meters" className="text-gray-700 font-medium">
              Meters
            </Label>
            <Input
              id="meters"
              type="number"
              className="mt-2"
              min="0"
              step="0.5"
              value={activeSelection?.meters || 0}
              onChange={(e) => {
                if (activeSelection) {
                  onUpdate(activeSelection.pavingId, parseFloat(e.target.value) || 0);
                }
              }}
              disabled={!activeSelection}
            />
          </div>
          
          <div className="col-span-3">
            <div className="flex flex-col h-full">
              <Label className="text-gray-700 font-medium">
                Cost per meter <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-1 h-6 w-6 p-0"
                  onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                >
                  {isBreakdownOpen ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </Label>
              <div className="mt-2 text-lg font-semibold">
                ${activeSelection ? ((activeSelection.totalCost || 0) / (activeSelection.meters || 1)).toFixed(2) : "0.00"}
              </div>
              <div className="mt-1 font-medium">
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
        </div>

        {isBreakdownOpen && activeSelection && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-4">Cost Breakdown</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-gray-700 font-medium mb-3">Materials (per meter)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Paver Cost:</span>
                    <span>${activeSelection.paverCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wastage Cost:</span>
                    <span>${activeSelection.wastageCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Margin:</span>
                    <span className="text-green-600">${activeSelection.marginCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Material Cost (per m):</span>
                    <span>${(activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span>Total Materials Cost:</span>
                    <span>${((activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost) * activeSelection.meters).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-gray-700 font-medium mb-3">Labour (per meter)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Labour Cost:</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Margin:</span>
                    <span className="text-green-600">$30.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Labour Cost (per m):</span>
                    <span>$130.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span>Total Labour Cost:</span>
                    <span>${(130 * activeSelection.meters).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-100 p-4 rounded-md">
              <h4 className="text-gray-700 font-medium mb-3">Total Summary</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span>Cost Per Meter:</span>
                  <span className="font-semibold">${((activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost) + 130).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Meters:</span>
                  <span className="font-semibold">{activeSelection.meters}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Margin:</span>
                  <span className="font-semibold text-green-600">${((activeSelection.marginCost + 30) * activeSelection.meters).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-semibold">${activeSelection.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selections.length > 1 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Available Paving Categories</h3>
            <div className="grid grid-cols-1 gap-2">
              {selections.map((selection) => (
                <div 
                  key={selection.pavingId}
                  className={cn(
                    "p-3 border rounded-md cursor-pointer flex justify-between",
                    activeSelection?.pavingId === selection.pavingId 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setActiveSelection(selection)}
                >
                  <div className="font-medium">{selection.pavingCategory}</div>
                  <div className="font-semibold">${selection.totalCost.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
