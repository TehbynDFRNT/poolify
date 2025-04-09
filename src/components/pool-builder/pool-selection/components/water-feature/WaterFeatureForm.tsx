
import React from "react";
import { Pool } from "@/types/pool";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { SaveButton } from "../SaveButton";
import { useWaterFeature } from "./useWaterFeature";
import { WaterFeatureCostSummary } from "./WaterFeatureCostSummary";
import { WaterFeatureFormFields } from "./components/WaterFeatureFormFields";
import { WaterFeatureFormValues } from "@/types/water-feature";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WaterFeatureFormProps {
  pool: Pool;
  customerId: string | null;
}

export const WaterFeatureForm: React.FC<WaterFeatureFormProps> = ({
  pool,
  customerId,
}) => {
  const { 
    form, 
    summary, 
    isSubmitting, 
    isDeleting,
    isLoading, 
    existingData,
    saveWaterFeature,
    deleteWaterFeature 
  } = useWaterFeature(customerId, pool?.id);

  const onSubmit = async (data: WaterFeatureFormValues) => {
    if (!customerId || !pool) {
      return;
    }

    await saveWaterFeature(data);
  };

  const handleDelete = async () => {
    if (!customerId || !pool) {
      return;
    }

    await deleteWaterFeature();
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

              {/* Submit and Delete Buttons */}
              <div className="flex justify-between">
                {existingData && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                      >
                        {isDeleting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Remove Water Feature
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all water feature options for this pool. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <div className={existingData ? "ml-auto" : ""}>
                  <SaveButton 
                    onClick={form.handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                    disabled={!form.formState.isDirty && existingData !== null}
                    buttonText="Save Water Feature Options"
                  />
                </div>
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
