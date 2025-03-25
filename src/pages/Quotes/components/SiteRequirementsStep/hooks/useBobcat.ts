
import { useState } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useBobcat = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [bobcatId, setBobcatId] = useState<string | undefined>(quoteData.bobcat_id);

  const handleBobcatChange = (selectedBobcatId: string) => {
    setBobcatId(selectedBobcatId === "none" ? undefined : selectedBobcatId);
    updateQuoteData({ 
      bobcat_id: selectedBobcatId === "none" ? undefined : selectedBobcatId 
    });
  };

  return {
    bobcatId,
    handleBobcatChange,
  };
};
