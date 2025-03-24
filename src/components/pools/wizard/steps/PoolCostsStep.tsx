
import React from "react";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import PoolCostHeader from "./pool-costs/PoolCostHeader";
import PoolCostGrid from "./pool-costs/PoolCostGrid";
import PoolCostSummary from "./pool-costs/PoolCostSummary";
import { usePoolCostsState } from "./pool-costs/usePoolCostsState";

const PoolCostsStep: React.FC = () => {
  // Make sure the pool wizard context is available
  usePoolWizard();
  
  // Use the custom hook for pool costs state management
  const { poolCosts, handleCostChange } = usePoolCostsState();
  
  return (
    <div className="space-y-6">
      <PoolCostHeader />
      <PoolCostGrid poolCosts={poolCosts} onCostChange={handleCostChange} />
      <PoolCostSummary costs={poolCosts} />
    </div>
  );
};

export default PoolCostsStep;
