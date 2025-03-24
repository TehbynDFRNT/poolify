
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PoolCostItem from "./PoolCostItem";

export interface PoolCosts {
  pea_gravel: number;
  install_fee: number;
  trucked_water: number;
  salt_bags: number;
  misc: number;
  coping_supply: number;
  beam: number;
  coping_lay: number;
}

interface PoolCostGridProps {
  poolCosts: PoolCosts;
  onCostChange: (field: keyof PoolCosts, value: string) => void;
}

const PoolCostGrid: React.FC<PoolCostGridProps> = ({ poolCosts, onCostChange }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PoolCostItem
            id="pea_gravel"
            label="Pea Gravel"
            value={poolCosts.pea_gravel}
            onChange={(value) => onCostChange('pea_gravel', value)}
          />
          
          <PoolCostItem
            id="install_fee"
            label="Installation Fee"
            value={poolCosts.install_fee}
            onChange={(value) => onCostChange('install_fee', value)}
          />
          
          <PoolCostItem
            id="trucked_water"
            label="Trucked Water"
            value={poolCosts.trucked_water}
            onChange={(value) => onCostChange('trucked_water', value)}
          />
          
          <PoolCostItem
            id="salt_bags"
            label="Salt Bags"
            value={poolCosts.salt_bags}
            onChange={(value) => onCostChange('salt_bags', value)}
          />
          
          <PoolCostItem
            id="misc"
            label="Miscellaneous"
            value={poolCosts.misc}
            onChange={(value) => onCostChange('misc', value)}
          />
          
          <PoolCostItem
            id="coping_supply"
            label="Coping Supply"
            value={poolCosts.coping_supply}
            onChange={(value) => onCostChange('coping_supply', value)}
          />
          
          <PoolCostItem
            id="beam"
            label="Beam"
            value={poolCosts.beam}
            onChange={(value) => onCostChange('beam', value)}
          />
          
          <PoolCostItem
            id="coping_lay"
            label="Coping Lay"
            value={poolCosts.coping_lay}
            onChange={(value) => onCostChange('coping_lay', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolCostGrid;
