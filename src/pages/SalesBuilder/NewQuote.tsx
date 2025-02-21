
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CoreCustomerInfo } from "./components/CoreCustomerInfo";
import { SiteCostsSection } from "./components/SiteCostsSection";
import { ExtraPavingSection } from "./components/ExtraPavingSection";
import { ExistingConcreteSection } from "./components/ExistingConcreteSection";
import { RetainingWallsSection } from "./components/RetainingWallsSection";
import { AddOnsSection } from "./components/AddOnsSection";
import { WaterFeaturesSection } from "./components/WaterFeaturesSection";
import { ThirdPartyCostsSection } from "./components/ThirdPartyCostsSection";
import { FencingSection } from "./components/FencingSection";
import { ElectricalSection } from "./components/ElectricalSection";
import type { QuoteFormData } from "./types";

const NewQuote = () => {
  const form = useForm<QuoteFormData>();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState({
    siteCosts: false,
    extraPaving: false,
    existingConcrete: false,
    retainingWalls: false,
    addOns: false,
    waterFeatures: false,
    thirdPartyCosts: false,
    fencing: false,
    electrical: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (data: QuoteFormData) => {
    console.log('Form submitted:', data);
    toast({
      title: "Quote created",
      description: "The quote has been created successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/sales-builder/quotes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Quote</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CoreCustomerInfo form={form} />
              
              <SiteCostsSection 
                form={form}
                isOpen={openSections.siteCosts}
                onToggle={() => toggleSection('siteCosts')}
              />

              <ExtraPavingSection
                form={form}
                isOpen={openSections.extraPaving}
                onToggle={() => toggleSection('extraPaving')}
              />

              <ExistingConcreteSection
                form={form}
                isOpen={openSections.existingConcrete}
                onToggle={() => toggleSection('existingConcrete')}
              />

              <RetainingWallsSection
                form={form}
                isOpen={openSections.retainingWalls}
                onToggle={() => toggleSection('retainingWalls')}
              />

              <AddOnsSection
                form={form}
                isOpen={openSections.addOns}
                onToggle={() => toggleSection('addOns')}
              />

              <WaterFeaturesSection
                form={form}
                isOpen={openSections.waterFeatures}
                onToggle={() => toggleSection('waterFeatures')}
              />

              <ThirdPartyCostsSection
                form={form}
                isOpen={openSections.thirdPartyCosts}
                onToggle={() => toggleSection('thirdPartyCosts')}
              />

              <FencingSection
                form={form}
                isOpen={openSections.fencing}
                onToggle={() => toggleSection('fencing')}
              />

              <ElectricalSection
                form={form}
                isOpen={openSections.electrical}
                onToggle={() => toggleSection('electrical')}
              />

              <div className="flex justify-end pt-6">
                <Button type="submit">Create Quote</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewQuote;
