
import React from "react";
import { Pool } from "@/types/pool";
import { usePoolCleanerOptions } from "@/hooks/usePoolCleanerOptions";
import { PoolCleanerSelector } from "./PoolCleanerSelector";
import { PoolCleanersSummary } from "./PoolCleanersSummary";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    margin
  } = usePoolCleanerOptions(pool.id, customerId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading pool cleaner options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Pool cleaners help maintain your pool by automatically removing debris and keeping the water clean.
          Select from our range of quality pool cleaners below.
        </p>
      </div>

      {/* Pool Cleaner Selector */}
      <PoolCleanerSelector
        availableCleaners={availableCleaners}
        selectedCleaner={selectedCleaner}
        setSelectedCleaner={setSelectedCleaner}
        includeCleaner={includeCleaner}
        setIncludeCleaner={setIncludeCleaner}
      />

      {/* Cost Summary */}
      <PoolCleanersSummary
        selectedCleaner={selectedCleaner}
        includeCleaner={includeCleaner}
        totalCost={totalCost}
      />

      {/* Save Button */}
      {customerId && (
        <div className="flex justify-end mt-6">
          <Button 
            onClick={savePoolCleanerSelection} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Pool Cleaner Selection
          </Button>
        </div>
      )}
    </div>
  );
};
