
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                  <CardTitle>Pool Heating Solutions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center border border-dashed rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">Pool Heating Section</h3>
                  <p className="text-muted-foreground">
                    This section will contain pool heating products and solutions.
                  </p>
                </div>
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
