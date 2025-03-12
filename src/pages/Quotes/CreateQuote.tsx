
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

const CreateQuote = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, name: "Customer Info" },
    { id: 2, name: "Select Pool" },
    { id: 3, name: "Add Features" },
    { id: 4, name: "Cost Summary" },
    { id: 5, name: "Preview Quote" },
  ];

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
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className={`ml-2 text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.name}
                </div>
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
              {/* We'll add more step components in the next iterations */}
            </CardContent>
          </Card>
        </QuoteProvider>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuote;
