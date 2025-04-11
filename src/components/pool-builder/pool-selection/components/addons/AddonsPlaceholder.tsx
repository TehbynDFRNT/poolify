
import React from "react";
import { Pool } from "@/types/pool";
import { AddonsSection } from "./AddonsSection";

interface AddonsPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const AddonsPlaceholder: React.FC<AddonsPlaceholderProps> = ({ 
  pool, 
  customerId 
}) => {
  return (
    <AddonsSection pool={pool} customerId={customerId} />
  );
};
