
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ExtraWorksStep = ({ onNext, onPrevious }: { onNext?: () => void; onPrevious?: () => void }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Extra Works</CardTitle>
          <CardDescription>This section has been reset and is being rebuilt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <p>The Extra Works functionality is currently unavailable and is being rebuilt.</p>
          </div>

          <div className="flex justify-between items-center pt-6 mt-8 border-t">
            <div></div>
            <div className="flex space-x-2">
              {onPrevious && (
                <Button variant="outline" onClick={onPrevious}>
                  Previous
                </Button>
              )}
              <Button 
                onClick={onNext}
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtraWorksStep;
