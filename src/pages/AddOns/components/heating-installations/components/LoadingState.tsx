
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="animate-pulse">Loading heating installation data...</div>
      </CardContent>
    </Card>
  );
};
