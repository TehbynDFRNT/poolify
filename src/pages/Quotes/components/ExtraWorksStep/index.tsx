
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ExtraWorksStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraWorksStep = ({ onNext, onPrevious }: ExtraWorksStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Extra Works functionality is coming soon");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium">Extra Works Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              This feature is currently under development. You will be able to add additional works and services here in a future update.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
};
