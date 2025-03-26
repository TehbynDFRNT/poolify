
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({
  onNext,
  onPrevious,
}: ExtraPavingConcreteStepProps) => {
  return (
    <div>
      <Card className="border border-gray-200">
        <CardHeader className="bg-white pb-2">
          <h2 className="text-xl font-semibold">Extra Paving & Concrete</h2>
          <p className="text-gray-500">Placeholder for paving and concrete options</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border-t mt-2 pt-4">
            <p className="text-gray-700 mb-8">
              This is a placeholder for the Extra Paving & Concrete step. 
              Additional content will be added in future updates.
            </p>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={onPrevious}
              >
                Previous
              </Button>
              <Button onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
