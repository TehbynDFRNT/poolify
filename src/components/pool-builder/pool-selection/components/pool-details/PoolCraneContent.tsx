
import React from "react";
import { Pool } from "@/types/pool";
import { useCrane } from "@/pages/Quotes/components/SelectPoolStep/hooks/useCrane";
import { Loader2 } from "lucide-react";

interface PoolCraneContentProps {
  pool: Pool;
}

export const PoolCraneContent: React.FC<PoolCraneContentProps> = ({ pool }) => {
  // Get crane data for the selected pool
  const { selectedCrane, getCraneCost } = useCrane(pool.id);
  
  if (!selectedCrane) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
        <p className="text-muted-foreground">Loading crane information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <span className="text-muted-foreground">Crane Type:</span>
          <p className="font-medium">{selectedCrane.name}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Crane Cost:</span>
          <p className="font-medium">${selectedCrane.price?.toLocaleString()}</p>
        </div>
      </div>
      
      {selectedCrane.name === "Franna Crane-S20T-L1" && (
        <div className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-md">
          <p>This is the default crane used for pool installation. Other crane options can be selected if needed.</p>
        </div>
      )}
    </div>
  );
};
