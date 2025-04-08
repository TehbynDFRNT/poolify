
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
  // Only show content when the tab is active
  if (activeTab !== tabId) {
    return null;
  }

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
