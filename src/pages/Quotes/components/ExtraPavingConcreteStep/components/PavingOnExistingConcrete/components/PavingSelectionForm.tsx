
import React from 'react';
import { PavingTypeSelector } from "../../PavingTypeSelector";
import { MetersInput } from "../../MetersInput";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingSelectionFormProps {
  selectedPavingId: string;
  meters: number;
  extraPavingCosts?: ExtraPavingCost[];
  onSelectPaving: (id: string) => void;
  onChangeMeter: (value: number) => void;
}

export const PavingSelectionForm: React.FC<PavingSelectionFormProps> = ({
  selectedPavingId,
  meters,
  extraPavingCosts,
  onSelectPaving,
  onChangeMeter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Paving Selection */}
      <PavingTypeSelector 
        selectedPavingId={selectedPavingId}
        extraPavingCosts={extraPavingCosts}
        onSelect={onSelectPaving}
      />
      
      {/* Metres Input */}
      <MetersInput 
        meters={meters} 
        onChange={onChangeMeter} 
      />
    </div>
  );
};
