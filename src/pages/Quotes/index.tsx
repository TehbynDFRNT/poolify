
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

const Quotes = () => {
  const navigate = useNavigate();

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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No quotes yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first quote.</p>
              <Button onClick={() => navigate('/quotes/new')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Quotes;
