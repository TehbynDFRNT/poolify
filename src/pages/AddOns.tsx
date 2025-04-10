
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll, Bath, Thermometer } from "lucide-react";
import { PoolCleanersTable } from "./AddOns/components/PoolCleanersTable";
import { PoolBlanketsTable } from "./AddOns/components/blankets/PoolBlanketsTable";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Add-Ons</h1>
        </div>
        
        <Tabs defaultValue="blankets" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="blankets" className="flex items-center gap-1">
              <Scroll className="h-4 w-4" />
              <span>Blankets & Heat Pumps</span>
            </TabsTrigger>
            <TabsTrigger value="cleaners" className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>Pool Cleaners</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="blankets" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <Scroll className="h-5 w-5 text-primary" />
                    <Thermometer className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>Blankets, Rollers & Heat Pumps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PoolBlanketsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cleaners" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <CardTitle>Pool Cleaners</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PoolCleanersTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
