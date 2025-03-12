
import { cn } from "@/lib/utils";

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
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
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
        ))}
      </div>
    </div>
  );
};
