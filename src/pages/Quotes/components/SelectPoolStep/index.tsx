
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { usePoolSelectionData } from "./hooks/usePoolSelectionData";
import { PoolDetails } from "./components/PoolDetails";
import { CostSummary } from "./components/CostSummary";
import { FiltrationPackageDetails } from "./components/FiltrationPackageDetails";
import { IndividualPoolCosts } from "./components/IndividualPoolCosts";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface SelectPoolStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SelectPoolStep = ({ onNext, onPrevious }: SelectPoolStepProps) => {
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
      // Calculate costs
      const costs = calculateTotalCosts();
      const basePoolCost = costs ? costs.basePrice : 0;
      const rrp = costs ? costs.rrp : 0;
      
      // Update the quote context
      updateQuoteData({ 
        pool_id: selectedPoolId,
        base_pool_cost: basePoolCost,
        rrp: rrp  // Store the RRP value
      });
      
      console.log("Updating quote with ID:", quoteData.id, "with pool ID:", selectedPoolId, "RRP:", rrp);
      
      // Update the record in Supabase - now we save both base_pool_cost and rrp
      const { error } = await supabase
        .from('quotes')
        .update({ 
          pool_id: selectedPoolId,
          base_pool_cost: basePoolCost,
          rrp: rrp  // Store the RRP in the database
        })
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
        <div className="space-y-2">
          <Label htmlFor="pool-select">Select a Pool Model</Label>
          <Select
            value={selectedPoolId}
            onValueChange={handlePoolSelect}
          >
            <SelectTrigger id="pool-select" className="w-full">
              <SelectValue placeholder="Select a pool" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(poolsByRange).map(([range, poolsInRange]) => (
                <div key={range} className="py-2">
                  <div className="px-2 text-sm font-medium text-gray-500">{range}</div>
                  {poolsInRange.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.name} ({pool.length}m × {pool.width}m)
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              />
            )}

            {/* Filtration Package Details */}
            {filtrationPackage && <FiltrationPackageDetails filtrationPackage={filtrationPackage} />}

            {/* Individual Pool Costs */}
            {poolCosts && <IndividualPoolCosts poolCosts={poolCosts} />}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveOnly}
            disabled={isSubmitting || !selectedPoolId}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedPoolId}>
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
};
