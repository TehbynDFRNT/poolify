import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { Pool } from "@/types/pool";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { ConcreteAndPavingCostSummary } from "./ConcreteAndPavingCostSummary";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { ExtraConcreting } from "./ExtraConcreting";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { SaveAllButton } from "./SaveAllButton";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [summaryKey, setSummaryKey] = useState<number>(0);

  const refreshSummary = useCallback(() => {
    setSummaryKey(prev => prev + 1);
  }, []);

  // Guarded save all for concrete and paving
  const {
    mutate: saveAllMutation,
    isPending: isSubmittingAll,
    StatusWarningDialog
  } = useGuardedMutation({
    projectId: customerId || '',
    mutationFn: async () => {
      // For concrete and paving, we don't have a single save operation
      // This is just to trigger the status guard warning
      // Individual components handle their own saves
      refreshSummary();
      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        toast.success("All sections refreshed successfully");
      },
      onError: (error) => {
        console.error("Error in save all:", error);
        toast.error("Failed to refresh sections");
      },
    },
  });

  const handleSaveAll = async () => {
    saveAllMutation();
  };

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

      <StatusWarningDialog />
    </div>
  );
};
