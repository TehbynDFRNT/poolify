
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PoolCleanersActionsProps {
  onAddNew: () => void;
}

export const PoolCleanersActions = ({ onAddNew }: PoolCleanersActionsProps) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onAddNew}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Cleaner
      </Button>
    </div>
  );
};
