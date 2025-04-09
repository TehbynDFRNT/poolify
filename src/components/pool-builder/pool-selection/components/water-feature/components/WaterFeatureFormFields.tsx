
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { WaterFeatureFormValues } from "@/types/water-feature";
import { WaterFeatureSize } from "./WaterFeatureSize";
import { BackCladding } from "./BackCladding";
import { FinishSelector } from "./FinishSelector";
import { LedBladeSelector } from "./LedBladeSelector";
import { FRONT_FINISH_OPTIONS, FINISH_OPTIONS } from "../constants";

interface WaterFeatureFormFieldsProps {
  form: UseFormReturn<WaterFeatureFormValues>;
}

export const WaterFeatureFormFields: React.FC<WaterFeatureFormFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Water Feature Size */}
      <WaterFeatureSize form={form} />

      {/* Back Cladding Needed */}
      <BackCladding form={form} />

      {/* Front Finish */}
      <FinishSelector 
        form={form} 
        name="frontFinish" 
        label="Front Finish" 
        options={FRONT_FINISH_OPTIONS} 
      />

      {/* Top Finish */}
      <FinishSelector 
        form={form} 
        name="topFinish" 
        label="Top Finish" 
        options={FINISH_OPTIONS} 
      />

      {/* Sides Finish */}
      <FinishSelector 
        form={form} 
        name="sidesFinish" 
        label="Sides Finish" 
        options={FINISH_OPTIONS} 
      />

      {/* LED Blade Selection */}
      <LedBladeSelector form={form} />
    </div>
  );
};
