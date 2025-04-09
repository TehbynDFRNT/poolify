
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const RetainingWallsFormulas = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mt-8">
      <CardHeader className="bg-white pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Retaining Walls Formulas</CardTitle>
        </div>
        <CardDescription>
          Reference formulas for calculating retaining wall costs
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium hover:underline">
            <span>Retaining Wall Cost Calculation</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="rounded-md bg-muted p-4">
              <p className="mb-2 text-sm font-medium">Formula:</p>
              <p className="text-sm mb-4">Total Cost = Base Rate + Extra Rate + Margin</p>
              
              <p className="mb-2 text-sm font-medium">Placeholder for detailed calculations:</p>
              <p className="text-sm text-muted-foreground">
                This section will be updated with specific formulas for different types of retaining walls.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
