
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

interface HeatPumpTableHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const HeatPumpTableHeader: React.FC<HeatPumpTableHeaderProps> = ({
  title,
  children,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          {children}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          Manage heat pump products and their compatibility with pool models.
          Heat pumps can be assigned to one or more pool models.
        </p>
      </CardContent>
    </Card>
  );
};
