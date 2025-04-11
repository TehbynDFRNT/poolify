
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="animate-pulse">Loading heat pump products...</div>
      </CardContent>
    </Card>
  );
};
