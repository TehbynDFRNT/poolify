
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { QuoteProvider } from "@/pages/Quotes/context/QuoteContext";
import { EditQuoteContent } from "@/pages/Quotes/components/EditQuoteContent";

const EditQuote: React.FC = () => {
  return (
    <DashboardLayout>
      <QuoteProvider>
        <EditQuoteContent />
      </QuoteProvider>
    </DashboardLayout>
  );
};

export default React.memo(EditQuote);
