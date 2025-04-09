
import React, { useState } from "react";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { ExtraConcreting } from "./ExtraConcreting";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcreteAndPavingCostSummary } from "./ConcreteAndPavingCostSummary";
import { SaveAllButton } from "./SaveAllButton";
import { useSaveAll } from "@/components/pool-builder/pool-selection/hooks/useSaveAll";
import { Pool } from "@/types/pool";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const { isSubmittingAll, handleSaveAll } = useSaveAll(customerId, async () => {
    // In a real implementation, this would save all sections
    // For now, we'll just use the stub function from useSaveAll
    return Promise.resolve();
  });

  return (
    <div className="space-y-6">
      <ExtraPavingConcrete pool={pool} customerId={customerId} />
      <PavingOnExistingConcrete pool={pool} customerId={customerId} />
      <ExtraConcreting pool={pool} customerId={customerId} />
      <ConcretePumpSelector pool={pool} customerId={customerId} />
      <UnderFenceConcreteStrips pool={pool} customerId={customerId} />
      <ConcreteCuts pool={pool} customerId={customerId} />
      <ConcreteAndPavingCostSummary pool={pool} customerId={customerId} />
      
      <div className="flex justify-end mt-8">
        <SaveAllButton 
          onSaveAll={handleSaveAll} 
          isSubmitting={isSubmittingAll}
        />
      </div>
    </div>
  );
};
