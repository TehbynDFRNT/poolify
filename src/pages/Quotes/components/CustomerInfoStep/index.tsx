
import { Button } from "@/components/ui/button";
import { OwnerFormSection } from "./OwnerFormSection";
import { AddressFormSection } from "./AddressFormSection";
import { ResidentHomeownerCheckbox } from "./ResidentHomeownerCheckbox";
import { useCustomerInfoForm } from "./useCustomerInfoForm";

interface CustomerInfoStepProps {
  onNext: () => void;
  isEditing?: boolean;
}

export const CustomerInfoStep = ({ onNext, isEditing = false }: CustomerInfoStepProps) => {
  const { 
    errors, 
    isSubmitting, 
    handleChange, 
    handleCheckboxChange, 
    handleSubmit 
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};
