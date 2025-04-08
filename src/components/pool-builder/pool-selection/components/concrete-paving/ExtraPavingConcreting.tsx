
import React from "react";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { ExtraConcreting } from "./ExtraConcreting";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcreteAndPavingCostSummary } from "./ConcreteAndPavingCostSummary";
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
      <ConcreteAndPavingCostSummary pool={pool} customerId={customerId} />
    </div>
  );
};
