
import React from "react";
import { Pool } from "@/types/pool";
import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { PoolFiltrationLoading } from "./filtration/PoolFiltrationLoading";
import { NoFiltrationPackage } from "./filtration/NoFiltrationPackage";
import { FiltrationDetails } from "./filtration/FiltrationDetails";

interface PoolFiltrationContentProps {
  pool: Pool;
}

export const PoolFiltrationContent: React.FC<PoolFiltrationContentProps> = ({ pool }) => {
  // Get detailed filtration package data
  const { filtrationPackage, isLoading, error } = useFiltrationPackage(pool);

  // If there's no filtration package assigned
  if (!pool.default_filtration_package_id) {
    return <NoFiltrationPackage pool={pool} />;
  }
  
  // Show loading state while fetching package details
  if (isLoading) {
    return <PoolFiltrationLoading />;
  }
  
  // If there was an error fetching the package data
  if (error || !filtrationPackage) {
    return (
      <div className="p-4 bg-destructive/10 rounded-md">
        <p className="text-destructive">
          Error loading filtration package. Please try again or contact support.
        </p>
      </div>
    );
  }
  
  // Render the filtration package details
  return <FiltrationDetails filtrationPackage={filtrationPackage} pool={pool} />;
};
