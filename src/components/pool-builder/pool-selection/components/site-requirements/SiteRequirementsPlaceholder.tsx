import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteRequirementsGuarded } from "@/hooks/useSiteRequirementsGuarded";
import { Pool } from "@/types/pool";
import { Construction, MapPin } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { SiteRequirementsForm } from "./SiteRequirementsForm";

interface SiteRequirementsPlaceholderProps {
  pool: Pool;
  customerId?: string | null;
}

export const SiteRequirementsPlaceholder: React.FC<SiteRequirementsPlaceholderProps> = ({
  pool,
  customerId
}) => {
  const { saveSiteRequirements, isSubmitting, StatusWarningDialog } = useSiteRequirementsGuarded(customerId || '');

  const handleSave = async (formData: any) => {
    if (!customerId) {
      toast.error("Please save customer information first");
      return;
    }

    await saveSiteRequirements(formData);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-secondary/50 pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Site Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {!customerId ? (
            <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
              <Construction className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Please Save Customer Information First</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Site requirements need to be associated with a customer record.
                Please complete and save the customer information in the Customer Info tab.
              </p>
            </div>
          ) : (
            <SiteRequirementsForm
              pool={pool}
              customerId={customerId}
              onSave={handleSave}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
      <StatusWarningDialog />
    </div>
  );
};
