
import { useState, useEffect } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PoolSelector } from "./PoolSelector";
import { PoolDetails } from "./PoolDetails";
import { CostSummary } from "./CostSummary";
import { FiltrationPackageDetails } from "./FiltrationPackageDetails";
import { IndividualPoolCosts } from "./IndividualPoolCosts";
import { ActionButtons } from "./ActionButtons";
import { usePoolSelectionData } from "../hooks/usePoolSelectionData";

interface PoolSelectionFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const PoolSelectionForm = ({ onNext, onPrevious }: PoolSelectionFormProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [selectedPoolId, setSelectedPoolId] = useState<string>(quoteData.pool_id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    pools,
    poolsByRange,
    selectedPool,
    filtrationPackage,
    poolCosts,
    excavationDetails,
    selectedCrane,
    isLoading,
    error,
    calculateTotalCosts
  } = usePoolSelectionData(selectedPoolId);

  // Check if we have a quote ID from the previous step
  useEffect(() => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the customer information step first.");
    }
  }, [quoteData.id]);

  const handlePoolSelect = (poolId: string) => {
    setSelectedPoolId(poolId);
  };

  const savePoolSelection = async (continueToNext: boolean) => {
    if (!selectedPoolId) {
      toast.error("Please select a pool to continue");
      return;
    }

    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the customer information step first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update the quote context
      updateQuoteData({ pool_id: selectedPoolId });
      
      console.log("Updating quote with ID:", quoteData.id, "with pool ID:", selectedPoolId);
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update({ pool_id: selectedPoolId })
        .eq('id', quoteData.id);
      
      if (error) {
        console.error("Error updating quote with pool:", error);
        throw error;
      }
      
      toast.success("Pool selection saved to quote");
      setIsSubmitting(false);
      if (continueToNext) onNext();
    } catch (error) {
      console.error("Error saving pool selection:", error);
      toast.error("Failed to save pool selection");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePoolSelection(true);
  };

  const handleSaveOnly = async () => {
    await savePoolSelection(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading pools...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error loading pools: {(error as Error).message}</div>;
  }

  if (!pools || pools.length === 0) {
    return <div className="text-center py-8">No pools available. Please add pools in the Pool Specifications section.</div>;
  }

  const costs = calculateTotalCosts();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <PoolSelector
          poolsByRange={poolsByRange}
          selectedPoolId={selectedPoolId}
          onSelectPool={handlePoolSelect}
        />

        {selectedPool && (
          <div className="space-y-4">
            {/* Pool Details */}
            <PoolDetails pool={selectedPool} />

            {/* Cost Summary */}
            {costs && (
              <CostSummary 
                costs={costs} 
                excavationName={excavationDetails?.name} 
                filtrationDisplayOrder={filtrationPackage?.display_order}
                craneName={selectedCrane?.name}
              />
            )}

            {/* Filtration Package Details */}
            {filtrationPackage && <FiltrationPackageDetails filtrationPackage={filtrationPackage} />}

            {/* Individual Pool Costs */}
            {poolCosts && <IndividualPoolCosts poolCosts={poolCosts} />}
          </div>
        )}
      </div>

      <ActionButtons
        onPrevious={onPrevious}
        onSave={handleSaveOnly}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDisabled={!selectedPoolId}
      />
    </form>
  );
};
