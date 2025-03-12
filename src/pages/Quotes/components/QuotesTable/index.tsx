
import { useNavigate } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";

type QuotesTableProps = {
  quotes: any[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  onDeleteClick: (quoteId: string) => void;
  onEditQuote: (quoteId: string) => void;
};

export const QuotesTable = ({
  quotes,
  isLoading,
  error,
  refetch,
  onDeleteClick,
  onEditQuote,
}: QuotesTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading quotes. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No quotes yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first quote.</p>
        <Button onClick={() => navigate('/quotes/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Pool</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => (
          <TableRow key={quote.id}>
            <TableCell className="font-medium">
              {format(new Date(quote.created_at), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              {quote.customer_name}
              <p className="text-xs text-gray-500">{quote.customer_email}</p>
            </TableCell>
            <TableCell>
              {quote.pool ? (
                <>
                  <span>{quote.pool.name}</span>
                  <p className="text-xs text-gray-500">{quote.pool.range}</p>
                </>
              ) : (
                <span className="text-gray-500">No pool selected</span>
              )}
            </TableCell>
            <TableCell>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {quote.status}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {quote.pool && quote.pool.buy_price_inc_gst ? 
                formatCurrency(quote.pool.buy_price_inc_gst) : 
                '—'}
            </TableCell>
            <TableCell className="text-right flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditQuote(quote.id)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDeleteClick(quote.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
