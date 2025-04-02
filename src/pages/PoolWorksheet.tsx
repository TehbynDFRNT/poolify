
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PoolWorksheet = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Pool Worksheet</h1>
        
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">Pool Worksheet</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a placeholder for the Pool Worksheet functionality. This area will contain tools for managing and creating pool worksheets.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
