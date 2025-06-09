import { Button } from "@/components/ui/button";
import { usePoolCleanerOptionsGuarded } from "@/hooks/usePoolCleanerOptionsGuarded";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React from "react";
import { PoolCleanerSelector } from "./PoolCleanerSelector";
import { PoolCleanersSummary } from "./PoolCleanersSummary";

interface PoolCleanersContentProps {
  pool: Pool;
  customerId: string | null;
}

export const PoolCleanersContent: React.FC<PoolCleanersContentProps> = ({
  pool,
  customerId
}) => {
  const {
    isLoading,
    availableCleaners,
    selectedCleaner,
    setSelectedCleaner,
    includeCleaner,
    setIncludeCleaner,
    isSaving,
    savePoolCleanerSelection,
    totalCost,
    margin,
    StatusWarningDialog
  } = usePoolCleanerOptionsGuarded(pool.id, customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading pool cleaner options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-6">
        Select a pool cleaner that best suits your needs. Our range of automatic pool cleaners
        help maintain your pool with minimal effort, ensuring clean and clear water.
      </p>

      <PoolCleanerSelector
        availableCleaners={availableCleaners}
        selectedCleaner={selectedCleaner}
        setSelectedCleaner={setSelectedCleaner}
        includeCleaner={includeCleaner}
        setIncludeCleaner={setIncludeCleaner}
      />

      <PoolCleanersSummary
        selectedCleaner={selectedCleaner}
        includeCleaner={includeCleaner}
        totalCost={totalCost}
      />

      {customerId && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={savePoolCleanerSelection}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSaving ? 'Saving...' : 'Save Pool Cleaner'}
          </Button>
        </div>
      )}

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </div>
  );
};
