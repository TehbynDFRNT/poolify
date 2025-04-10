
import React from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useFencingForm } from "./hooks/useFencingForm";
import FencingHeader from "./components/FencingHeader";
import LinearMeterInput from "./components/LinearMeterInput";
import GateSelector from "./components/GateSelector";
import PanelSelector from "./components/PanelSelector";
import EarthingToggle from "./components/EarthingToggle";
import CostSummary from "./components/CostSummary";
import SubmitButton from "./components/SubmitButton";
import InfoBanner from "./components/InfoBanner";

interface FramelessGlassFencingProps {
  pool: Pool;
  customerId: string;
}

export const FramelessGlassFencing: React.FC<FramelessGlassFencingProps> = ({ pool, customerId }) => {
  const { form, costs, isSubmitting, onSubmit } = useFencingForm(customerId, pool.id);

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
                <LinearMeterInput form={form} linearCost={costs.linearCost} />
                <GateSelector 
                  form={form} 
                  gatesCost={costs.gatesCost} 
                  freeGateDiscount={costs.freeGateDiscount} 
                />
                <PanelSelector 
                  form={form} 
                  simplePanelsCost={costs.simplePanelsCost}
                  complexPanelsCost={costs.complexPanelsCost}
                />
                <EarthingToggle form={form} />
              </div>
              
              <CostSummary costs={costs} />
              
              <SubmitButton isSubmitting={isSubmitting} />
              
              <InfoBanner />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
