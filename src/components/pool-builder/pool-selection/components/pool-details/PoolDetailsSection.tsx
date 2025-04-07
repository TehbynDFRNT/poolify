
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsContent } from "./PoolDetailsContent";
import { PoolDimensionsContent } from "./PoolDimensionsContent";
import { PoolPricingContent } from "./PoolPricingContent";
import { PoolFiltrationContent } from "./PoolFiltrationContent";

interface PoolDetailsSectionProps {
  pool: Pool;
  selectedColor?: string;
  sectionId: string;
  title: string;
}

export const PoolDetailsSection: React.FC<PoolDetailsSectionProps> = ({ 
  pool, 
  selectedColor, 
  sectionId, 
  title 
}) => {
  // Generate content based on section type
  const renderContent = () => {
    switch (sectionId) {
      case "details":
        return <PoolDetailsContent pool={pool} selectedColor={selectedColor} />;
      case "dimensions":
        return <PoolDimensionsContent pool={pool} />;
      case "pricing":
        return <PoolPricingContent pool={pool} />;
      case "filtration":
        return <PoolFiltrationContent pool={pool} />;
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {renderContent()}
    </div>
  );
};
