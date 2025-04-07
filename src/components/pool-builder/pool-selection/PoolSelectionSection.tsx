
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePools } from "@/hooks/usePools";
import { CheckCircle, Info, Settings, Package, Ruler, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PoolSelectionSectionProps {
  customerId?: string | null;
}

const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({ customerId }) => {
  const { data: pools, isLoading, error } = usePools();
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
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
      // We need to use a custom field name since pool_id isn't in the type definition
      const { error } = await supabase
        .from('pool_projects')
        .update({
          // Use a type assertion to bypass the TypeScript error
          // This will be properly fixed when we update the database schema
          "pool_specification_id": selectedPoolId
        } as any)
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

  // Get the selected pool details
  const selectedPool = pools?.find(p => p.id === selectedPoolId);

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
                  onValueChange={(value) => {
                    setSelectedPoolId(value);
                    setActiveTab("details");
                  }}
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

              {selectedPoolId && selectedPool && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">Selected Pool: {selectedPool.name}</h3>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="details" className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Details</span>
                      </TabsTrigger>
                      <TabsTrigger value="dimensions" className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        <span>Dimensions</span>
                      </TabsTrigger>
                      <TabsTrigger value="filtration" className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>Filtration</span>
                      </TabsTrigger>
                      <TabsTrigger value="pricing" className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Pricing</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="p-4 border rounded-md">
                      <h3 className="font-medium text-base mb-3">Pool Details</h3>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <span className="text-muted-foreground">Pool Range:</span>
                          <p className="font-medium">{selectedPool.range}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pool Type:</span>
                          <p className="font-medium">{selectedPool.pool_type_id || "Standard"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <p className="font-medium">{selectedPool.weight_kg ? `${selectedPool.weight_kg} kg` : "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volume:</span>
                          <p className="font-medium">{selectedPool.volume_liters ? `${selectedPool.volume_liters.toLocaleString()} liters` : "N/A"}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="dimensions" className="p-4 border rounded-md">
                      <h3 className="font-medium text-base mb-3">Pool Dimensions</h3>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <span className="text-muted-foreground">Length:</span>
                          <p className="font-medium">{selectedPool.length} m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Width:</span>
                          <p className="font-medium">{selectedPool.width} m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Shallow End Depth:</span>
                          <p className="font-medium">{selectedPool.depth_shallow} m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deep End Depth:</span>
                          <p className="font-medium">{selectedPool.depth_deep} m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Waterline:</span>
                          <p className="font-medium">{selectedPool.waterline_l_m ? `${selectedPool.waterline_l_m} L/m` : "N/A"}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="filtration" className="p-4 border rounded-md">
                      <h3 className="font-medium text-base mb-3">Filtration Package</h3>
                      {selectedPool.default_filtration_package_id ? (
                        <div>
                          <p className="font-medium">Default Filtration Package ID:</p>
                          <p>{selectedPool.default_filtration_package_id}</p>
                          <p className="text-muted-foreground text-sm mt-2">
                            Detailed filtration package information will be available after connecting to the database.
                          </p>
                        </div>
                      ) : (
                        <p>No default filtration package assigned to this pool.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="pricing" className="p-4 border rounded-md">
                      <h3 className="font-medium text-base mb-3">Pricing Information</h3>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <span className="text-muted-foreground">Base Price (ex GST):</span>
                          <p className="font-medium">
                            {selectedPool.buy_price_ex_gst 
                              ? `$${selectedPool.buy_price_ex_gst.toLocaleString()}` 
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Base Price (inc GST):</span>
                          <p className="font-medium">
                            {selectedPool.buy_price_inc_gst 
                              ? `$${selectedPool.buy_price_inc_gst.toLocaleString()}` 
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-muted-foreground text-sm">
                          Additional pricing information and customization options will be 
                          available after connecting to the database.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSavePoolSelection}
                      disabled={isSubmitting || !customerId}
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
