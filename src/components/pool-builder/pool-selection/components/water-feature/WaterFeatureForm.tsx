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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Pool } from "@/types/pool";
import { WaterFeatureFormValues } from "@/types/water-feature";
import { Trash2, Save } from "lucide-react";
import React from "react";
import { SaveButton } from "../SaveButton";
import { WaterFeatureFormFields } from "./components/WaterFeatureFormFields";
import { useWaterFeatureGuarded } from "./useWaterFeatureGuarded";
import { WaterFeatureCostSummary } from "./WaterFeatureCostSummary";

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
    deleteWaterFeature,
    SaveStatusWarningDialog,
    DeleteStatusWarningDialog
  } = useWaterFeatureGuarded(customerId, pool?.id);

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
                    size="lg"
                    variant="green"
                    icon={<Save className="mr-2 h-5 w-5" />}
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

      {/* Status Warning Dialogs */}
      <SaveStatusWarningDialog />
      <DeleteStatusWarningDialog />
    </div>
  );
};
