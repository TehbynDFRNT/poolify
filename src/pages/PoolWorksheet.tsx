
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pool Worksheet</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your pool-related calculations
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-lg border-dashed">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle>No Worksheet Created</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Start by creating your first worksheet to calculate pool specifications and costs
              </p>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" />
                Create New Worksheet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
