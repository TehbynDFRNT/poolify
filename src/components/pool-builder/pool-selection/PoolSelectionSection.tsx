
import React from "react";
import { usePoolSelection } from "./hooks/usePoolSelection";
import { useSaveAll } from "./hooks/useSaveAll";
import { PoolSelectionHeader } from "./components/PoolSelectionHeader";
import { PoolSelectionContent } from "./components/PoolSelectionContent";

interface PoolSelectionSectionProps {
  customerId?: string | null;
}

const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({ customerId }) => {
  const {
    poolsByRange,
    isLoading,
    error,
    selectedPoolId,
    setSelectedPoolId,
    selectedPool,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    handleSavePoolSelection
  } = usePoolSelection(customerId);

  const { isSubmittingAll, handleSaveAll } = useSaveAll(customerId, handleSavePoolSelection);

  return (
    <div className="space-y-6">
      <PoolSelectionHeader 
        customerId={customerId} 
        isSubmittingAll={isSubmittingAll} 
        handleSaveAll={handleSaveAll}
        hasSelectedPool={!!selectedPoolId}
      />

      <PoolSelectionContent 
        isLoading={isLoading}
        error={error}
        poolsByRange={poolsByRange}
        selectedPoolId={selectedPoolId}
        setSelectedPoolId={setSelectedPoolId}
        selectedPool={selectedPool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        customerId={customerId}
        isSubmitting={isSubmitting}
        handleSavePoolSelection={handleSavePoolSelection}
      />
    </div>
  );
};

export default PoolSelectionSection;
