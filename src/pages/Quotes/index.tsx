
import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuotes } from "@/hooks/useQuotes";
import { QuotesHeader } from "./components/QuotesHeader";
import { QuotesTable } from "./components/QuotesTable";
import { DeleteQuoteDialog } from "./components/DeleteQuoteDialog";
import { PlusCircle } from "lucide-react";

const Quotes = () => {
  const navigate = useNavigate();
  const { 
    data: quotes, 
    isLoading, 
    error, 
    refetch, 
    deleteQuote, 
    isDeletingQuote 
  } = useQuotes();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const handleDeleteClick = (quoteId: string) => {
    setQuoteToDelete(quoteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (quoteToDelete) {
      deleteQuote(quoteToDelete);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleEditQuote = (quoteId: string) => {
    navigate(`/quotes/edit/${quoteId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <QuotesHeader />

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <QuotesTable
              quotes={quotes}
              isLoading={isLoading}
              error={error}
              refetch={refetch}
              onDeleteClick={handleDeleteClick}
              onEditQuote={handleEditQuote}
            />
          </CardContent>
        </Card>
      </div>

      <DeleteQuoteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeletingQuote}
      />
    </DashboardLayout>
  );
};

export default Quotes;
