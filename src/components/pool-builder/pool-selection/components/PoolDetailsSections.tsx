
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsSection } from "./PoolDetailsSection";
import { Card } from "@/components/ui/card";

interface PoolDetailsSectionsProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsSections: React.FC<PoolDetailsSectionsProps> = ({ 
  pool, 
  selectedColor
}) => {
  return (
    <Card className="p-4 space-y-6">
      <PoolDetailsSection 
        pool={pool}
        selectedColor={selectedColor}
        sectionId="details"
        title="Pool Details"
      />
      
      <div className="border-t border-border pt-6"></div>
      
      <PoolDetailsSection 
        pool={pool}
        selectedColor={selectedColor}
        sectionId="dimensions"
        title="Pool Dimensions"
      />
      
      <div className="border-t border-border pt-6"></div>
      
      <PoolDetailsSection 
        pool={pool}
        selectedColor={selectedColor}
        sectionId="filtration"
        title="Filtration Package"
      />
      
      <div className="border-t border-border pt-6"></div>
      
      <PoolDetailsSection 
        pool={pool}
        selectedColor={selectedColor}
        sectionId="pricing"
        title="Pricing Information"
      />
    </Card>
  );
};
