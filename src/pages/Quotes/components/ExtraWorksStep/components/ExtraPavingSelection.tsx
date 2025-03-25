
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import { Trash, ChevronDown, ChevronUp } from "lucide-react";
import { PavingSelection } from "../hooks/useExtraPaving";
import { formatCurrency } from "@/utils/format";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExtraPavingSelectionProps {
  selection: PavingSelection;
  index: number;
  categories: ExtraPavingCost[];
  labourCosts?: ConcreteLabourCost[];
  onUpdate: (index: number, updates: Partial<PavingSelection>) => void;
  onRemove: (index: number) => void;
}

export const ExtraPavingSelection = ({
  selection,
  index,
  categories,
  labourCosts = [],
  onUpdate,
  onRemove
}: ExtraPavingSelectionProps) => {
  // Find the selected category
  const selectedCategory = categories.find(cat => cat.id === selection.categoryId);
  
  // Get default labor cost (first one in the list)
  const defaultLabourCost = labourCosts && labourCosts.length > 0 ? labourCosts[0] : null;
  const labourCostValue = defaultLabourCost ? defaultLabourCost.cost : 0;
  const labourMarginValue = defaultLabourCost ? defaultLabourCost.margin : 0;
  
  // Calculate material cost per meter
  const materialCostPerMeter = selectedCategory
    ? selectedCategory.paver_cost + selectedCategory.wastage_cost + selectedCategory.margin_cost
    : 0;
    
  // Calculate total cost per meter including labor
  const costPerMeter = materialCostPerMeter + labourCostValue + labourMarginValue;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [metersValue, setMetersValue] = useState(selection.meters.toString());

  // Update the actual selection when input is committed
  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetersValue(e.target.value);
  };

  const handleMetersBlur = () => {
    const value = parseFloat(metersValue);
    if (!isNaN(value)) {
      onUpdate(index, { meters: value });
    } else {
      // Reset to the current value if invalid input
      setMetersValue(selection.meters.toString());
    }
  };

  // Synchronize the input value with selection when it changes from outside
  useEffect(() => {
    setMetersValue(selection.meters.toString());
  }, [selection.meters]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Label htmlFor={`paving-category-${index}`}>Paving Category</Label>
            <Select
              value={selection.categoryId}
              onValueChange={(value) => onUpdate(index, { categoryId: value })}
            >
              <SelectTrigger id={`paving-category-${index}`} className="mt-1">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3">
            <Label htmlFor={`paving-meters-${index}`}>Meters</Label>
            <Input
              id={`paving-meters-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={metersValue}
              onChange={handleMetersChange}
              onBlur={handleMetersBlur}
              className="mt-1"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label className="flex items-center">
              Cost per meter
              <Collapsible 
                open={isDetailsOpen} 
                onOpenChange={setIsDetailsOpen}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                    {isDetailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </Label>
            <div className="mt-2 font-medium">{formatCurrency(costPerMeter)}</div>
          </div>
          
          <div className="md:col-span-2">
            <Label>Total Cost</Label>
            <div className="mt-2 font-bold">{formatCurrency(selection.cost)}</div>
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <Collapsible open={isDetailsOpen} className="mt-4">
          <CollapsibleContent>
            <div className="bg-muted/30 p-3 rounded-md border">
              <h4 className="text-sm font-semibold mb-2">Cost Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Per Meter</p>
                  <div className="flex justify-between">
                    <span>Paver Cost:</span>
                    <span>{formatCurrency(selectedCategory?.paver_cost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wastage Cost:</span>
                    <span>{formatCurrency(selectedCategory?.wastage_cost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span>{formatCurrency(selectedCategory?.margin_cost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Cost:</span>
                    <span>{formatCurrency(labourCostValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Margin:</span>
                    <span>{formatCurrency(labourMarginValue)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-medium">
                    <span>Total Per Meter:</span>
                    <span>{formatCurrency(costPerMeter)}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total ({selection.meters} meters)</p>
                  <div className="flex justify-between">
                    <span>Paver Cost:</span>
                    <span>{formatCurrency((selectedCategory?.paver_cost || 0) * selection.meters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wastage Cost:</span>
                    <span>{formatCurrency((selectedCategory?.wastage_cost || 0) * selection.meters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span>{formatCurrency((selectedCategory?.margin_cost || 0) * selection.meters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Cost:</span>
                    <span>{formatCurrency(labourCostValue * selection.meters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Margin:</span>
                    <span>{formatCurrency(labourMarginValue * selection.meters)}</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Total Margin:</span>
                    <span>{formatCurrency(selection.totalMargin || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-medium">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(selection.cost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
