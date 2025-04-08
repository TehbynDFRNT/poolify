
import React from "react";
import { Pool } from "@/types/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolDetailsTab } from "./PoolDetailsTab";
import { Info, Ruler, Package, DollarSign } from "lucide-react";

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
          <TabsTrigger value="details" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>Dimensions</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="filtration" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Filtration</span>
          </TabsTrigger>
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
