
import { formatCurrency } from "@/utils/format";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

interface CostDisplayProps {
  isDetailsOpen: boolean;
  costPerMeter: number;
  totalCost: number;
}

export const CostDisplay = ({
  isDetailsOpen,
  costPerMeter,
  totalCost
}: CostDisplayProps) => {
  return (
    <>
      <div>
        <Label className="flex items-center">
          Cost per meter
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
              {isDetailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
        </Label>
        <div className="mt-2 font-medium">{formatCurrency(costPerMeter)}</div>
      </div>
      
      <div>
        <Label>Total Cost</Label>
        <div className="mt-2 font-bold">{formatCurrency(totalCost)}</div>
      </div>
    </>
  );
};
