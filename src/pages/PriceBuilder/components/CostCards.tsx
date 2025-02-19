
import { List, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PoolSpecificCostsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Pool Specific Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <p>Pool specific costs and calculations will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const FixedCostsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Fixed Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <p>Fixed costs applied to all pools will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};
