
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PoolSpecificCosts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Specific Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-8 text-center text-muted-foreground">
          Pool specific costs information will be displayed here
        </div>
      </CardContent>
    </Card>
  );
};
