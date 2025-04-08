
import React from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Construction } from "lucide-react";

interface SiteRequirementsPlaceholderProps {
  pool: Pool;
  customerId?: string | null;
}

export const SiteRequirementsPlaceholder: React.FC<SiteRequirementsPlaceholderProps> = ({ 
  pool, 
  customerId 
}) => {
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
          <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
            <Construction className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">Site Requirements Placeholder</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This section will include site-specific requirements for the pool installation
              such as crane requirements, excavation details, access information, and other
              site-specific considerations.
            </p>
            
            {!customerId && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm inline-block">
                <p>Please save customer information first to enable this feature.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
