
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Waves, Calculator, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import CustomerInformationSection from "@/components/pool-builder/customer-information/CustomerInformationSection";
import CustomersList from "@/components/pool-builder/customers/CustomersList";

const PoolBuilder = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Builder
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Pool Builder</h1>
          <p className="text-muted-foreground mt-1">
            Design and customize swimming pools
          </p>
        </div>

        <Tabs defaultValue="builder" className="space-y-4">
          <TabsList>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Pool Builder
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="formula-reference" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Formula Reference
            </TabsTrigger>
          </TabsList>
          <TabsContent value="builder">
            <Card className="p-6">
              <CustomerInformationSection />
            </Card>
          </TabsContent>
          <TabsContent value="customers">
            <CustomersList />
          </TabsContent>
          <TabsContent value="formula-reference">
            <FormulaReference />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PoolBuilder;
