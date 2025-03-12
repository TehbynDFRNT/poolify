import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { QuoteProvider } from "@/pages/Quotes/context/QuoteContext";
import { CustomerInfoStep } from "@/pages/Quotes/components/CustomerInfoStep";
import { SelectPoolStep } from "@/pages/Quotes/components/SelectPoolStep";
import { AddFeaturesStep } from "@/pages/Quotes/components/AddFeaturesStep";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "./context/QuoteContext";
import { QuoteBreadcrumbs } from "./components/QuoteBreadcrumbs";
import { QuoteProgressSteps } from "./components/QuoteProgressSteps";
import { QuoteLoadingState } from "./components/QuoteLoadingState";
import { QuoteErrorState } from "./components/QuoteErrorState";
import type { Quote } from "@/types/quote";

const steps = [
  { id: 1, name: "Customer Info" },
  { id: 2, name: "Select Base Pool" },
  { id: 3, name: "Add Features" },
  { id: 4, name: "Cost Summary" },
  { id: 5, name: "Preview Quote" },
];

const EditQuoteContent = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { updateQuoteData } = useQuoteContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (!quoteId) {
        setError("No quote ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", quoteId)
          .single();

        if (quoteError) {
          console.error("Error fetching quote:", quoteError);
          setError("Error loading quote data");
          setIsLoading(false);
          return;
        }

        const validStatus: Quote['status'] = 
          quoteData.status === 'draft' || 
          quoteData.status === 'pending' || 
          quoteData.status === 'approved' || 
          quoteData.status === 'declined' 
            ? quoteData.status 
            : 'draft';

        updateQuoteData({
          id: quoteData.id,
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          customer_phone: quoteData.customer_phone,
          owner2_name: quoteData.owner2_name,
          owner2_email: quoteData.owner2_email,
          owner2_phone: quoteData.owner2_phone,
          home_address: quoteData.home_address,
          site_address: quoteData.site_address,
          pool_id: quoteData.pool_id,
          status: validStatus,
          resident_homeowner: quoteData.resident_homeowner,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error in fetchQuoteData:", err);
        setError("Failed to load quote data");
        setIsLoading(false);
      }
    };

    fetchQuoteData();
  }, [quoteId, updateQuoteData]);

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  if (isLoading) {
    return <QuoteLoadingState />;
  }

  if (error) {
    return <QuoteErrorState error={error} />;
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
          onStepClick={handleStepClick}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{steps.find(s => s.id === currentStep)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <CustomerInfoStep onNext={() => setCurrentStep(2)} isEditing={true} />}
            {currentStep === 2 && <SelectPoolStep onNext={() => setCurrentStep(3)} onPrevious={() => setCurrentStep(1)} />}
            {currentStep === 3 && <AddFeaturesStep onNext={() => setCurrentStep(4)} onPrevious={() => setCurrentStep(2)} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const EditQuote = () => {
  return (
    <DashboardLayout>
      <QuoteProvider>
        <EditQuoteContent />
      </QuoteProvider>
    </DashboardLayout>
  );
};

export default EditQuote;
