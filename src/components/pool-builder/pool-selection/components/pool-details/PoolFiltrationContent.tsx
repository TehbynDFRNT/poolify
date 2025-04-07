
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
  const { filtrationPackage } = useFiltrationPackage(pool);

  if (!pool.default_filtration_package_id) {
    return <NoFiltrationPackage />;
  }
  
  if (!filtrationPackage) {
    return <PoolFiltrationLoading />;
  }
  
  return <FiltrationDetails filtrationPackage={filtrationPackage} />;
};
