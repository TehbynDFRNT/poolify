
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ColumnConfigSheet } from "@/components/pool-worksheet/ColumnConfigSheet";
import { PoolWorksheetTable } from "@/components/pool-worksheet/PoolWorksheetTable";
import { columnGroups, defaultVisibleGroups } from "@/components/pool-worksheet/column-config";

const PoolWorksheet = () => {
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  const [visibleGroups, setVisibleGroups] = useState<string[]>(defaultVisibleGroups);

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
            <h1 className="text-3xl font-bold">Pool Worksheet</h1>
            <p className="text-muted-foreground mt-1">
              A comprehensive breakdown of all pool specifications
            </p>
          </div>
          
          <ColumnConfigSheet 
            visibleGroups={visibleGroups} 
            setVisibleGroups={setVisibleGroups} 
          />
        </div>
        
        <PoolWorksheetTable 
          pools={pools}
          isLoading={isLoadingPools}
          error={poolsError}
          visibleGroups={visibleGroups}
          setVisibleGroups={setVisibleGroups}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
