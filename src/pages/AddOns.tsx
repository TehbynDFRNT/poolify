
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Add-Ons</h1>
        </div>
        
        <Tabs defaultValue="interior" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="interior">Interior Features</TabsTrigger>
            <TabsTrigger value="exterior">Exterior Features</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="lighting">Lighting</TabsTrigger>
          </TabsList>

          <TabsContent value="interior" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Interior Features</h2>
              <p className="text-muted-foreground mb-4">
                Manage pool interior features and add-ons such as tiling, steps, and benches.
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p>Interior features content will be added here.</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="exterior" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Exterior Features</h2>
              <p className="text-muted-foreground mb-4">
                Manage pool exterior features and add-ons such as coping, decking, and water features.
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p>Exterior features content will be added here.</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="equipment" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Equipment</h2>
              <p className="text-muted-foreground mb-4">
                Manage pool equipment add-ons such as heaters, automated covers, and cleaning systems.
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p>Equipment content will be added here.</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="lighting" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Lighting</h2>
              <p className="text-muted-foreground mb-4">
                Manage pool lighting options and add-ons.
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p>Lighting content will be added here.</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
