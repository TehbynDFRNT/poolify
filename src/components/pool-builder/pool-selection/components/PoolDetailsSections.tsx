
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsSection } from "./pool-details/PoolDetailsSection";
import { Separator } from "@/components/ui/separator";

interface PoolDetailsSectionsProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsSections: React.FC<PoolDetailsSectionsProps> = ({ 
  pool, 
  selectedColor 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Pool Details</h3>
      
      <div className="space-y-6">
        {/* Pool Details Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="details"
          title="Pool Specifications"
          className="border rounded-md shadow-sm"
        />

        {/* Pool Dimensions Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="dimensions"
          title="Pool Dimensions"
          className="border rounded-md shadow-sm"
        />
        
        {/* Pool Pricing Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="pricing"
          title="Pool Pricing"
          className="border rounded-md shadow-sm"
        />

        {/* Pool Filtration Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="filtration"
          title="Filtration Package"
          className="border rounded-md shadow-sm"
        />
        
        {/* Crane Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="crane"
          title="Crane Information"
          className="border rounded-md shadow-sm"
        />
        
        {/* Excavation Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="excavation"
          title="Excavation Information"
          className="border rounded-md shadow-sm"
        />
      </div>
    </div>
  );
};
