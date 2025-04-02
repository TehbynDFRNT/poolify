
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateWorksheetDialog } from "@/components/worksheets/CreateWorksheetDialog";
import { WorksheetsList } from "@/components/worksheets/WorksheetsList";
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
          <h1 className="text-3xl font-bold">Pool Worksheets</h1>
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => document.getElementById('create-worksheet-trigger')?.click()}>
            <Plus className="mr-2 h-4 w-4" />
            Create Worksheet
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Pool Worksheets</CardTitle>
          </CardHeader>
          <CardContent>
            <WorksheetsList />
          </CardContent>
        </Card>
      </div>
      <CreateWorksheetDialog />
    </DashboardLayout>
  );
};

export default PoolWorksheet;
