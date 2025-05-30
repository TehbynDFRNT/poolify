
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolBlanketsTable } from "./AddOns/components/blankets/PoolBlanketsTable";
import { BlanketRollerTable } from "./AddOns/components/blanket-roller/BlanketRollerTable";
import { HeatingInstallationsTable } from "./AddOns/components/heating-installations/HeatingInstallationsTable";
import { PoolCleanersTable } from "./AddOns/components/poolCleaners/PoolCleanersTable";
import { AddOnsHeader } from "@/components/headers/AddOnsHeader";
import { Thermometer, Scroll, Wrench, Bath } from "lucide-react";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <AddOnsHeader />
        
        <Tabs defaultValue="blankets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="blankets" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span>Heating & Blankets</span>
            </TabsTrigger>
            <TabsTrigger value="rollers" className="flex items-center gap-2">
              <Scroll className="h-4 w-4" />
              <span>Blanket Rollers</span>
            </TabsTrigger>
            <TabsTrigger value="installations" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span>Heating Install</span>
            </TabsTrigger>
            <TabsTrigger value="cleaners" className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              <span>Pool Cleaners</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="blankets">
              <PoolBlanketsTable />
            </TabsContent>
            
            <TabsContent value="rollers">
              <BlanketRollerTable />
            </TabsContent>
            
            <TabsContent value="installations">
              <HeatingInstallationsTable />
            </TabsContent>
            
            <TabsContent value="cleaners">
              <PoolCleanersTable />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
