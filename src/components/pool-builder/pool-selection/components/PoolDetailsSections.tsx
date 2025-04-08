
import React from "react";
import { Pool } from "@/types/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolDetailsTab } from "./PoolDetailsTab";

interface PoolDetailsSectionsProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsSections: React.FC<PoolDetailsSectionsProps> = ({ 
  pool, 
  selectedColor 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Pool Details</h3>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="filtration">Filtration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <PoolDetailsTab 
            pool={pool} 
            selectedColor={selectedColor} 
            activeTab="details"
            tabId="details"
            title="Pool Details"
          />
        </TabsContent>
        
        <TabsContent value="dimensions">
          <PoolDetailsTab 
            pool={pool} 
            activeTab="dimensions"
            tabId="dimensions"
            title="Pool Dimensions"
          />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PoolDetailsTab 
            pool={pool} 
            activeTab="pricing"
            tabId="pricing"
            title="Pool Pricing"
          />
        </TabsContent>
        
        <TabsContent value="filtration">
          <PoolDetailsTab 
            pool={pool} 
            activeTab="filtration"
            tabId="filtration"
            title="Filtration Package"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
