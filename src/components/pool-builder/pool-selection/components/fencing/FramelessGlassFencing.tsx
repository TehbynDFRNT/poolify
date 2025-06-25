import { FormActions } from "@/components/pool-builder/pool-selection/components/concrete-paving/FormActions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Pool } from "@/types/pool";
import { Fence } from "lucide-react";
import React from "react";
import CostSummary from "./components/CostSummary";
import EarthingToggle from "./components/EarthingToggle";
import FencingHeader from "./components/FencingHeader";
import GateSelector from "./components/GateSelector";
import InfoBanner from "./components/InfoBanner";
import LinearMeterInput from "./components/LinearMeterInput";
import PanelSelector from "./components/PanelSelector";
import { useFencingFormGuarded } from "./hooks/useFencingFormGuarded";

interface FramelessGlassFencingProps {
  pool: Pool;
  customerId: string;
  onSaveSuccess?: () => void;
}

export const FramelessGlassFencing: React.FC<FramelessGlassFencingProps> = ({
  pool,
  customerId,
  onSaveSuccess
}) => {
  const {
    form,
    costs,
    isSubmitting,
    isDeleting,
    hasExistingData,
    onSubmit,
    onDelete,
    StatusWarningDialog,
    DeleteStatusWarningDialog,
    costsLoading
  } = useFencingFormGuarded(
    customerId,
    onSaveSuccess,
    pool.id
  );

  return (
    <div className="space-y-6">
      <FencingHeader />

      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-start gap-3">
            <Fence className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-medium">Fencing Specifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your frameless glass fencing options below
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <LinearMeterInput 
                  form={form} 
                  linearCost={costs.linearCost} 
                  unitCost={costsLoading ? undefined : 396}
                />
                <GateSelector
                  form={form}
                  gatesCost={costs.gatesCost}
                  freeGateDiscount={costs.freeGateDiscount}
                  unitCost={costsLoading ? undefined : 495}
                />
                <PanelSelector
                  form={form}
                  simplePanelsCost={costs.simplePanelsCost}
                  complexPanelsCost={costs.complexPanelsCost}
                />
                <EarthingToggle form={form} />
              </div>

              <CostSummary costs={costs} />

              <FormActions
                onSave={form.handleSubmit(onSubmit)}
                onDelete={hasExistingData ? onDelete : undefined}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                hasExistingData={hasExistingData}
                saveText="Save Fencing"
                deleteText="Remove Fencing"
              />

              <InfoBanner />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Status Warning Dialogs */}
      <StatusWarningDialog />
      <DeleteStatusWarningDialog />
    </div>
  );
};
