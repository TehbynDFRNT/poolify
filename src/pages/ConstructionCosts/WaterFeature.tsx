
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Droplets } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { WaterFeaturesTable } from "./components/WaterFeaturesTable";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WaterFeatureFormula } from "./components/WaterFeatureFormula";

const WaterFeature = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/water-feature" className="transition-colors hover:text-foreground">
                Water Feature
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Water Feature</h1>
          <p className="text-gray-500">
            Manage water feature options and pricing for pool installations.
          </p>
        </div>

        <div className="space-y-8">
          <WaterFeaturesTable />
          
          {/* Formula Reference Card */}
          <Card>
            <CardHeader className="bg-white pb-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <CardTitle>Water Feature Formulas</CardTitle>
              </div>
              <CardDescription>
                Reference for water feature pricing calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <WaterFeatureFormula />
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WaterFeature;
