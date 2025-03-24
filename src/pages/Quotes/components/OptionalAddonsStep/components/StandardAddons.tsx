
import { Card, CardContent } from "@/components/ui/card";

export const StandardAddons = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">
          Standard add-ons like pool cleaners, lighting systems, and heating solutions 
          will be available here in a future update.
        </p>
      </CardContent>
    </Card>
  );
};
