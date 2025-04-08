
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsSection } from "./pool-details/PoolDetailsSection";

interface PoolDetailsSectionsProps {
  pool: Pool;
  selectedColor?: string;
}

export const PoolDetailsSections = ({ pool, selectedColor }: PoolDetailsSectionsProps) => {
  const sections = [
    {
      id: "details",
      title: "Pool Details",
    },
    {
      id: "dimensions",
      title: "Pool Dimensions",
    },
    {
      id: "costs-summary",
      title: "Costs Summary",
    },
    {
      id: "web-rrp",
      title: "Web RRP",
    },
    {
      id: "pricing",
      title: "Pricing",
    },
    {
      id: "fixed-costs",
      title: "Fixed Costs",
    },
    {
      id: "filtration",
      title: "Filtration",
    },
    {
      id: "crane",
      title: "Crane",
    },
    {
      id: "excavation",
      title: "Excavation",
    },
    {
      id: "individual-costs",
      title: "Individual Costs",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <PoolDetailsSection
          key={section.id}
          pool={pool}
          selectedColor={selectedColor}
          sectionId={section.id}
          title={section.title}
        />
      ))}
    </div>
  );
};
