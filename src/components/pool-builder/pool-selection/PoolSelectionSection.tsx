import React from "react";
import { PoolSelectionContent } from "./components/PoolSelectionContent";
import { PoolSelectionHeader } from "./components/PoolSelectionHeader";
import { usePoolSelectionGuarded } from "./hooks/usePoolSelectionGuarded";
import { useSaveAllGuarded } from "./hooks/useSaveAllGuarded";

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
    handleSavePoolSelection,
    StatusWarningDialog: PoolSelectionStatusDialog
  } = usePoolSelectionGuarded(customerId);

  const {
    isSubmittingAll,
    handleSaveAll: handleSaveAllRaw,
    StatusWarningDialog: SaveAllStatusDialog
  } = useSaveAllGuarded(customerId);

  // Wrapper function to pass the current pool selection data
  const handleSaveAll = async () => {
    if (selectedPoolId) {
      await handleSaveAllRaw(selectedPoolId, selectedColor);
    }
  };

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

      <PoolSelectionStatusDialog />
      <SaveAllStatusDialog />
    </div>
  );
};

export default PoolSelectionSection;
