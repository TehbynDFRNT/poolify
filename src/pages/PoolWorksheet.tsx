
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorksheetView } from "@/components/worksheets/WorksheetView";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus } from "lucide-react";

const PoolWorksheet = () => {
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
              Pool Worksheet
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pool Worksheet</h1>
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pool Details</CardTitle>
          </CardHeader>
          <CardContent>
            <WorksheetView />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
