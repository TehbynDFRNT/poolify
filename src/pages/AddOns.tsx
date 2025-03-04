
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

const AddOns = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pool Add-Ons</h1>
        </div>
        
        <Card className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Add-Ons Coming Soon</h2>
            <p className="text-muted-foreground">
              This section will contain pool add-ons and optional features. Check back later for updates.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
