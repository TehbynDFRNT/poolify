
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolCleanersTable } from "@/pages/AddOns/components/poolCleaners/PoolCleanersTable";
import { HeatPumpTable } from "./AddOns/components/heat-pumps/components/HeatPumpTable";
import { HeatingInstallationsTable } from "./AddOns/components/heating-installations/HeatingInstallationsTable";
import { PoolBlanketProductsTable } from "./AddOns/components/blankets/PoolBlanketProductsTable";
import { BlanketRollerTable } from "./AddOns/components/blanket-roller/BlanketRollerTable";
import { HandGrabRailsTable } from "./AddOns/components/hand-grab-rails/HandGrabRailsTable";
import { SpaJetsTable } from "./AddOns/components/spa-jets/SpaJetsTable";
import { DeckJetsTable } from "./AddOns/components/deck-jets/DeckJetsTable";
import { LightingTable } from "./AddOns/components/lighting/LightingTable";
import { HardwareUpgradesTable } from "./AddOns/components/hardware-upgrades/HardwareUpgradesTable";
import { AddOnsPageHeader } from "./AddOns/components/AddOnsPageHeader";

const AddOns = () => {
  const [activeTab, setActiveTab] = useState("pool-cleaners");

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <AddOnsPageHeader />
        
        <Tabs defaultValue="pool-cleaners" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
            <TabsTrigger value="pool-cleaners">Pool Cleaners</TabsTrigger>
            <TabsTrigger value="heating">Heating</TabsTrigger>
            <TabsTrigger value="blankets">Pool Blankets</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="sanitation">Sanitation</TabsTrigger>
            <TabsTrigger value="other">Other Add-ons</TabsTrigger>
          </TabsList>

          <TabsContent value="pool-cleaners" className="space-y-6">
            <PoolCleanersTable />
          </TabsContent>

          <TabsContent value="heating" className="space-y-6">
            <HeatPumpTable />
            <HeatingInstallationsTable />
          </TabsContent>

          <TabsContent value="blankets" className="space-y-6">
            <PoolBlanketProductsTable />
            <BlanketRollerTable />
          </TabsContent>

          <TabsContent value="hardware" className="space-y-6">
            <HardwareUpgradesTable />
          </TabsContent>

          <TabsContent value="sanitation" className="space-y-6">
            {/* These components will be managed by the HardwareUpgradesTable component */}
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <HandGrabRailsTable />
            <SpaJetsTable />
            <DeckJetsTable />
            <LightingTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
