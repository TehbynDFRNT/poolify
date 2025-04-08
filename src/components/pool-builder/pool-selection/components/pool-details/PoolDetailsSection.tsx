
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsContent } from "./PoolDetailsContent";
import { PoolDimensionsContent } from "./PoolDimensionsContent";
import { PoolPricingContent } from "./PoolPricingContent";
import { PoolFiltrationContent } from "./PoolFiltrationContent";
import { PoolCraneContent } from "./PoolCraneContent";
import { PoolExcavationContent } from "./PoolExcavationContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PoolDetailsSectionProps {
  pool: Pool;
  selectedColor?: string;
  sectionId: string;
  title: string;
  className?: string;
}

export const PoolDetailsSection: React.FC<PoolDetailsSectionProps> = ({ 
  pool, 
  selectedColor, 
  sectionId, 
  title,
  className
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
      case "crane":
        return <PoolCraneContent pool={pool} />;
      case "excavation":
        return <PoolExcavationContent pool={pool} />;
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
