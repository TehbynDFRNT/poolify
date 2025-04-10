
import React from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useFlatTopMetalFencingForm } from "./hooks/useFlatTopMetalFencingForm";
import FencingHeader from "./components/FencingHeader";
import LinearMeterInput from "./components/LinearMeterInput";
import GateSelector from "./components/GateSelector";
import FTMPanelSelector from "./components/FTMPanelSelector";
import EarthingToggle from "./components/EarthingToggle";
import CostSummary from "./components/CostSummary";
import InfoBanner from "./components/InfoBanner";
import { FormActions } from "@/components/pool-builder/pool-selection/components/concrete-paving/FormActions";

interface FlatTopMetalFencingProps {
  pool: Pool;
  customerId: string;
  onSaveSuccess?: () => void;
}

export const FlatTopMetalFencing: React.FC<FlatTopMetalFencingProps> = ({ 
  pool, 
  customerId,
  onSaveSuccess 
}) => {
  const { form, costs, isSubmitting, isDeleting, hasExistingData, onSubmit, onDelete } = useFlatTopMetalFencingForm(
    customerId, 
    pool.id,
    onSaveSuccess
  );

  return (
    <div className="space-y-6">
      <FencingHeader title="Flat Top Metal Fencing" />
      
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-start gap-3">
            <Fence className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-medium">Fencing Specifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your flat top metal fencing options below
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <LinearMeterInput form={form} linearCost={costs.linearCost} unitCost={165} />
                <GateSelector 
                  form={form} 
                  gatesCost={costs.gatesCost} 
                  freeGateDiscount={0}
                  unitCost={297}
                />
                <FTMPanelSelector 
                  form={form} 
                  simplePanelsCost={costs.simplePanelsCost}
                  complexPanelsCost={costs.complexPanelsCost}
                />
                <EarthingToggle 
                  form={form}
                  isFixedCost={true}
                  perMeterCost={150}
                />
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
    </div>
  );
};
