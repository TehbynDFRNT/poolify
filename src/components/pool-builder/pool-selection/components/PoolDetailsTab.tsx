import { Pool } from "@/types/pool";
import React from "react";
import { PoolDetailsSection } from "./pool-details/PoolDetailsSection";

interface PoolDetailsTabProps {
  pool: Pool;
  selectedColor?: string;
  activeTab: string;
  tabId: string;
  title: string;
  customerId?: string;
}

export const PoolDetailsTab: React.FC<PoolDetailsTabProps> = ({
  pool,
  selectedColor,
  activeTab,
  tabId,
  title,
  customerId
}) => {
  return (
    <PoolDetailsSection
      pool={pool}
      selectedColor={selectedColor}
      sectionId={tabId}
      title={title}
      className="mt-0 shadow-none border-0 bg-transparent"
      customerId={customerId}
    />
  );
};
