
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "../../context/QuoteContext";
import { customerInfoSchema } from "./customerInfoSchema";

type CustomerInfoValues = z.infer<typeof customerInfoSchema>;

interface UseCustomerInfoFormProps {
  onNext?: () => void;
  isEditing?: boolean;
}

export const useCustomerInfoForm = ({ onNext, isEditing = false }: UseCustomerInfoFormProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSecondOwner, setShowSecondOwner] = useState(
    !!(quoteData.owner2_name || quoteData.owner2_email || quoteData.owner2_phone)
  );

  const form = useForm<CustomerInfoValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customer_name: quoteData.customer_name || "",
      customer_email: quoteData.customer_email || "",
      customer_phone: quoteData.customer_phone || "",
      owner2_name: quoteData.owner2_name || "",
      owner2_email: quoteData.owner2_email || "",
      owner2_phone: quoteData.owner2_phone || "",
      home_address: quoteData.home_address || "",
      site_address: quoteData.site_address || "",
      resident_homeowner: quoteData.resident_homeowner || false,
    },
  });

  const toggleSecondOwner = () => {
    setShowSecondOwner(!showSecondOwner);
    
    // Clear second owner fields if toggling off
    if (showSecondOwner) {
      form.setValue("owner2_name", "");
      form.setValue("owner2_email", "");
      form.setValue("owner2_phone", "");
    }
  };

  const saveData = async (data: CustomerInfoValues) => {
    setIsSubmitting(true);

    try {
      // Update the context with form data
      updateQuoteData({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        owner2_name: data.owner2_name,
        owner2_email: data.owner2_email,
        owner2_phone: data.owner2_phone,
        home_address: data.home_address,
        site_address: data.site_address,
        resident_homeowner: data.resident_homeowner,
      });

      if (isEditing && quoteData.id) {
        // Update existing quote
        const { error } = await supabase
          .from('quotes')
          .update({
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            owner2_name: data.owner2_name || null,
            owner2_email: data.owner2_email || null,
            owner2_phone: data.owner2_phone || null,
            home_address: data.home_address,
            site_address: data.site_address,
            resident_homeowner: data.resident_homeowner,
          })
          .eq('id', quoteData.id);

        if (error) {
          console.error("Error updating quote:", error);
          throw error;
        }

        toast.success("Quote updated successfully");
      } else {
        // Create new quote
        const { data: quoteResponse, error } = await supabase
          .from('quotes')
          .insert({
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            owner2_name: data.owner2_name || null,
            owner2_email: data.owner2_email || null,
            owner2_phone: data.owner2_phone || null,
            home_address: data.home_address,
            site_address: data.site_address,
            status: 'draft',
            resident_homeowner: data.resident_homeowner,
            micro_dig_required: false,
            micro_dig_price: 0,
          })
          .select('id')
          .single();

        if (error) {
          console.error("Error creating quote:", error);
          throw error;
        }

        // Update context with the new quote ID
        updateQuoteData({ id: quoteResponse.id });
        toast.success("Quote created successfully");
      }

      setIsSubmitting(false);
      if (onNext) onNext();
    } catch (error) {
      console.error("Error saving quote:", error);
      toast.error("Failed to save customer information");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(saveData)();
  };

  return {
    form,
    isSubmitting,
    showSecondOwner,
    toggleSecondOwner,
    handleSubmit,
  };
};
