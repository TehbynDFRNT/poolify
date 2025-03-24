
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const NoPoolWarning = () => {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="flex items-start p-4 gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-amber-800">
            No pool has been selected. Site requirements are specific to the pool model.
            You can continue, but you may need to adjust these settings later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
