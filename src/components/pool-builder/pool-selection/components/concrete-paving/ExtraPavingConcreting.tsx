
import React, { useState, useCallback } from "react";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { ExtraConcreting } from "./ExtraConcreting";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcreteAndPavingCostSummary } from "./ConcreteAndPavingCostSummary";
import { SaveAllButton } from "./SaveAllButton";
import { useSaveAll } from "@/components/pool-builder/pool-selection/hooks/useSaveAll";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import { Pool } from "@/types/pool";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [summaryKey, setSummaryKey] = useState<number>(0);
  
  const refreshSummary = useCallback(() => {
    setSummaryKey(prev => prev + 1);
  }, []);
  
  const { isSubmittingAll, handleSaveAll } = useSaveAll(customerId, async () => {
    // In a real implementation, this would save all sections
    // and refresh the summary afterward
    refreshSummary();
    return Promise.resolve();
  });

  return (
    <div className="space-y-6">
      <ExtraPavingConcrete 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <PavingOnExistingConcrete 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <ExtraConcreting 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <ConcretePumpSelector 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <UnderFenceConcreteStrips 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <ConcreteCuts 
        pool={pool} 
        customerId={customerId} 
        onSaveComplete={refreshSummary}
      />
      <ConcreteAndPavingCostSummary 
        key={summaryKey} 
        pool={pool} 
        customerId={customerId}
      />
      <FormulaReference />
      
      <div className="flex justify-end mt-8">
        <SaveAllButton 
          onSaveAll={handleSaveAll} 
          isSubmitting={isSubmittingAll}
        />
      </div>
    </div>
  );
};
