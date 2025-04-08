
import React from "react";
import { Pool } from "@/types/pool";
import { useExcavation } from "@/pages/Quotes/components/SelectPoolStep/hooks/useExcavation";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface PoolExcavationContentProps {
  pool: Pool;
}

export const PoolExcavationContent: React.FC<PoolExcavationContentProps> = ({ pool }) => {
  // Get excavation data for the selected pool
  const { excavationDetails, getExcavationCost } = useExcavation(pool.id);
  
  if (!excavationDetails) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
        <p className="text-muted-foreground">Loading excavation information...</p>
      </div>
    );
  }

  const excavationCost = getExcavationCost();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <span className="text-muted-foreground">Dig Type:</span>
          <p className="font-medium">{excavationDetails.name}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Excavation Cost:</span>
          <p className="font-medium">{formatCurrency(excavationCost)}</p>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs text-muted-foreground">Excavation:</span>
          <p>{excavationDetails.excavation_hours} hrs @ {formatCurrency(excavationDetails.excavation_hourly_rate)}/hr</p>
        </div>
        <div>
          <span className="block text-xs text-muted-foreground">Trucks:</span>
          <p>{excavationDetails.truck_quantity} × {excavationDetails.truck_hours} hrs @ {formatCurrency(excavationDetails.truck_hourly_rate)}/hr</p>
        </div>
      </div>
    </div>
  );
};
