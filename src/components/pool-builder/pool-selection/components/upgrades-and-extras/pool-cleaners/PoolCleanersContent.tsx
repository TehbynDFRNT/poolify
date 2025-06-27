import { Button } from "@/components/ui/button";
import { usePoolCleanerOptionsGuarded } from "@/hooks/usePoolCleanerOptionsGuarded";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { PoolCleanerSelector } from "./PoolCleanerSelector";
import { PoolCleanersSummary } from "./PoolCleanersSummary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface PoolCleanersContentProps {
  pool: Pool;
  customerId: string | null;
}

export const PoolCleanersContent: React.FC<PoolCleanersContentProps> = ({
  pool,
  customerId
}) => {
  const queryClient = useQueryClient();
  
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

  // Auto-save effect with direct Supabase calls
  useEffect(() => {
    if (!customerId || !pool.id || isLoading || !availableCleaners) return;

    const timer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-saving pool cleaner selection...');
        
        if (includeCleaner && selectedCleaner) {
          // Upsert the pool cleaner selection
          await supabase
            .from('pool_cleaner_selections')
            .upsert({
              customer_id: customerId,
              pool_id: pool.id,
              pool_cleaner_id: selectedCleaner.id,
              include_cleaner: true
            });
        } else {
          // Nothing selected - delete any existing record
          await supabase
            .from('pool_cleaner_selections')
            .delete()
            .eq('customer_id', customerId)
            .eq('pool_id', pool.id);
        }

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['pool-cleaner-selection', customerId] });
        console.log('✅ Pool cleaner selection auto-saved successfully');
      } catch (error) {
        console.error("Error auto-saving pool cleaner selection:", error);
        toast.error("Failed to auto-save pool cleaner selection");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    includeCleaner,
    selectedCleaner?.id,
    customerId,
    pool.id,
    availableCleaners?.length
  ]);

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

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </div>
  );
};
