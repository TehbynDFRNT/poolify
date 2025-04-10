
import React from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface ElectricalPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const ElectricalPlaceholder: React.FC<ElectricalPlaceholderProps> = ({ pool, customerId }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Electrical Requirements</h2>
      </div>
      
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-medium">Electrical Specifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure electrical requirements for your pool installation
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-primary/5 p-4 rounded-full mb-4">
              <Zap className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Electrical Options Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              We're currently developing the electrical configuration options for pool installations.
              This feature will allow you to specify power requirements, lighting options, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
