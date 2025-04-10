
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pool } from "@/types/pool";
import { FramelessGlassFencing } from "./FramelessGlassFencing";
import { FlatTopMetalFencing } from "./FlatTopMetalFencing";

interface FencingSelectorProps {
  pool: Pool;
  customerId: string;
  onSaveSuccess?: () => void;
}

export const FencingSelector: React.FC<FencingSelectorProps> = ({ 
  pool, 
  customerId,
  onSaveSuccess
}) => {
  const [activeTab, setActiveTab] = useState<string>("frameless-glass");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="frameless-glass">Frameless Glass</TabsTrigger>
        <TabsTrigger value="flat-top-metal">Flat Top Metal</TabsTrigger>
      </TabsList>
      
      <TabsContent value="frameless-glass">
        <FramelessGlassFencing 
          pool={pool} 
          customerId={customerId} 
          onSaveSuccess={onSaveSuccess}
        />
      </TabsContent>
      
      <TabsContent value="flat-top-metal">
        <FlatTopMetalFencing 
          pool={pool} 
          customerId={customerId} 
          onSaveSuccess={onSaveSuccess}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FencingSelector;
