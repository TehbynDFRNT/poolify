
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ActionButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const ActionButtons = ({
  onPrevious,
  onSave,
  onSubmit,
  isSubmitting,
  isDisabled
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline"
        onClick={onPrevious}
      >
        Back
      </Button>
      <div className="space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSave}
          disabled={isSubmitting || isDisabled}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};
