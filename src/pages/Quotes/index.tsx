
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, FileText } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuotes } from "@/hooks/useQuotes";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Quotes = () => {
  const navigate = useNavigate();
  const { data: quotes, isLoading, error } = useQuotes();

  const renderQuotesTable = () => {
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
        <div className="text-center py-8 text-red-500">
          <p>Error loading quotes. Please try again.</p>
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
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/quotes/${quote.id}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/quotes" className="transition-colors hover:text-foreground">
                Quotes
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Quotes</h1>
            <p className="text-gray-500">Create and manage customer quotes</p>
          </div>
          <Button onClick={() => navigate('/quotes/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Quote
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            {renderQuotesTable()}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Quotes;

