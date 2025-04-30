
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

export const HeatPumpMatrix = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          <CardTitle>Heat Pump Matrix</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-6 text-center border border-dashed rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Heat Pump Matrix</h3>
          <p className="text-muted-foreground">
            This section will contain the heat pump matrix functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
