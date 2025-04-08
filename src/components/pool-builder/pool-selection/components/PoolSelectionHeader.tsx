
import React from "react";
import { SaveAll } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PoolSelectionHeaderProps {
  customerId?: string | null;
  isSubmittingAll: boolean;
  handleSaveAll: () => Promise<void>;
  hasSelectedPool: boolean;
}

export const PoolSelectionHeader: React.FC<PoolSelectionHeaderProps> = ({
  customerId,
  isSubmittingAll,
  handleSaveAll,
  hasSelectedPool
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Pool Selection</h2>
      
      {customerId && (
        <Button 
          onClick={handleSaveAll}
          disabled={isSubmittingAll || !hasSelectedPool}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveAll className="mr-2 h-4 w-4" />
          {isSubmittingAll ? "Saving All..." : "Save All"}
        </Button>
      )}
    </div>
  );
};
