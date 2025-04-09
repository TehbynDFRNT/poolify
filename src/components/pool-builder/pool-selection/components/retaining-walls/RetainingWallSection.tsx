
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RetainingWall } from "@/types/retaining-wall";
import { FormActions } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingOnExistingConcrete/components/FormActions";
import { DeleteConfirmDialog } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingOnExistingConcrete/components/DeleteConfirmDialog";
import { WallTypeSelector } from "./components/WallTypeSelector";
import { RetainingWallDimensions } from "./components/RetainingWallDimensions";
import { WallTypeDetails } from "./components/WallTypeDetails";
import { CalculationResults } from "./components/CalculationResults";
import { useRetainingWallSection } from "./hooks/useRetainingWallSection";

interface RetainingWallSectionProps {
  customerId: string | null;
  wallNumber: number;
  retainingWalls?: RetainingWall[];
  isLoadingWalls: boolean;
  onWallUpdate?: () => void;
}

export const RetainingWallSection: React.FC<RetainingWallSectionProps> = ({
  customerId,
  wallNumber,
  retainingWalls,
  isLoadingWalls,
  onWallUpdate,
}) => {
  const {
    // State
    selectedWallType,
    height1,
    height2,
    length,
    squareMeters,
    totalCost,
    selectedWall,
    marginAmount,
    isSaving,
    isDeleting,
    showDeleteConfirm,
    isLoading,
    hasExistingData,
    
    // Actions
    setSelectedWallType,
    handleHeightChange,
    handleLengthChange,
    handleSave,
    handleDelete,
    setShowDeleteConfirm
  } = useRetainingWallSection({
    customerId,
    wallNumber,
    retainingWalls,
    onWallUpdate
  });

  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="space-y-4 pt-4">
        <div className="text-xl font-semibold pt-4">Retaining Wall {wallNumber}</div>
        <div className="grid gap-4">
          <WallTypeSelector 
            selectedWallType={selectedWallType}
            retainingWalls={retainingWalls}
            isLoadingWalls={isLoadingWalls}
            wallNumber={wallNumber}
            isLoading={isLoading}
            onSelectWallType={setSelectedWallType}
          />
          
          <RetainingWallDimensions 
            height1={height1}
            height2={height2}
            length={length}
            isLoading={isLoading}
            onHeightChange={handleHeightChange}
            onLengthChange={handleLengthChange}
          />
        </div>
        
        <WallTypeDetails selectedWall={selectedWall} />
        
        {/* Results section */}
        <CalculationResults 
          squareMeters={squareMeters}
          marginAmount={marginAmount}
          totalCost={totalCost}
          marginRate={selectedWall?.margin || 0}
          ratePerSquareMeter={selectedWall?.total || 0}
        />
        
        {/* Form actions (Save/Delete buttons) */}
        {customerId && (
          <>
            <FormActions 
              onSave={handleSave}
              onDelete={() => setShowDeleteConfirm(true)}
              isSubmitting={isSaving}
              isDeleting={isDeleting}
              hasExistingData={hasExistingData}
            />
            
            <DeleteConfirmDialog
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDelete}
              isDeleting={isDeleting}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
