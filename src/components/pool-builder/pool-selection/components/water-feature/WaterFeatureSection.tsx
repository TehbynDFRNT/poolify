
import React from "react";
import { Pool } from "@/types/pool";
import { WaterFeaturePlaceholder } from "./WaterFeaturePlaceholder";

interface WaterFeatureSectionProps {
  pool: Pool | null;
  customerId: string | null;
}

export const WaterFeatureSection: React.FC<WaterFeatureSectionProps> = ({
  pool,
  customerId,
}) => {
  return <WaterFeaturePlaceholder pool={pool} customerId={customerId} />;
};
