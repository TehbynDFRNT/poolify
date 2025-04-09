
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Pool } from "@/types/pool";

interface RetainingWallsPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const RetainingWallsPlaceholder: React.FC<RetainingWallsPlaceholderProps> = ({ 
  pool, 
  customerId 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Fence className="h-5 w-5 text-primary" />
            <CardTitle>Retaining Walls</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
            <Fence className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">Retaining Walls Configuration</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature is coming soon. You will be able to configure retaining wall options for your pool project here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
