
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
          title="Pool Costs"
          className="border rounded-md shadow-sm"
        />

        {/* Fixed Costs Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="fixed-costs"
          title="Fixed Pool Costs"
          className="border rounded-md shadow-sm"
        />

        {/* Pool Filtration Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="filtration"
          title="Filtration Costs"
          className="border rounded-md shadow-sm"
        />
        
        {/* Crane Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="crane"
          title="Crane Costs"
          className="border rounded-md shadow-sm"
        />
        
        {/* Excavation Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="excavation"
          title="Excavation Costs"
          className="border rounded-md shadow-sm"
        />
        
        {/* Individual Costs Section */}
        <PoolDetailsSection
          pool={pool}
          selectedColor={selectedColor}
          sectionId="individual-costs"
          title="Individual Pool Costs"
          className="border rounded-md shadow-sm"
        />
      </div>
    </div>
  );
};
