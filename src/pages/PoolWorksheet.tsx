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
import { ColumnConfigSheet } from "@/components/pool-worksheet/ColumnConfigSheet";
import { PoolWorksheetTable } from "@/components/pool-worksheet/PoolWorksheetTable";
import { columnGroups, defaultVisibleGroups } from "@/components/pool-worksheet/column-config";
import { useFixedCostsData } from "@/components/pool-worksheet/hooks/useFixedCostsData";

const LOCAL_STORAGE_KEY = "poolWorksheet_visibleGroups";

const PoolWorksheet = () => {
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  const { fixedCosts, isLoadingFixedCosts } = useFixedCostsData();
  
  // Initialize visible groups from local storage or use default
  const [visibleGroups, setVisibleGroups] = useState<string[]>(() => {
    const savedGroups = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // If we have saved groups, use them
    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);
        console.log("Loaded saved column config:", parsedGroups);
        return Array.isArray(parsedGroups) ? parsedGroups : defaultVisibleGroups;
      } catch (e) {
        console.error("Error parsing saved column groups:", e);
        return defaultVisibleGroups;
      }
    }
    
    // Otherwise use defaults
    return defaultVisibleGroups;
  });

  // Save visible groups to local storage whenever they change
  useEffect(() => {
    console.log("Saving column config to localStorage:", visibleGroups);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleGroups));
  }, [visibleGroups]);

  // Log the state of column groups for debugging
  useEffect(() => {
    const fixedCostsGroup = columnGroups.find(group => group.id === 'fixed_costs');
    console.log("Fixed costs group columns:", fixedCostsGroup?.columns);
    console.log("Fixed costs data:", fixedCosts);
    console.log("Current visible groups:", visibleGroups);
  }, [fixedCosts, visibleGroups]);

  const isLoading = isLoadingPools || isLoadingFixedCosts;

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
          isLoading={isLoading}
          error={poolsError}
          visibleGroups={visibleGroups}
          setVisibleGroups={setVisibleGroups}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
