
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PoolBlanketsActionsProps {
  onAddNew: () => void;
}

export const PoolBlanketsActions = ({ onAddNew }: PoolBlanketsActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Pool Blankets & Heat Pumps</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>Manage pool blankets, rollers and heat pump combinations for different pool models and ranges.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground mt-1">Manage blankets, rollers and heat pump combinations by pool range</p>
      </div>
      <Button
        onClick={onAddNew}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Combination
      </Button>
    </div>
  );
};
