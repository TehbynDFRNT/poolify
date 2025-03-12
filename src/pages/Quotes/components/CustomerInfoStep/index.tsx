
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { z } from "zod";
import { OwnerFormSection } from "./OwnerFormSection";
import { AddressFormSection } from "./AddressFormSection";
import { ResidentHomeownerCheckbox } from "./ResidentHomeownerCheckbox";

const customerInfoSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(1, "Phone number is required"),
  owner2_name: z.string().optional(),
  owner2_email: z.string().email("Invalid email address").optional(),
  owner2_phone: z.string().optional(),
  home_address: z.string().min(1, "Home address is required"),
  site_address: z.string().min(1, "Site address is required"),
  resident_homeowner: z.boolean().optional(),
});

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

interface CustomerInfoStepProps {
  onNext: () => void;
}

export const CustomerInfoStep = ({ onNext }: CustomerInfoStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfoFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateQuoteData({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name as keyof CustomerInfoFormData]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name as keyof CustomerInfoFormData];
        return updated;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateQuoteData({ resident_homeowner: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      customerInfoSchema.parse(quoteData);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CustomerInfoFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CustomerInfoFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

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
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
};
