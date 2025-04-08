
import React from "react";
import { Pool } from "@/types/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolDetailsTab } from "./PoolDetailsTab";
import { Info, Ruler, Package, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
      
      <div className="flex gap-6">
        <Tabs defaultValue="details" orientation="vertical" className="w-full">
          <TabsList className="flex flex-col h-auto w-[180px] space-y-1 p-2">
            <TabsTrigger value="details" className="justify-start w-full">
              <Info className="h-4 w-4 mr-2" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="justify-start w-full">
              <Ruler className="h-4 w-4 mr-2" />
              <span>Dimensions</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="justify-start w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="filtration" className="justify-start w-full">
              <Package className="h-4 w-4 mr-2" />
              <span>Filtration</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1">
            <TabsContent value="details" className="mt-0 ml-2">
              <PoolDetailsTab 
                pool={pool} 
                selectedColor={selectedColor} 
                activeTab="details"
                tabId="details"
                title="Pool Details"
              />
            </TabsContent>
            
            <TabsContent value="dimensions" className="mt-0 ml-2">
              <PoolDetailsTab 
                pool={pool} 
                activeTab="dimensions"
                tabId="dimensions"
                title="Pool Dimensions"
              />
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0 ml-2">
              <PoolDetailsTab 
                pool={pool} 
                activeTab="pricing"
                tabId="pricing"
                title="Pool Pricing"
              />
            </TabsContent>
            
            <TabsContent value="filtration" className="mt-0 ml-2">
              <PoolDetailsTab 
                pool={pool} 
                activeTab="filtration"
                tabId="filtration"
                title="Filtration Package"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
