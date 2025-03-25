
import { formatCurrency } from "@/utils/format";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CostDisplayProps {
  isDetailsOpen: boolean;
  costPerMeter: number;
  totalCost: number;
  onToggleDetails: () => void;
}

export const CostDisplay = ({
  isDetailsOpen,
  costPerMeter,
  totalCost,
  onToggleDetails
}: CostDisplayProps) => {
  return (
    <>
      <div>
        <Label className="flex items-center">
          Cost per meter
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 ml-1"
            onClick={onToggleDetails}
            aria-label={isDetailsOpen ? "Hide cost details" : "Show cost details"}
          >
            {isDetailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
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
