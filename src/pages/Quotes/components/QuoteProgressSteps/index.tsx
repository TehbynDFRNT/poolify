
import { cn } from "@/lib/utils";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { formatCurrency } from "@/utils/format";

interface Step {
  id: number;
  name: string;
}

interface QuoteProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export const QuoteProgressSteps = ({ steps, currentStep, onStepClick }: QuoteProgressStepsProps) => {
  const { quoteData } = useQuoteContext();
  
  // Function to get cost for each step
  const getStepCost = (stepId: number): number => {
    switch (stepId) {
      case 2: // Base Pool
        return quoteData.base_pool_cost || 0;
      case 3: // Site Requirements
        return quoteData.site_requirements_cost || 0;
      case 4: // Extra Paving
        return quoteData.extra_paving_cost || 0;
      case 5: // Optional Add-ons
        return quoteData.optional_addons_cost || 0;
      case 6: // Cost Summary
        return quoteData.total_cost || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, idx) => {
          const stepCost = getStepCost(step.id);
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "flex items-center focus:outline-none",
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
              
              {step.id >= 2 && (
                <div className="text-xs mt-1 font-medium text-gray-600">
                  {formatCurrency(stepCost)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
