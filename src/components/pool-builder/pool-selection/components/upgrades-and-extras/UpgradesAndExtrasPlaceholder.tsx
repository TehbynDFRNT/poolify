
import React, { useState } from "react";
import { Package, Thermometer, Check, X } from "lucide-react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { Skeleton } from "@/components/ui/skeleton";

interface UpgradesAndExtrasPlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const UpgradesAndExtrasPlaceholder: React.FC<UpgradesAndExtrasPlaceholderProps> = ({ 
  pool, 
  customerId 
}) => {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);

  const {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  } = usePoolHeatingOptions(
    pool?.id || null,
    pool?.name,
    pool?.range
  );

  // Calculate costs
  const heatPumpInstallationCost = getInstallationCost("Heat Pump Installation");
  const blanketRollerInstallationCost = getInstallationCost("Blanket and Roller");

  const heatPumpTotalCost = includeHeatPump && compatibleHeatPump 
    ? (compatibleHeatPump.rrp || 0) + heatPumpInstallationCost
    : 0;

  const blanketRollerTotalCost = includeBlanketRoller && blanketRoller
    ? blanketRoller.rrp + blanketRollerInstallationCost
    : 0;

  const totalCost = heatPumpTotalCost + blanketRollerTotalCost;

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
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Upgrades & Extras</CardTitle>
          </div>
          <CardDescription>
            Configure additional upgrades and extras for {pool.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="heating">Heating Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-6">
                Explore and select optional upgrades and extras to enhance your pool experience.
                These options can be customized to fit your specific needs and preferences.
              </p>
              
              {/* Placeholder for future upgrade and extras form/content */}
              <div className="bg-slate-50 rounded-lg p-6 border text-center">
                <p className="text-muted-foreground">
                  Upgrades and extras configuration coming soon.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="heating" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Pool Heating Options</h3>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  {/* Heat Pump Section */}
                  <Card className="border border-muted">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-primary" />
                            <Label htmlFor="heat-pump-switch" className="font-medium">
                              Would you like to add a pool heat pump?
                            </Label>
                          </div>
                          <Switch 
                            id="heat-pump-switch"
                            checked={includeHeatPump}
                            onCheckedChange={setIncludeHeatPump}
                          />
                        </div>
                        
                        {includeHeatPump && (
                          <div className="bg-muted/30 p-4 rounded-md space-y-3">
                            {compatibleHeatPump ? (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Compatible Heat Pump</p>
                                    <div className="flex gap-2 items-center">
                                      <Check className="h-4 w-4 text-green-500" />
                                      <p>{compatibleHeatPump.hp_description}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">SKU: {compatibleHeatPump.hp_sku}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <p className="text-sm">Equipment Cost:</p>
                                      <p className="font-medium">{formatCurrency(compatibleHeatPump.rrp || 0)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                      <p className="text-sm">Installation Cost:</p>
                                      <p className="font-medium">{formatCurrency(heatPumpInstallationCost)}</p>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 mt-1">
                                      <p className="text-sm font-medium">Total Cost:</p>
                                      <p className="font-bold">{formatCurrency(heatPumpTotalCost)}</p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-600">
                                <X className="h-4 w-4" />
                                <p>No compatible heat pump found for this pool model.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blanket & Roller Section */}
                  <Card className="border border-muted">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-primary" />
                            <Label htmlFor="blanket-roller-switch" className="font-medium">
                              Would you like a blanket and roller to cover the pool?
                            </Label>
                          </div>
                          <Switch 
                            id="blanket-roller-switch"
                            checked={includeBlanketRoller}
                            onCheckedChange={setIncludeBlanketRoller}
                          />
                        </div>
                        
                        {includeBlanketRoller && (
                          <div className="bg-muted/30 p-4 rounded-md space-y-3">
                            {blanketRoller ? (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Compatible Blanket & Roller</p>
                                    <div className="flex gap-2 items-center">
                                      <Check className="h-4 w-4 text-green-500" />
                                      <p>{blanketRoller.description}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">SKU: {blanketRoller.sku}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <p className="text-sm">Equipment Cost:</p>
                                      <p className="font-medium">{formatCurrency(blanketRoller.rrp)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                      <p className="text-sm">Installation Cost:</p>
                                      <p className="font-medium">{formatCurrency(blanketRollerInstallationCost)}</p>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 mt-1">
                                      <p className="text-sm font-medium">Total Cost:</p>
                                      <p className="font-bold">{formatCurrency(blanketRollerTotalCost)}</p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-600">
                                <X className="h-4 w-4" />
                                <p>No compatible blanket & roller found for this pool model.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Section */}
                  {(includeHeatPump || includeBlanketRoller) && (
                    <div className="bg-primary/10 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Total Heating Options:</h3>
                        <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button disabled={!customerId}>
                          Save Heating Options
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
