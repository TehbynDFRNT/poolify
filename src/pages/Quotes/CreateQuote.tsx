
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
import { AddFeaturesStep } from "@/pages/Quotes/components/AddFeaturesStep";
import { cn } from "@/lib/utils";

const CreateQuote = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, name: "Customer Info" },
    { id: 2, name: "Select Base Pool" },
    { id: 3, name: "Add Features" },
    { id: 4, name: "Cost Summary" },
    { id: 5, name: "Preview Quote" },
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

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  className={cn(
                    "flex items-center focus:outline-none",
                    // If step is not accessible (future step), make it look disabled
                    step.id > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"
                  )}
                  disabled={step.id > currentStep}
                  aria-current={currentStep === step.id ? "step" : undefined}
                >
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <div className={`ml-2 text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-grow mx-2 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'}`} style={{width: '2rem'}}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <QuoteProvider>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{steps.find(s => s.id === currentStep)?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && <CustomerInfoStep onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <SelectPoolStep onNext={() => setCurrentStep(3)} onPrevious={() => setCurrentStep(1)} />}
              {currentStep === 3 && <AddFeaturesStep onNext={() => setCurrentStep(4)} onPrevious={() => setCurrentStep(2)} />}
              {/* We'll add more step components in the next iterations */}
            </CardContent>
          </Card>
        </QuoteProvider>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuote;
