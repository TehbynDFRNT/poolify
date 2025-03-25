
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "../context/QuoteContext";
import { toast } from "sonner";

export const QUOTE_STEPS = [
  { id: 1, name: "Customer Info" },
  { id: 2, name: "Base Pool" },
  { id: 3, name: "Site Requirements" },
  { id: 4, name: "Extra Paving" },
  { id: 5, name: "Optional Add-ons" },
  { id: 6, name: "Cost Summary" },
  { id: 7, name: "Preview Quote" },
];

export interface QuoteStepsState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  dataLoaded: boolean;
  retryCount: number;
}

export const useQuoteSteps = (quoteId?: string) => {
  const [state, setState] = useState<QuoteStepsState>({
    currentStep: 1,
    isLoading: true,
    error: null,
    dataLoaded: false,
    retryCount: 0
  });
  
  const { updateQuoteData } = useQuoteContext();

  const setCurrentStep = (step: number) => {
    if (state.dataLoaded) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  };

  const nextStep = () => {
    if (state.currentStep < QUOTE_STEPS.length) {
      setCurrentStep(state.currentStep + 1);
    }
  };

  const previousStep = () => {
    if (state.currentStep > 1) {
      setCurrentStep(state.currentStep - 1);
    }
  };

  const handleRetry = () => {
    toast.info("Retrying connection...");
    setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
  };

  const fetchQuoteData = async () => {
    if (!quoteId) {
      setState(prev => ({ 
        ...prev, 
        error: "No quote ID provided", 
        isLoading: false 
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (quoteError) {
        console.error("Error fetching quote:", quoteError);
        setState(prev => ({ 
          ...prev, 
          error: "Error loading quote data. Please try again.", 
          isLoading: false 
        }));
        return;
      }

      const validStatus = 
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
        owner2_name: quoteData.owner2_name || '',
        owner2_email: quoteData.owner2_email || '',
        owner2_phone: quoteData.owner2_phone || '',
        home_address: quoteData.home_address,
        site_address: quoteData.site_address,
        pool_id: quoteData.pool_id || '',
        status: validStatus,
        resident_homeowner: quoteData.resident_homeowner || false,
        
        // Site requirements fields
        crane_id: quoteData.crane_id || '',
        excavation_type: quoteData.excavation_type || '',
        traffic_control_id: quoteData.traffic_control_id || 'none',
        site_requirements_cost: quoteData.site_requirements_cost || 0,
        
        // Extra paving
        extra_paving_cost: quoteData.extra_paving_cost || 0,
        
        // Optional addons
        optional_addons_cost: quoteData.optional_addons_cost || 0,
        total_cost: quoteData.total_cost || 0,
        
        // Micro dig data
        micro_dig_required: quoteData.micro_dig_required === true,
        micro_dig_price: quoteData.micro_dig_price || 0,
        micro_dig_notes: quoteData.micro_dig_notes || ''
      });

      setState(prev => ({ 
        ...prev, 
        dataLoaded: true, 
        isLoading: false 
      }));
    } catch (err) {
      console.error("Error in fetchQuoteData:", err);
      setState(prev => ({ 
        ...prev, 
        error: "Failed to load quote data. Network error or server unavailable.", 
        isLoading: false 
      }));
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, [quoteId, state.retryCount]);

  return {
    ...state,
    steps: QUOTE_STEPS,
    totalSteps: QUOTE_STEPS.length,
    setCurrentStep,
    nextStep,
    previousStep,
    handleRetry
  };
};
