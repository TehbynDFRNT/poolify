
import React from "react";
import { Pool } from "@/types/pool";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { SaveButton } from "../SaveButton";
import { useWaterFeature } from "./useWaterFeature";
import { WaterFeatureCostSummary } from "./WaterFeatureCostSummary";
import { WaterFeatureFormFields } from "./components/WaterFeatureFormFields";
import { WaterFeatureFormValues } from "@/types/water-feature";

interface WaterFeatureFormProps {
  pool: Pool;
  customerId: string | null;
}

export const WaterFeatureForm: React.FC<WaterFeatureFormProps> = ({
  pool,
  customerId,
}) => {
  const { form, summary, isSubmitting, isLoading, saveWaterFeature } = useWaterFeature(customerId, pool?.id);

  const onSubmit = async (data: WaterFeatureFormValues) => {
    if (!customerId || !pool) {
      return;
    }

    await saveWaterFeature(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading water feature options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <WaterFeatureFormFields form={form} />

              {/* Submit Button */}
              <div className="flex justify-end">
                <SaveButton 
                  onClick={form.handleSubmit(onSubmit)}
                  isSubmitting={isSubmitting}
                  disabled={!form.formState.isDirty}
                  buttonText="Save Water Feature Options"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Cost Summary</h3>
        <WaterFeatureCostSummary 
          summary={summary}
          hasBackCladding={form.getValues().backCladdingNeeded}
        />
      </div>
    </div>
  );
};
