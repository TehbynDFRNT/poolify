
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  onPrevious: () => void;
  onSaveOnly: () => void;
  onSaveAndContinue: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({ 
  onPrevious, 
  onSaveOnly, 
  onSaveAndContinue, 
  isSubmitting 
}: FormActionsProps) => {
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
          onClick={onSaveOnly}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button 
          type="button"
          onClick={onSaveAndContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};
