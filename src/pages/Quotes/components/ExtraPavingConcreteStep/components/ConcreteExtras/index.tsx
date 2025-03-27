
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashedBottom } from "lucide-react";

export const ConcreteExtras: React.FC = () => {
  return (
    <Card className="border border-gray-200 mt-6">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashedBottom className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium">Concrete Extras</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="py-4 text-center text-gray-500">
          <p>This section will contain additional concrete options and customizations.</p>
          <p className="text-sm mt-2">Coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
