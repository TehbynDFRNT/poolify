
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PoolBlanketsActionsProps {
  onAddNew: () => void;
}

export const PoolBlanketsActions = ({ onAddNew }: PoolBlanketsActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Pool Blankets & Heat Pumps</h2>
      <Button
        onClick={onAddNew}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Blanket
      </Button>
    </div>
  );
};
