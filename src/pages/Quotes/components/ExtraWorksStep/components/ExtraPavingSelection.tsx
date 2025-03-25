
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import { Trash } from "lucide-react";
import { PavingSelection } from "../hooks/useExtraPaving";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CostBreakdownDetails } from "./CostBreakdownDetails";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { PavingMetersInput } from "./PavingMetersInput";
import { CostDisplay } from "./CostDisplay";

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

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    onUpdate(index, { categoryId: value });
  };

  // Handle meters input change
  const handleMetersChange = (value: number) => {
    onUpdate(index, { meters: value });
  };
  
  // Toggle details section
  const handleToggleDetails = () => {
    setIsDetailsOpen(prev => !prev);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <PavingCategorySelector 
              index={index}
              selectedCategoryId={selection.categoryId}
              categories={categories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <div className="md:col-span-3">
            <PavingMetersInput
              index={index}
              meters={selection.meters}
              onMetersChange={handleMetersChange}
            />
          </div>
          
          <div className="md:col-span-2">
            <CostDisplay
              isDetailsOpen={isDetailsOpen}
              costPerMeter={costPerMeter}
              totalCost={selection.cost || 0}
              onToggleDetails={handleToggleDetails}
            />
          </div>
          
          <div className="md:col-span-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 mt-7"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="mt-4">
          <CollapsibleContent>
            <CostBreakdownDetails
              selectedCategory={selectedCategory}
              labourCostValue={labourCostValue}
              labourMarginValue={labourMarginValue}
              costPerMeter={costPerMeter}
              meters={selection.meters}
              totalCost={selection.cost || 0}
              totalMargin={selection.totalMargin || 0}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
