
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, Scissors, Ruler, Fence, HardHat, Shovel } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ExtraPavingCostsTable } from "./components/ExtraPavingCostsTable";
import { ConcreteCutsTable } from "./components/ConcreteCutsTable";
import { ConcreteCostsTable } from "./components/ConcreteCostsTable";
import { ConcreteLabourCostsTable } from "./components/ConcreteLabourCostsTable";
import { ConcretePump } from "./components/ConcretePump";
import { UnderFenceConcreteStripsTable } from "./components/UnderFenceConcreteStripsTable";
import { ExtraConcretingTable } from "./components/ExtraConcretingTable";

const ExtraPaving = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/extra-paving" className="transition-colors hover:text-foreground">
                Extra Paving and Concrete
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Extra Paving and Concrete</h1>
            <p className="text-gray-500 mt-1">Manage additional paving and concrete costs for pool installations</p>
          </div>
          <Layers className="h-6 w-6 text-gray-500" />
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

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExtraPaving;
