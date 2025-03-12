
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AddFeaturesStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const AddFeaturesStep = ({ onNext, onPrevious }: AddFeaturesStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We'll need to check if a pool was selected before proceeding
  if (!quoteData.pool_id) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Please select a pool before adding features</p>
        <Button onClick={onPrevious}>Go Back to Select Pool</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Here we'll eventually save the selected features
      toast.success("Features saved");
      onNext();
    } catch (error) {
      toast.error("Failed to save features");
      console.error("Error saving features:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Add Features</h3>
            <p className="text-gray-500 mb-4">This is where you'll be able to add various features to the selected pool.</p>
            
            <div className="space-y-4">
              <div>
                <Label>Features will be implemented here</Label>
                <p className="text-sm text-gray-500 mt-1">
                  You're currently developing this part of the application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};
