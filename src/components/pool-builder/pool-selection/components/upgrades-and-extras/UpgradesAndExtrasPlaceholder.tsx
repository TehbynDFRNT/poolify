import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pool } from "@/types/pool";
import { Package, Save, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { GeneralOptionsContent } from "./general/GeneralOptionsContent";
import { HeatingOptionsContent } from "./heating/HeatingOptionsContent";
import { PoolCleanersContent } from "./pool-cleaners/PoolCleanersContent";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpgradesAndExtrasPlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const UpgradesAndExtrasPlaceholder: React.FC<UpgradesAndExtrasPlaceholderProps> = ({
  pool,
  customerId
}) => {
  const queryClient = useQueryClient();
  const [isSavingAll, setIsSavingAll] = useState(false);

  const handleSaveAll = async () => {
    if (!customerId || !pool?.id) return;
    
    setIsSavingAll(true);
    try {
      // Invalidate all upgrades & extras related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pool-general-extras', customerId, pool.id] }),
        queryClient.invalidateQueries({ queryKey: ['pool-heating-options', customerId] }),
        queryClient.invalidateQueries({ queryKey: ['pool-cleaner-selection', customerId] }),
        queryClient.invalidateQueries({ queryKey: ['pool-custom-addons', customerId] }),
        queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] })
      ]);
      
      toast.success("All upgrades & extras data saved successfully");
    } catch (error) {
      console.error("Error saving all upgrades & extras data:", error);
      toast.error("Failed to save all data");
    } finally {
      setIsSavingAll(false);
    }
  };

  if (!pool) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
        <Package className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">Upgrades & Extras</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please select a pool first to configure upgrades and extras.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Upgrades & Extras</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Configure additional upgrades and extras for {pool.name}
              </CardDescription>
            </div>
            {customerId && (
              <Button
                onClick={handleSaveAll}
                disabled={isSavingAll}
                className="flex items-center gap-2"
                variant="outline"
              >
                {isSavingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving All...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="heating">Heating</TabsTrigger>
              <TabsTrigger value="cleaners">Pool Cleaners</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <GeneralOptionsContent pool={pool} customerId={customerId} />
            </TabsContent>

            <TabsContent value="heating" className="space-y-6">
              <HeatingOptionsContent pool={pool} customerId={customerId} />
            </TabsContent>

            <TabsContent value="cleaners" className="space-y-6">
              <PoolCleanersContent pool={pool} customerId={customerId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
