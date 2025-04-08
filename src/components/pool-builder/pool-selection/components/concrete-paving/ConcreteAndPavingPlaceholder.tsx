
import React from "react";
import { Pool } from "@/types/pool";
import { SiteRequirementsFormHeader } from "../site-requirements/SiteRequirementsFormHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Scissors, Shovel } from "lucide-react";
import { LoadingIndicator } from "../site-requirements/LoadingIndicator";
import { ConcreteAndPavingForm } from "./ConcreteAndPavingForm";

interface ConcreteAndPavingPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const ConcreteAndPavingPlaceholder: React.FC<ConcreteAndPavingPlaceholderProps> = ({
  pool,
  customerId,
}) => {
  if (!customerId) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
        <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">Customer Information Required</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please save the customer information first to enable concrete and paving options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Concrete & Paving Options</h2>
        </div>
      </div>

      <Card>
        <SiteRequirementsFormHeader
          title="Concrete & Paving"
          icon={<Layers className="h-5 w-5 text-primary" />}
        />
        <CardContent>
          <ConcreteAndPavingForm pool={pool} customerId={customerId} />
        </CardContent>
      </Card>
    </div>
  );
};
