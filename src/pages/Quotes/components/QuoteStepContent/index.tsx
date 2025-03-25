
import { CustomerInfoStep } from "@/pages/Quotes/components/CustomerInfoStep";
import { SelectPoolStep } from "@/pages/Quotes/components/SelectPoolStep";
import { SiteRequirementsStep } from "@/pages/Quotes/components/SiteRequirementsStep";
import { ExtraPavingStep } from "@/pages/Quotes/components/ExtraPavingStep";
import { OptionalAddonsStep } from "@/pages/Quotes/components/OptionalAddonsStep";
import { CostSummaryStep } from "@/pages/Quotes/components/CostSummaryStep";
import { PreviewQuoteStep } from "@/pages/Quotes/components/PreviewQuoteStep";

interface QuoteStepContentProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuoteStepContent = ({ 
  currentStep, 
  onNext, 
  onPrevious 
}: QuoteStepContentProps) => {
  switch (currentStep) {
    case 1:
      return <CustomerInfoStep onNext={onNext} isEditing={true} />;
    case 2:
      return <SelectPoolStep onNext={onNext} onPrevious={onPrevious} />;
    case 3:
      return <SiteRequirementsStep onNext={onNext} onPrevious={onPrevious} />;
    case 4:
      return <ExtraPavingStep onNext={onNext} onPrevious={onPrevious} />;
    case 5:
      return <OptionalAddonsStep onNext={onNext} onPrevious={onPrevious} />;
    case 6:
      return <CostSummaryStep onNext={onNext} onPrevious={onPrevious} />;
    case 7:
      return <PreviewQuoteStep onPrevious={onPrevious} />;
    default:
      return <div>Invalid step</div>;
  }
};
