
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface SelectPoolStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SelectPoolStep = ({ onNext, onPrevious }: SelectPoolStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { data: pools, isLoading, error } = usePoolSpecifications();
  const [selectedPoolId, setSelectedPoolId] = useState<string>(quoteData.pool_id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group pools by range for better organization in the dropdown
  const poolsByRange = pools?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, Pool[]>) || {};

  const selectedPool = pools?.find(pool => pool.id === selectedPoolId);

  const handlePoolSelect = (poolId: string) => {
    setSelectedPoolId(poolId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPoolId) {
      toast.error("Please select a pool to continue");
      return;
    }

    setIsSubmitting(true);
    
    try {
      updateQuoteData({ pool_id: selectedPoolId });
      toast.success("Pool selection saved");
      onNext();
    } catch (error) {
      toast.error("Failed to save pool selection");
      console.error("Error saving pool selection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading pools...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error loading pools: {error.message}</div>;
  }

  if (!pools || pools.length === 0) {
    return <div className="text-center py-8">No pools available. Please add pools in the Pool Specifications section.</div>;
  }

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
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Pool Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Range</dt>
                  <dd className="mt-1 text-sm">{selectedPool.range}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                  <dd className="mt-1 text-sm">{selectedPool.length}m × {selectedPool.width}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Depth</dt>
                  <dd className="mt-1 text-sm">{selectedPool.depth_shallow}m - {selectedPool.depth_deep}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Volume</dt>
                  <dd className="mt-1 text-sm">{selectedPool.volume_liters ? `${(selectedPool.volume_liters / 1000).toFixed(1)} m³` : 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
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
        <Button type="submit" disabled={isSubmitting || !selectedPoolId}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};
