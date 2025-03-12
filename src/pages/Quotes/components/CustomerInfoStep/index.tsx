
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
}

export const CustomerInfoStep = ({ onNext }: CustomerInfoStepProps) => {
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
        pool_id: quoteData.pool_id
      };
      
      // Check if a quote with this customer email already exists
      const { data: existingQuotes, error: fetchError } = await supabase
        .from('quotes')
        .select('id')
        .eq('customer_email', dataToSave.customer_email)
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        throw fetchError;
      }
      
      let saveResult;
      
      if (existingQuotes && existingQuotes.length > 0) {
        // Update the existing quote
        const quoteId = existingQuotes[0].id;
        saveResult = await supabase
          .from('quotes')
          .update(dataToSave)
          .eq('id', quoteId);
        
        if (saveResult.error) {
          throw saveResult.error;
        }
        
        toast.success('Quote information updated');
      } else {
        // Insert a new quote
        saveResult = await supabase
          .from('quotes')
          .insert(dataToSave);
          
        if (saveResult.error) {
          throw saveResult.error;
        }
        
        toast.success('New quote created');
      }
      
      setIsSubmitting(false);
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
      } else {
        toast.error('Failed to save quote information');
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
