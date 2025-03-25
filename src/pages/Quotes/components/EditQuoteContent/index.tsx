
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuoteSteps } from "@/pages/Quotes/hooks/useQuoteSteps";
import { QuoteBreadcrumbs } from "@/pages/Quotes/components/QuoteBreadcrumbs";
import { QuoteProgressSteps } from "@/pages/Quotes/components/QuoteProgressSteps";
import { QuoteLoadingState } from "@/pages/Quotes/components/QuoteLoadingState";
import { QuoteErrorState } from "@/pages/Quotes/components/QuoteErrorState";
import { QuoteStepContent } from "@/pages/Quotes/components/QuoteStepContent";

export const EditQuoteContent = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentStep, 
    steps, 
    totalSteps, 
    isLoading, 
    error, 
    setCurrentStep, 
    nextStep, 
    previousStep, 
    handleRetry 
  } = useQuoteSteps(quoteId);

  if (isLoading) {
    return <QuoteLoadingState />;
  }

  if (error) {
    return <QuoteErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <QuoteBreadcrumbs quoteId={quoteId} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Quote</h1>
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
          onStepClick={setCurrentStep}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{steps.find(s => s.id === currentStep)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteStepContent 
              currentStep={currentStep} 
              onNext={nextStep} 
              onPrevious={previousStep} 
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
