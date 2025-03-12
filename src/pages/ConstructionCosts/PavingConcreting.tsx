
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction, Grid, HardHat } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PavingCostsTable } from "./components/PavingCostsTable";
import { useEffect } from "react";
import { usePavingCosts } from "./hooks/usePavingCosts";

const PavingConcreting = () => {
  const {
    pavingCosts,
    isLoading,
    editingId,
    editingValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleValueChange,
    initializeDefaultValues,
    deleteAllPavingCosts
  } = usePavingCosts();

  // Initialize default values if the table is empty
  useEffect(() => {
    const initialize = async () => {
      if (!isLoading && (!pavingCosts || pavingCosts.length === 0)) {
        console.log("Table is empty, initializing default values");
        await initializeDefaultValues();
      }
    };
    
    initialize();
  }, [pavingCosts, isLoading, initializeDefaultValues]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
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
              <Link to="/construction-costs/paving-concreting" className="transition-colors hover:text-foreground">
                Paving & Concreting
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paving & Concreting</h1>
            <p className="text-gray-500 mt-1">Manage paving and concrete costs</p>
          </div>
        </div>
        
        <Tabs defaultValue="paving" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="paving">Paving</TabsTrigger>
            <TabsTrigger value="concrete">Concrete</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paving" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Grid className="h-5 w-5 text-primary" />
                  <CardTitle>Paving Costs</CardTitle>
                </div>
                <CardDescription>Set up and manage paving costs for pool installations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">Loading paving costs...</div>
                ) : (
                  <PavingCostsTable 
                    pavingCosts={pavingCosts || []}
                    editingId={editingId}
                    editingValues={editingValues}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onValueChange={handleValueChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="concrete" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-primary" />
                  <CardTitle>Concrete Costs</CardTitle>
                </div>
                <CardDescription>Set up and manage concrete costs for pool installations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Construction className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No concrete costs defined yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add concrete costs to get started</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PavingConcreting;
