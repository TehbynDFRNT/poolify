
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PricingStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Pricing functionality has been removed
      </p>
      
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="text-center p-8 text-muted-foreground">
            Price Builder module has been removed
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingStep;
