
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePools } from "@/hooks/usePools";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PoolSelectionSectionProps {
  customerId?: string | null;
}

const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({ customerId }) => {
  const { data: pools, isLoading, error } = usePools();
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Group pools by range for better organization
  const poolsByRange = React.useMemo(() => {
    if (!pools) return {};
    
    return pools.reduce((acc, pool) => {
      if (!acc[pool.range]) {
        acc[pool.range] = [];
      }
      acc[pool.range].push(pool);
      return acc;
    }, {} as Record<string, any[]>);
  }, [pools]);

  const handleSavePoolSelection = async () => {
    if (!customerId || !selectedPoolId) {
      toast({
        title: "Selection Required",
        description: "Please select a pool model first.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the customer record with the selected pool
      const { error } = await supabase
        .from('pool_projects')
        .update({ pool_id: selectedPoolId })
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Pool selection saved successfully",
      });
    } catch (error) {
      console.error("Error saving pool selection:", error);
      toast({
        title: "Error",
        description: "Failed to save pool selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pool Selection</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select a Pool Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading pool models...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md">
              <p className="text-destructive">Failed to load pools. Please try again.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="pool-select">Pool Model</Label>
                <Select
                  value={selectedPoolId}
                  onValueChange={setSelectedPoolId}
                >
                  <SelectTrigger id="pool-select" className="w-full">
                    <SelectValue placeholder="Select a pool model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(poolsByRange).length === 0 ? (
                      <SelectItem value="no-pools" disabled>
                        No pools available
                      </SelectItem>
                    ) : (
                      Object.entries(poolsByRange).map(([range, poolsInRange]) => (
                        <div key={range} className="py-2">
                          <div className="px-2 text-sm font-medium text-gray-500">{range}</div>
                          {poolsInRange.map((pool) => (
                            <SelectItem key={pool.id} value={pool.id}>
                              {pool.name} ({pool.length}m × {pool.width}m)
                            </SelectItem>
                          ))}
                        </div>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedPoolId && (
                <div className="bg-primary/10 p-4 rounded-md mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Selected Pool</h3>
                  </div>
                  
                  <div className="mb-4">
                    {pools && pools.find(p => p.id === selectedPoolId) && (
                      <div className="space-y-2">
                        <p className="font-medium">{pools.find(p => p.id === selectedPoolId)?.name}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dimensions: </span>
                            {pools.find(p => p.id === selectedPoolId)?.length}m × {pools.find(p => p.id === selectedPoolId)?.width}m
                          </div>
                          <div>
                            <span className="text-muted-foreground">Depth: </span>
                            {pools.find(p => p.id === selectedPoolId)?.depth_shallow}m - {pools.find(p => p.id === selectedPoolId)?.depth_deep}m
                          </div>
                          <div>
                            <span className="text-muted-foreground">Volume: </span>
                            {pools.find(p => p.id === selectedPoolId)?.volume_liters?.toLocaleString()} liters
                          </div>
                          <div>
                            <span className="text-muted-foreground">Range: </span>
                            {pools.find(p => p.id === selectedPoolId)?.range}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSavePoolSelection}
                      disabled={isSubmitting || !customerId}
                      size="sm"
                    >
                      {isSubmitting ? "Saving..." : "Save Pool Selection"}
                    </Button>
                  </div>
                </div>
              )}
              
              {!customerId && selectedPoolId && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                  <p>To save this pool selection, please save customer information first.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSelectionSection;
