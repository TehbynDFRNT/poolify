
import React from "react";
import { Pool } from "@/types/pool";
import { ExtraPavingConcreting } from "./ExtraPavingConcreting";

interface ConcreteAndPavingPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const ConcreteAndPavingPlaceholder: React.FC<ConcreteAndPavingPlaceholderProps> = ({
  pool,
  customerId
}) => {
  if (!customerId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Please save customer information first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExtraPavingConcreting pool={pool} customerId={customerId} />
    </div>
  );
};
