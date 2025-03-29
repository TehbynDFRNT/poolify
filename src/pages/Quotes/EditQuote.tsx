
import { DashboardLayout } from "@/components/DashboardLayout";
import { QuoteProvider } from "@/pages/Quotes/context/QuoteContext";
import { EditQuoteContent } from "@/pages/Quotes/components/EditQuoteContent";

const EditQuote = () => {
  return (
    <DashboardLayout>
      <QuoteProvider>
        <EditQuoteContent />
      </QuoteProvider>
    </DashboardLayout>
  );
};

export default EditQuote;
