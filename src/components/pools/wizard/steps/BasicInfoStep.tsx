
import React from "react";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import PoolIdentificationSection from "./basic-info/PoolIdentificationSection";
import DimensionsSection from "./basic-info/DimensionsSection";
import CalculatedValuesSection from "./basic-info/CalculatedValuesSection";
import AdditionalDetailsSection from "./basic-info/AdditionalDetailsSection";
import PriceSection from "./basic-info/PriceSection";
import VolumeCalculator from "./basic-info/VolumeCalculator";

const BasicInfoStep: React.FC = () => {
  // This is only used to confirm the context exists
  usePoolWizard();

  return (
    <div className="space-y-6">
      {/* Hidden component that handles calculations */}
      <VolumeCalculator />
      
      {/* Pool identification section */}
      <PoolIdentificationSection />
      
      {/* Dimensions section */}
      <DimensionsSection />
      
      {/* Calculated values section */}
      <CalculatedValuesSection />
      
      {/* Additional details section */}
      <AdditionalDetailsSection />
      
      {/* Price section */}
      <PriceSection />
    </div>
  );
};

export default BasicInfoStep;
