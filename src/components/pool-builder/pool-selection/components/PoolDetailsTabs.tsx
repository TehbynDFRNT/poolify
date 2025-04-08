
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Ruler, Package, DollarSign } from "lucide-react";
import { Pool } from "@/types/pool";
import { PoolDetailsTab } from "./PoolDetailsTab";

interface PoolDetailsTabsProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsTabs: React.FC<PoolDetailsTabsProps> = ({ 
  pool, 
  selectedColor
}) => {
  return (
    <div className="mt-4">
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
          <TabsTrigger value="filtration" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Filtration</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Pricing</span>
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
            selectedColor={selectedColor}
            activeTab="dimensions"
            tabId="dimensions"
            title="Pool Dimensions"
          />
        </TabsContent>
        
        <TabsContent value="filtration">
          <PoolDetailsTab 
            pool={pool}
            selectedColor={selectedColor}
            activeTab="filtration"
            tabId="filtration"
            title="Filtration Package"
          />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PoolDetailsTab 
            pool={pool}
            selectedColor={selectedColor}
            activeTab="pricing"
            tabId="pricing"
            title="Pricing Information"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
