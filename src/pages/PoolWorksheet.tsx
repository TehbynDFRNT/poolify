
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PoolWorksheetTable } from "@/components/pool-worksheet/PoolWorksheetTable";
import { columnGroups, defaultVisibleGroups } from "@/components/pool-worksheet/column-config";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "poolWorksheet_visibleGroups";

const PoolWorksheet = () => {
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  
  // Initialize visible groups with only our simplified columns
  const [visibleGroups, setVisibleGroups] = useState<string[]>(defaultVisibleGroups);
  
  // Show a notification that the data has been simplified
  useEffect(() => {
    toast.info("Pool worksheet simplified", {
      description: "Now showing only pool name, range, and buy prices as requested."
    });
  }, []);

  const isDataEmpty = !pools || pools.length === 0;

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

        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Simplified Pool Worksheet</h1>
            <p className="text-muted-foreground mt-1">
              {isDataEmpty 
                ? "All pool worksheet data has been reset" 
                : "Showing only pool name, range, and buy prices"}
            </p>
          </div>
        </div>
        
        {isDataEmpty ? (
          <div className="border rounded-md p-12 bg-slate-50 text-center">
            <p className="text-lg mb-4">All pool worksheet data has been reset.</p>
            <p className="mb-6">You can add new pools from the Pool Specifications page.</p>
            <Link to="/pool-specifications">
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" />
                Go to Pool Specifications
              </Button>
            </Link>
          </div>
        ) : (
          <PoolWorksheetTable 
            pools={pools}
            isLoading={isLoadingPools}
            error={poolsError}
            visibleGroups={visibleGroups}
            setVisibleGroups={setVisibleGroups}
            showEssentialOnly={true}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
