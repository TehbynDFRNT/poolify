
import React from "react";
import { Package, Thermometer } from "lucide-react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface UpgradesAndExtrasPlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const UpgradesAndExtrasPlaceholder: React.FC<UpgradesAndExtrasPlaceholderProps> = ({ 
  pool, 
  customerId 
}) => {
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
            
            <TabsContent value="heating" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Pool Heating Options</h3>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border text-center">
                <Thermometer className="h-12 w-12 text-muted-foreground/70 mx-auto mb-3" />
                <h4 className="text-base font-medium mb-2">Heating Solutions</h4>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Heat pump, solar heating, and other options will be available to configure here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
