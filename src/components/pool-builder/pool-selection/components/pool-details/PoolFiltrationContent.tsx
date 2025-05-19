import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { Pool } from "@/types/pool";
import React from "react";
import { FiltrationDetails } from "./filtration/FiltrationDetails";
import { NoFiltrationPackage } from "./filtration/NoFiltrationPackage";
import { PoolFiltrationLoading } from "./filtration/PoolFiltrationLoading";

interface PoolFiltrationContentProps {
  pool: Pool;
  customerId?: string;
}

export const PoolFiltrationContent: React.FC<PoolFiltrationContentProps> = ({ pool, customerId }) => {
  // Get detailed filtration package data
  const { filtrationPackage, isLoading, error } = useFiltrationPackage(pool, customerId);

  // If there's no filtration package assigned
  if (!pool.default_filtration_package_id) {
    return <NoFiltrationPackage pool={pool} customerId={customerId} />;
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
  return <FiltrationDetails filtrationPackage={filtrationPackage} pool={pool} customerId={customerId} />;
};
