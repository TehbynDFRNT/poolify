
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Ruler, Package, DollarSign } from "lucide-react";
import { Pool } from "@/types/pool";
import { PoolDetailsTab } from "./PoolDetailsTab";

interface PoolDetailsTabsProps {
  pool: Pool;
  selectedColor?: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const PoolDetailsTabs: React.FC<PoolDetailsTabsProps> = ({ 
  pool, 
  selectedColor, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
      
      <PoolDetailsTab 
        pool={pool}
        selectedColor={selectedColor}
        activeTab={activeTab}
        tabId="details"
        title="Pool Details"
      />
      
      <PoolDetailsTab 
        pool={pool}
        selectedColor={selectedColor}
        activeTab={activeTab}
        tabId="dimensions"
        title="Pool Dimensions"
      />
      
      <PoolDetailsTab 
        pool={pool}
        selectedColor={selectedColor}
        activeTab={activeTab}
        tabId="filtration"
        title="Filtration Package"
      />
      
      <PoolDetailsTab 
        pool={pool}
        selectedColor={selectedColor}
        activeTab={activeTab}
        tabId="pricing"
        title="Pricing Information"
      />
    </Tabs>
  );
};
