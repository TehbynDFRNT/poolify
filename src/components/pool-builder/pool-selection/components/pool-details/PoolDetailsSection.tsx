import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pool } from "@/types/pool";
import React from "react";
import { PoolCostsSummaryContent } from "./PoolCostsSummaryContent";
import { PoolCraneContent } from "./PoolCraneContent";
import { PoolDetailsContent } from "./PoolDetailsContent";
import { PoolDimensionsContent } from "./PoolDimensionsContent";
import { PoolExcavationContent } from "./PoolExcavationContent";
import { PoolFiltrationContent } from "./PoolFiltrationContent";
import { PoolFixedCostsContent } from "./PoolFixedCostsContent";
import { PoolIndividualCostsContent } from "./PoolIndividualCostsContent";
import { PoolPricingContent } from "./PoolPricingContent";

interface PoolDetailsSectionProps {
  pool: Pool;
  selectedColor?: string;
  sectionId: string;
  title: string;
  className?: string;
  customerId?: string;
}

export const PoolDetailsSection: React.FC<PoolDetailsSectionProps> = ({
  pool,
  selectedColor,
  sectionId,
  title,
  className,
  customerId
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
      case "fixed-costs":
        return <PoolFixedCostsContent pool={pool} />;
      case "filtration":
        return <PoolFiltrationContent pool={pool} customerId={customerId} />;
      case "crane":
        return <PoolCraneContent pool={pool} />;
      case "excavation":
        return <PoolExcavationContent pool={pool} />;
      case "individual-costs":
        return <PoolIndividualCostsContent pool={pool} />;
      case "costs-summary":
        return (
          <PoolCostsSummaryContent
            pool={pool}
            customerId={customerId}
          />
        );
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="bg-secondary/50 pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
