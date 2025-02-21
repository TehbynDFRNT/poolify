
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const QuoteGeneration = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/sales-builder">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Quote Generation</h1>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground">
            Create and manage quotes for your pool projects. Generate professional quotes with accurate pricing and detailed specifications.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Quotes</h2>
          <Link to="/sales-builder/quotes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </Link>
        </div>

        <div className="bg-muted/10 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No quotes yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first quote
          </p>
          <Link to="/sales-builder/quotes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Quote
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuoteGeneration;
