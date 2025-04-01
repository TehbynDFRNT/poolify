
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Quotes = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Quote
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No quotes yet</h3>
              <p className="text-muted-foreground mt-1">Create your first quote to get started</p>
              <Button className="mt-4 flex mx-auto items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Quotes;
