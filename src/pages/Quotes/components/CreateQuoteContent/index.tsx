
import { useState } from "react";
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
import { QuoteProvider } from "@/pages/Quotes/context/QuoteContext";
import { QuoteProgressSteps } from "@/pages/Quotes/components/QuoteProgressSteps";
import { QuoteStepContent } from "@/pages/Quotes/components/QuoteStepContent";
import { QUOTE_STEPS } from "@/pages/Quotes/hooks/useQuoteSteps";

export const CreateQuoteContent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = QUOTE_STEPS.length;

  const handleStepClick = (stepId: number) => {
    // Only allow navigating to steps that are less than or equal to current step
    // This prevents skipping ahead to steps that require previous steps' data
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
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
        steps={QUOTE_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      <QuoteProvider>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{QUOTE_STEPS.find(s => s.id === currentStep)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteStepContent 
              currentStep={currentStep} 
              onNext={handleNext} 
              onPrevious={handlePrevious} 
            />
          </CardContent>
        </Card>
      </QuoteProvider>
    </div>
  );
};
