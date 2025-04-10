
import React, { useState } from "react";
import { Pool } from "@/types/pool";
import FencingSelector from "./FencingSelector";
import { FencingCostSummary } from "./components/FencingCostSummary";

interface FencingPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const FencingPlaceholder: React.FC<FencingPlaceholderProps> = ({ pool, customerId }) => {
  const [updateCounter, setUpdateCounter] = useState(0);

  // This function will be passed to children components to trigger summary refresh
  const refreshSummary = () => {
    setUpdateCounter(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <FencingSelector 
        pool={pool} 
        customerId={customerId || ""} 
        onSaveSuccess={refreshSummary}
      />
      
      {customerId && (
        <FencingCostSummary 
          customerId={customerId}
          updateCounter={updateCounter}
        />
      )}
    </div>
  );
};
