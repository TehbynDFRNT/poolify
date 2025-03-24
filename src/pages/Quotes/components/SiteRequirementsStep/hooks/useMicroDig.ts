
import { useState, useEffect } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useMicroDig = () => {
  const { quoteData } = useQuoteContext();
  const [microDigRequired, setMicroDigRequired] = useState(false);
  const [microDigPrice, setMicroDigPrice] = useState(0);
  const [microDigNotes, setMicroDigNotes] = useState("");

  // Initialize from context if values exist
  useEffect(() => {
    if (quoteData.micro_dig_required !== undefined) {
      setMicroDigRequired(quoteData.micro_dig_required);
    }
    
    if (quoteData.micro_dig_price !== undefined) {
      setMicroDigPrice(quoteData.micro_dig_price);
    }
    
    if (quoteData.micro_dig_notes) {
      setMicroDigNotes(quoteData.micro_dig_notes);
    }
  }, [quoteData.id]);

  return {
    microDigRequired,
    setMicroDigRequired,
    microDigPrice,
    setMicroDigPrice,
    microDigNotes,
    setMicroDigNotes
  };
};
