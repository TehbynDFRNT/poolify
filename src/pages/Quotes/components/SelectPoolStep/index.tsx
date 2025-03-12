
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";

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

  // Fetch additional data for the selected pool
  const { data: filtrationPackage } = useQuery({
    queryKey: ["filtration-package", selectedPool?.default_filtration_package_id],
    queryFn: async () => {
      if (!selectedPool?.default_filtration_package_id) return null;

      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          light:filtration_components!light_id (
            id, name, model_number, price
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price
          ),
          handover_kit:handover_kit_packages!handover_kit_id (
            id, 
            name,
            components:handover_kit_package_components (
              id,
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .eq('id', selectedPool.default_filtration_package_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPool?.default_filtration_package_id,
  });

  // Fetch individual costs for the selected pool
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedPoolId,
  });

  // Fetch excavation data for the selected pool
  const { data: excavationDetails } = useQuery({
    queryKey: ["pool-excavation", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `)
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.dig_type;
    },
    enabled: !!selectedPoolId,
  });

  // Fetch fixed costs
  const { data: fixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch margin data
  const { data: marginData } = useQuery({
    queryKey: ["pool-margin", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", selectedPoolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
    enabled: !!selectedPoolId,
  });

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

  // Calculate costs if we have the necessary data
  const calculateTotalCosts = () => {
    if (!selectedPool) return null;
    
    const basePrice = selectedPool.buy_price_inc_gst || 0;
    const filtrationCost = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;
    const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
    
    // Individual costs
    const individualCostsTotal = poolCosts ? Object.entries(poolCosts).reduce((sum, [key, value]) => {
      if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0) : 0;
    
    // Excavation cost
    const excavationCost = excavationDetails ? calculateGrandTotal(excavationDetails) : 0;
    
    // Calculate the grand total
    const total = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost;
    
    // Calculate margin, RRP and actual margin
    const marginPercentage = marginData || 0;
    const rrp = marginPercentage >= 100 ? 0 : total / (1 - marginPercentage / 100);
    const actualMargin = rrp - total;
    
    return {
      basePrice,
      filtrationCost,
      fixedCostsTotal,
      individualCostsTotal,
      excavationCost,
      total,
      marginPercentage,
      rrp,
      actualMargin
    };
  };

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
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Pool Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Waterline</dt>
                    <dd className="mt-1 text-sm">{selectedPool.waterline_l_m ? `${selectedPool.waterline_l_m} L/m` : 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="mt-1 text-sm">{selectedPool.weight_kg ? `${selectedPool.weight_kg} kg` : 'N/A'}</dd>
                  </div>
                </div>
              </CardContent>
            </Card>

            {costs && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Base Pool Price</span>
                      <span className="text-sm font-medium">{formatCurrency(costs.basePrice)}</span>
                    </div>
                    {filtrationPackage && (
                      <div className="flex justify-between">
                        <span className="text-sm">Filtration Package (Option {filtrationPackage.display_order})</span>
                        <span className="text-sm font-medium">{formatCurrency(costs.filtrationCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">Fixed Costs</span>
                      <span className="text-sm font-medium">{formatCurrency(costs.fixedCostsTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Individual Costs</span>
                      <span className="text-sm font-medium">{formatCurrency(costs.individualCostsTotal)}</span>
                    </div>
                    {excavationDetails && (
                      <div className="flex justify-between">
                        <span className="text-sm">Excavation ({excavationDetails.name})</span>
                        <span className="text-sm font-medium">{formatCurrency(costs.excavationCost)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-medium">Total Cost</span>
                      <span className="font-medium text-primary">{formatCurrency(costs.total)}</span>
                    </div>
                    
                    {/* Margin Information - New Section */}
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                          <div className="text-sm text-muted-foreground">Margin %</div>
                          <div className="text-sm font-medium">{costs.marginPercentage.toFixed(2)}%</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                          <div className="text-sm text-muted-foreground">RRP</div>
                          <div className="text-sm font-medium text-primary">{formatCurrency(costs.rrp)}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                          <div className="text-sm text-muted-foreground">Actual Margin</div>
                          <div className="text-sm font-medium text-primary">{formatCurrency(costs.actualMargin)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {filtrationPackage && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Filtration Package (Option {filtrationPackage.display_order})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filtrationPackage.light && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Light</dt>
                        <dd className="mt-1 text-sm">{filtrationPackage.light.name}</dd>
                        <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.light.price)}</dd>
                      </div>
                    )}
                    {filtrationPackage.pump && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pump</dt>
                        <dd className="mt-1 text-sm">{filtrationPackage.pump.name}</dd>
                        <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.pump.price)}</dd>
                      </div>
                    )}
                    {filtrationPackage.sanitiser && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Sanitiser</dt>
                        <dd className="mt-1 text-sm">{filtrationPackage.sanitiser.name}</dd>
                        <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.sanitiser.price)}</dd>
                      </div>
                    )}
                    {filtrationPackage.filter && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Filter</dt>
                        <dd className="mt-1 text-sm">{filtrationPackage.filter.name}</dd>
                        <dd className="mt-1 text-sm text-gray-500">{formatCurrency(filtrationPackage.filter.price)}</dd>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {poolCosts && Object.values(poolCosts).some(v => typeof v === 'number' && v > 0) && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Individual Pool Costs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {poolCosts.pea_gravel > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pea Gravel</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.pea_gravel)}</dd>
                      </div>
                    )}
                    {poolCosts.install_fee > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Install Fee</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.install_fee)}</dd>
                      </div>
                    )}
                    {poolCosts.trucked_water > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Trucked Water</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.trucked_water)}</dd>
                      </div>
                    )}
                    {poolCosts.salt_bags > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.salt_bags)}</dd>
                      </div>
                    )}
                    {poolCosts.coping_supply > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Coping Supply</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.coping_supply)}</dd>
                      </div>
                    )}
                    {poolCosts.beam > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Beam</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.beam)}</dd>
                      </div>
                    )}
                    {poolCosts.coping_lay > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Coping Lay</dt>
                        <dd className="mt-1 text-sm">{formatCurrency(poolCosts.coping_lay)}</dd>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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
        <Button type="submit" disabled={isSubmitting || !selectedPoolId}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};
