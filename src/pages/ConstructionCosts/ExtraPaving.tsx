
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, Scissors, Ruler, Truck, Fence, HardHat, Shovel, Calculator } from "lucide-react";
import { ExtraPavingCostsTable } from "./components/ExtraPavingCostsTable";
import { ConcreteCutsTable } from "./components/ConcreteCutsTable";
import { ConcreteCostsTable } from "./components/ConcreteCostsTable";
import { ConcreteLabourCostsTable } from "./components/ConcreteLabourCostsTable";
import { ConcretePump } from "./components/ConcretePump";
import { UnderFenceConcreteStripsTable } from "./components/UnderFenceConcreteStripsTable";
import { ExtraConcretingTable } from "./components/ExtraConcretingTable";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";

const ExtraPaving = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Extra Paving and Concrete</h1>
          <p className="text-gray-500 mt-1">
            Manage additional paving and concrete costs for pool installations
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>Extra Paving Costs</CardTitle>
              </div>
              <CardDescription>
                Configure and manage costs for additional paving requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtraPavingCostsTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Fence className="h-5 w-5 text-primary" />
                <CardTitle>Under Fence Concrete Strips</CardTitle>
              </div>
              <CardDescription>
                Configure and manage under fence concrete strip costs and margins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnderFenceConcreteStripsTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                <CardTitle>Concrete Cuts</CardTitle>
              </div>
              <CardDescription>
                Configure and manage costs for concrete cuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConcreteCutsTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                <CardTitle>Concrete Costs</CardTitle>
              </div>
              <CardDescription>
                Configure and manage prices for concrete and dust per meter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConcreteCostsTable />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-primary" />
                <CardTitle>Concrete Labour Costs</CardTitle>
              </div>
              <CardDescription>
                Configure and manage prices for concrete labour costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConcreteLabourCostsTable />
            </CardContent>
          </Card>

          <ConcretePump />

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shovel className="h-5 w-5 text-primary" />
                <CardTitle>Extra Concreting</CardTitle>
              </div>
              <CardDescription>
                Configure and manage costs for additional concrete requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtraConcretingTable />
            </CardContent>
          </Card>

          {/* Formula Reference Section */}
          <FormulaReference />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExtraPaving;
