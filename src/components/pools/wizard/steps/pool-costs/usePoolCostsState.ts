
import { useState } from "react";
import { PoolCosts } from "./PoolCostGrid";

export const usePoolCostsState = () => {
  const [poolCosts, setPoolCosts] = useState<PoolCosts>({
    pea_gravel: 0,
    install_fee: 0,
    trucked_water: 0,
    salt_bags: 0,
    misc: 2700,
    coping_supply: 0,
    beam: 0,
    coping_lay: 0
  });
  
  const handleCostChange = (field: keyof PoolCosts, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setPoolCosts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };
  
  return {
    poolCosts,
    setPoolCosts,
    handleCostChange
  };
};
