
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll, Bath } from "lucide-react";
import { PoolCleanersTable } from "./AddOns/components/PoolCleanersTable";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Add-Ons</h1>
        </div>
        
        <Tabs defaultValue="blankets" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="blankets">Blankets and Rollers</TabsTrigger>
            <TabsTrigger value="cleaners">Pool Cleaners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blankets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scroll className="h-5 w-5 text-primary" />
                  <CardTitle>Blankets and Rollers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    Manage pool blankets, covers, and roller systems.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This section will be expanded with pricing options, specifications, and configuration settings for various pool blankets and roller systems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cleaners" className="space-y-6">
            <Card>
              <CardHeader>
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
