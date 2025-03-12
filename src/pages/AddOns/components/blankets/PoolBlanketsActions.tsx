
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PoolBlanketsActionsProps {
  onAddNew: () => void;
}

export const PoolBlanketsActions = ({ onAddNew }: PoolBlanketsActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Pool Blankets & Heat Pumps</h2>
        <p className="text-muted-foreground">Manage pool blankets, rollers and heat pump combinations</p>
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
