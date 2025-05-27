import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bath, Package, Scroll, Thermometer, Wrench } from "lucide-react";
import { BlanketRollerTable } from "./AddOns/components/blanket-roller/BlanketRollerTable";
import { PoolBlanketsTable } from "./AddOns/components/blankets/PoolBlanketsTable";
import { GeneralExtrasTable } from "./AddOns/components/general-extras/GeneralExtrasTable";
import { HeatingInstallationsTable } from "./AddOns/components/heating-installations/HeatingInstallationsTable";
import { PoolCleanersTable } from "./AddOns/components/poolCleaners/PoolCleanersTable";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Pool Add-Ons</h1>
        <p className="text-muted-foreground">
          Manage pool add-ons and optional features including heating options, blankets, rollers, and pool cleaners.
        </p>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>General Extras</span>
            </TabsTrigger>
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
            <TabsContent value="general">
              <GeneralExtrasTable />
            </TabsContent>

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
