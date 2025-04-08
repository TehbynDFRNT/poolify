
import React from "react";
import { ExtraPavingConcrete } from "@/components/pool-builder/pool-selection/components/concrete-paving/ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "@/components/pool-builder/pool-selection/components/concrete-paving/PavingOnExistingConcrete";
import { ExtraConcreting } from "@/components/pool-builder/pool-selection/components/concrete-paving/ExtraConcreting";
import { ConcretePumpSelector } from "@/components/pool-builder/pool-selection/components/concrete-paving/ConcretePumpSelector";
import { UnderFenceConcreteStrips } from "@/components/pool-builder/pool-selection/components/concrete-paving/UnderFenceConcreteStrips";
import { ConcreteCuts } from "@/components/pool-builder/pool-selection/components/concrete-paving/ConcreteCuts";
import { Pool } from "@/types/pool";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  return (
    <div className="space-y-6">
      <ExtraPavingConcrete pool={pool} customerId={customerId} />
      <PavingOnExistingConcrete pool={pool} customerId={customerId} />
      <ExtraConcreting pool={pool} customerId={customerId} />
      <ConcretePumpSelector pool={pool} customerId={customerId} />
      <UnderFenceConcreteStrips pool={pool} customerId={customerId} />
      <ConcreteCuts pool={pool} customerId={customerId} />
    </div>
  );
};
