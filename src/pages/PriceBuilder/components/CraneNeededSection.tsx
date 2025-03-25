
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCraneSelection } from '../hooks/crane';
import { CraneDisplay } from './CraneSelection/CraneDisplay';
import { CraneSelectionForm } from './CraneSelection/CraneSelectionForm';
import { formatCurrency } from "@/utils/format";

interface CraneNeededSectionProps {
  poolId?: string;
}

export const CraneNeededSection = ({ poolId }: CraneNeededSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    craneCosts,
    selectedCraneId,
    setSelectedCraneId,
    selectedCrane,
    frannaCrane,
    isLoading,
    saveCraneSelection,
    isSaving
  } = useCraneSelection(poolId);

  // Handle crane selection change
  const handleCraneChange = (craneId: string) => {
    setSelectedCraneId(craneId);
  };

  // Handle save button click
  const handleSave = () => {
    if (poolId) {
      saveCraneSelection();
    }
    setIsEditing(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Reset to the last saved value
    if (selectedCrane?.id) {
      setSelectedCraneId(selectedCrane.id);
    } else if (frannaCrane?.id) {
      setSelectedCraneId(frannaCrane.id);
    }
    setIsEditing(false);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Crane Needed</CardTitle>
          <Construction className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <div>
            {isEditing ? (
              <CraneSelectionForm 
                craneCosts={craneCosts}
                selectedCraneId={selectedCraneId}
                onCraneChange={handleCraneChange}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <CraneDisplay 
                selectedCrane={selectedCrane} 
                onClick={() => setIsEditing(true)} 
              />
            )}
            
            <div className="mt-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Crane Cost</span>
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(selectedCrane?.price || 0)}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              {selectedCrane?.name === "Franna Crane-S20T-L1" 
                ? "The default crane will be used for installation unless specified otherwise."
                : "A non-default crane has been selected for this project."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
