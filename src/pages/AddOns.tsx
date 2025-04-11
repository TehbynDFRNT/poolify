
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplet, Layers, Vacuum } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatPumpProductsTable } from "./AddOns/components/heat-pumps/HeatPumpProductsTable";
import { HeatingInstallationsTable } from "./AddOns/components/heating-installations/HeatingInstallationsTable";
import { BlanketRollerTable } from "./AddOns/components/blanket-roller/BlanketRollerTable";
import { PoolCleanersTable } from "./AddOns/components/PoolCleanersTable";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Add-Ons</h1>
        </div>
        
        <Tabs defaultValue="pool-heating" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pool-heating" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span>Pool Heating</span>
            </TabsTrigger>
            <TabsTrigger value="pool-cleaners" className="flex items-center gap-2">
              <Vacuum className="h-4 w-4" />
              <span>Pool Cleaners</span>
            </TabsTrigger>
            <TabsTrigger value="other-addons" className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span>Other Add-ons</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pool-heating" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  <CardTitle>Heat Pump Products</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <HeatPumpProductsTable />
              </CardContent>
            </Card>
            
            <HeatingInstallationsTable />
            
            <BlanketRollerTable />
          </TabsContent>
          
          <TabsContent value="pool-cleaners" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Vacuum className="h-5 w-5 text-primary" />
                  <CardTitle>Pool Cleaners</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PoolCleanersTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="other-addons" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  <CardTitle>Other Pool Add-ons</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center border border-dashed rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">Additional Add-ons</h3>
                  <p className="text-muted-foreground">
                    This section will contain other pool add-on products.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
