
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const NoPoolWarning = () => {
  return (
    <Card className="border-amber-300 bg-amber-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">No pool selected</h3>
            <p className="text-sm text-amber-700 mt-1">
              You haven't selected a pool yet. Some calculations may not be available.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
