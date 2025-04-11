
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll, Thermometer } from "lucide-react";
import { PoolBlanketsActions } from "./PoolBlanketsActions";
import { PoolBlanketProductsTable } from "./PoolBlanketProductsTable";
import { HeatPumpProductsTable } from "./HeatPumpProductsTable";
import { AddPoolBlanketForm } from "./AddPoolBlanketForm";
import { PoolBlanket } from "@/types/pool-blanket";

export const PoolBlanketsTable = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBlanket, setEditingBlanket] = useState<PoolBlanket | null>(null);
  const [activeTab, setActiveTab] = useState<"blankets" | "heatpumps">("blankets");

  const handleAddNew = () => {
    setEditingBlanket(null);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingBlanket(null);
  };

  return (
    <div className="space-y-4">
      <PoolBlanketsActions onAddNew={handleAddNew} />

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "blankets" | "heatpumps")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="blankets" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            <span>Pool Blankets</span>
          </TabsTrigger>
          <TabsTrigger value="heatpumps" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span>Heat Pumps</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="blankets" className="space-y-4 animate-fadeIn">
          <PoolBlanketProductsTable />
        </TabsContent>
        
        <TabsContent value="heatpumps" className="space-y-4 animate-fadeIn">
          <HeatPumpProductsTable />
        </TabsContent>
      </Tabs>

      <AddPoolBlanketForm 
        open={isAddDialogOpen} 
        onOpenChange={handleCloseDialog} 
        editBlanket={editingBlanket}
      />
    </div>
  );
};
