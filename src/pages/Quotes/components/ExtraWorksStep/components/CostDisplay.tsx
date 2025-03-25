
import { formatCurrency } from "@/utils/format";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-1"
                  onClick={onToggleDetails}
                >
                  {isDetailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isDetailsOpen ? "Hide cost details" : "Show cost details"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
