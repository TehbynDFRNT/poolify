
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quote, QuoteInsert } from '@/types/quote';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

type QuoteContextType = {
  quoteData: Partial<Quote>;
  updateQuoteData: (data: Partial<Quote>) => void;
  resetQuoteData: () => void;
  refreshQuoteData: () => Promise<void>;
  isLoading: boolean;
};

const initialQuoteData: Partial<Quote> = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  owner2_name: '',
  owner2_email: '',
  owner2_phone: '',
  home_address: '',
  site_address: '',
  status: 'draft',
  resident_homeowner: false,
  
  // Site requirements (adding as empty defaults)
  crane_id: '',
  excavation_type: '',
  traffic_control_id: 'none',
  bobcat_id: undefined,
  
  // Cost tracking (adding as 0 defaults)
  site_requirements_cost: 0,
  extra_paving_cost: 0,
  optional_addons_cost: 0,
  total_cost: 0,
  
  // Concrete related fields
  concrete_pump_required: false,
  concrete_pump_price: 0,
  concrete_cuts: '',
  concrete_cuts_cost: 0,
  
  // Micro dig (adding as empty defaults)
  micro_dig_required: false,
  micro_dig_price: 0,
  micro_dig_notes: '',
  
  // Paving on existing concrete
  existing_concrete_paving: '',
  existing_concrete_paving_cost: 0
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quoteData, setQuoteData] = useState<Partial<Quote>>(initialQuoteData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { quoteId } = useParams<{ quoteId: string }>();

  // Load quote data when provider mounts or quoteId changes
  useEffect(() => {
    if (quoteId) {
      refreshQuoteData();
    } else {
      setIsLoading(false);
    }
  }, [quoteId]);

  const updateQuoteData = (data: Partial<Quote>) => {
    setQuoteData(prev => ({ ...prev, ...data }));
  };

  const resetQuoteData = () => {
    setQuoteData(initialQuoteData);
  };

  const refreshQuoteData = async () => {
    // If editing an existing quote
    if (quoteId) {
      setIsLoading(true);
      try {
        console.log("Refreshing quote data for ID:", quoteId);
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();

        if (error) {
          console.error("Error refreshing quote data:", error);
          toast.error("Failed to refresh quote data");
          throw error;
        }

        if (data) {
          console.log("Refreshed quote data:", data);
          setQuoteData(data as Partial<Quote>);
        }
      } catch (error) {
        console.error("Error in refreshQuoteData:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <QuoteContext.Provider value={{ 
      quoteData, 
      updateQuoteData, 
      resetQuoteData, 
      refreshQuoteData,
      isLoading
    }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuoteContext = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuoteContext must be used within a QuoteProvider');
  }
  return context;
};
