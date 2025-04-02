
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Table } from "@/components/ui/table";
import { usePoolPackages } from "@/hooks/usePoolPackages";

import { ColumnConfigSheet } from "./components/ColumnConfigSheet";
import { PoolsTableHeader } from "./components/PoolsTableHeader";
import { PoolsTableBody } from "./components/PoolsTableBody";
import { useVisibleColumns } from "./hooks/useVisibleColumns";
import { useFixedCosts, useFixedCostTotal } from "./hooks/useFixedCosts";
import { usePoolCosts } from "./hooks/usePoolCosts";
import { usePoolDigMatches } from "./hooks/usePoolDigMatches";
import { createPackagesByPoolId, calculateExcavationCost } from "./utils/calculationHelpers";

const PoolWorksheet = () => {
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  const { poolsWithPackages, isLoading: isLoadingPackages } = usePoolPackages();
  const { data: poolCosts, isLoading: isLoadingCosts } = usePoolCosts();
  const { data: fixedCosts, isLoading: isLoadingFixedCosts } = useFixedCosts();
  const { data: poolDigMatches } = usePoolDigMatches();
  
  // Set up columns visibility
  const { 
    visibleGroups,
    setVisibleGroups,
    visibleColumnGroups,
    getVisibleColumns
  } = useVisibleColumns(fixedCosts);

  // Calculate the total of all fixed costs
  const fixedCostsTotal = useFixedCostTotal(fixedCosts);

  // Create a lookup object for packages by pool ID
  const packagesByPoolId = createPackagesByPoolId(poolsWithPackages);

  const isLoading = isLoadingPools || isLoadingPackages || isLoadingCosts || isLoadingFixedCosts;
  const error = poolsError;

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
        
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <PoolsTableHeader 
              visibleColumnGroups={visibleColumnGroups}
              getVisibleColumns={getVisibleColumns}
            />
            <PoolsTableBody 
              pools={pools || []}
              isLoading={isLoading}
              error={error}
              getVisibleColumns={getVisibleColumns}
              calculateExcavationCost={(poolId) => calculateExcavationCost(poolId, poolDigMatches)}
              fixedCosts={fixedCosts}
              poolCosts={poolCosts}
              packagesByPoolId={packagesByPoolId}
              fixedCostsTotal={fixedCostsTotal}
              visibleGroups={visibleGroups}
              poolDigMatches={poolDigMatches}
            />
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
