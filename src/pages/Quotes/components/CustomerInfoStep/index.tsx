
import { Button } from "@/components/ui/button";
import { OwnerFormSection } from "./OwnerFormSection";
import { AddressFormSection } from "./AddressFormSection";
import { ResidentHomeownerCheckbox } from "./ResidentHomeownerCheckbox";
import { useCustomerInfoForm } from "./useCustomerInfoForm";
import { useQuoteContext } from "../../context/QuoteContext";
import { Save } from "lucide-react";

interface CustomerInfoStepProps {
  onNext: () => void;
  isEditing?: boolean;
}

export const CustomerInfoStep = ({ onNext, isEditing = false }: CustomerInfoStepProps) => {
  const { quoteData } = useQuoteContext();
  const { 
    errors, 
    isSubmitting, 
    handleChange, 
    handleCheckboxChange, 
    handleSubmit,
    handleSaveOnly
  } = useCustomerInfoForm(onNext, isEditing);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <OwnerFormSection 
          ownerNumber={1} 
          errors={errors} 
          onChange={handleChange} 
        />
        
        <OwnerFormSection 
          ownerNumber={2} 
          errors={errors} 
          onChange={handleChange} 
        />

        <AddressFormSection 
          errors={errors} 
          onChange={handleChange} 
        />

        <ResidentHomeownerCheckbox 
          onCheckedChange={handleCheckboxChange} 
        />
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSaveOnly}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
};
