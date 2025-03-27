
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { HardHat } from "lucide-react";

interface ExtraConcretingProps {
  onChanged?: () => void;
}

export const ExtraConcreting = React.forwardRef<HTMLDivElement, ExtraConcretingProps>(
  ({ onChanged }, ref) => {
    return (
      <Card className="border border-gray-200" ref={ref}>
        <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Extra Concreting</h3>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-md border border-dashed border-gray-300">
            <p className="text-muted-foreground text-center">
              This section will be used for additional concreting options.
            </p>
            <p className="text-muted-foreground text-center text-sm mt-2">
              Coming soon: Concrete types, finishes, and special requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ExtraConcreting.displayName = "ExtraConcreting";
