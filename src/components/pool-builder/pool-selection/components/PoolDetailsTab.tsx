
import React from "react";
import { Pool } from "@/types/pool";
import { PoolDetailsSection } from "./pool-details/PoolDetailsSection";

interface PoolDetailsTabProps {
  pool: Pool;
  selectedColor?: string;
  activeTab: string;
  tabId: string;
  title: string;
}

export const PoolDetailsTab: React.FC<PoolDetailsTabProps> = ({ 
  pool, 
  selectedColor, 
  activeTab, 
  tabId, 
  title 
}) => {
  return (
    <PoolDetailsSection
      pool={pool}
      selectedColor={selectedColor}
      sectionId={tabId}
      title={title}
      className="mt-2"
    />
  );
};
