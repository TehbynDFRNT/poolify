
import React from "react";
import { Pool } from "@/types/pool";
import { ElectricalRequirements } from "./ElectricalRequirements";

interface ElectricalPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const ElectricalPlaceholder: React.FC<ElectricalPlaceholderProps> = ({ pool, customerId }) => {
  return <ElectricalRequirements pool={pool} customerId={customerId} />;
};
