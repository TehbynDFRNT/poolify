
import React from "react";
import { Fence } from "lucide-react";
import { Pool } from "@/types/pool";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FramelessGlassFencing } from "./FramelessGlassFencing";
import FencingHeader from "./components/FencingHeader";
import FencingAlert from "./components/FencingAlert";

interface FencingPlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const FencingPlaceholder: React.FC<FencingPlaceholderProps> = ({ pool, customerId }) => {
  if (!pool) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
        <Fence className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">Please Select a Pool First</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Fencing options are specific to the pool model. Please select a pool in the Pool Selection tab to view fencing options.
        </p>
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="space-y-6">
        <FencingHeader />
        
        <Card>
          <CardContent className="p-6">
            <FencingAlert 
              variant="warning"
              description="Please save customer information before configuring fencing options."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <FramelessGlassFencing pool={pool} customerId={customerId} />;
};
