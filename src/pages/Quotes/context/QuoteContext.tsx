import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quote, QuoteInsert } from '@/types/quote';

type QuoteContextType = {
  quoteData: Partial<QuoteInsert> & { id?: string };
  updateQuoteData: (data: Partial<QuoteInsert> & { id?: string }) => void;
  resetQuoteData: () => void;
};

const initialQuoteData: Partial<QuoteInsert> & { id?: string } = {
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
  
  // Cost tracking (adding as 0 defaults)
  site_requirements_cost: 0,
  optional_addons_cost: 0,
  total_cost: 0,
  
  // Custom requirements and micro dig (adding as empty defaults)
  custom_requirements_json: '',
  micro_dig_required: false,
  micro_dig_price: 0,
  micro_dig_notes: ''
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quoteData, setQuoteData] = useState<Partial<QuoteInsert> & { id?: string }>(initialQuoteData);

  const updateQuoteData = (data: Partial<QuoteInsert> & { id?: string }) => {
    setQuoteData(prev => ({ ...prev, ...data }));
  };

  const resetQuoteData = () => {
    setQuoteData(initialQuoteData);
  };

  return (
    <QuoteContext.Provider value={{ quoteData, updateQuoteData, resetQuoteData }}>
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
