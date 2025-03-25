
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { QuoteProvider } from "@/pages/Quotes/context/QuoteContext";
import { CustomerInfoStep } from "@/pages/Quotes/components/CustomerInfoStep";
import { SelectPoolStep } from "@/pages/Quotes/components/SelectPoolStep";
import { SiteRequirementsStep } from "@/pages/Quotes/components/SiteRequirementsStep";
import { ExtraPavingStep } from "@/pages/Quotes/components/ExtraPavingStep";
import { OptionalAddonsStep } from "@/pages/Quotes/components/OptionalAddonsStep";
import { CostSummaryStep } from "@/pages/Quotes/components/CostSummaryStep";
import { PreviewQuoteStep } from "@/pages/Quotes/components/PreviewQuoteStep";
import { QuoteProgressSteps } from "./components/QuoteProgressSteps";
import { cn } from "@/lib/utils";

const CreateQuote = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const steps = [
    { id: 1, name: "Customer Info" },
    { id: 2, name: "Base Pool" },
    { id: 3, name: "Site Requirements" },
    { id: 4, name: "Extra Paving" },
    { id: 5, name: "Optional Add-ons" },
    { id: 6, name: "Cost Summary" },
    { id: 7, name: "Preview Quote" },
  ];

  const handleStepClick = (stepId: number) => {
    // Only allow navigating to steps that are less than or equal to current step
    // This prevents skipping ahead to steps that require previous steps' data
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/quotes" className="transition-colors hover:text-foreground">
                Quotes
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/quotes/new" className="transition-colors hover:text-foreground">
                New Quote
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Quote</h1>
            <p className="text-gray-500">Step {currentStep} of {totalSteps}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Button>
        </div>

        <QuoteProgressSteps 
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <QuoteProvider>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{steps.find(s => s.id === currentStep)?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && <CustomerInfoStep onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <SelectPoolStep onNext={() => setCurrentStep(3)} onPrevious={() => setCurrentStep(1)} />}
              {currentStep === 3 && <SiteRequirementsStep onNext={() => setCurrentStep(4)} onPrevious={() => setCurrentStep(2)} />}
              {currentStep === 4 && <ExtraPavingStep onNext={() => setCurrentStep(5)} onPrevious={() => setCurrentStep(3)} />}
              {currentStep === 5 && <OptionalAddonsStep onNext={() => setCurrentStep(6)} onPrevious={() => setCurrentStep(4)} />}
              {currentStep === 6 && <CostSummaryStep onNext={() => setCurrentStep(7)} onPrevious={() => setCurrentStep(5)} />}
              {currentStep === 7 && <PreviewQuoteStep onPrevious={() => setCurrentStep(6)} />}
            </CardContent>
          </Card>
        </QuoteProvider>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuote;
