
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { z } from "zod";
import { OwnerFormSection } from "./OwnerFormSection";
import { AddressFormSection } from "./AddressFormSection";
import { ResidentHomeownerCheckbox } from "./ResidentHomeownerCheckbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  isEditing?: boolean;
}

export const CustomerInfoStep = ({ onNext, isEditing = false }: CustomerInfoStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfoFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      customerInfoSchema.parse(quoteData);
      setIsSubmitting(true);
      
      // Ensure we have the required fields with proper types for Supabase
      const dataToSave = {
        customer_name: quoteData.customer_name || "",
        customer_email: quoteData.customer_email || "",
        customer_phone: quoteData.customer_phone || "",
        home_address: quoteData.home_address || "",
        site_address: quoteData.site_address || "",
        status: 'draft' as const,
        // Optional fields
        owner2_name: quoteData.owner2_name,
        owner2_email: quoteData.owner2_email,
        owner2_phone: quoteData.owner2_phone,
        resident_homeowner: quoteData.resident_homeowner,
      };
      
      console.log("Saving quote data:", dataToSave);
      
      if (isEditing && quoteData.id) {
        // Update existing quote
        const { error } = await supabase
          .from('quotes')
          .update(dataToSave)
          .eq('id', quoteData.id);
          
        if (error) {
          console.error("Error updating quote:", error);
          throw error;
        }
        
        toast.success('Quote updated successfully');
        setIsSubmitting(false);
        onNext();
      } else {
        // Create a new quote
        const { data, error } = await supabase
          .from('quotes')
          .insert(dataToSave)
          .select('id')
          .single();
          
        if (error) {
          console.error("Error saving quote:", error);
          throw error;
        }
        
        // Update the quote ID in the context
        if (data) {
          console.log("Quote created with ID:", data.id);
          updateQuoteData({ id: data.id });
          toast.success('New quote created successfully');
          // Only proceed to next step after successful save
          setIsSubmitting(false);
          onNext();
        } else {
          throw new Error("No data returned from quote creation");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CustomerInfoFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CustomerInfoFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error(isEditing ? 'Failed to update quote information' : 'Failed to save quote information');
        console.error('Error saving quote:', error);
      }
      setIsSubmitting(false);
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};
