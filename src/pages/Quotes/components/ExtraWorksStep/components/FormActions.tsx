
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  onPrevious?: () => void;
  onSaveOnly: () => void;
  onSaveAndContinue: () => void;
  isSaving: boolean;
  totalCost: number;
}

export const FormActions = ({ 
  onPrevious, 
  onSaveOnly, 
  onSaveAndContinue, 
  isSaving,
  totalCost
}: FormActionsProps) => {
  return (
    <div className="flex justify-between items-center pt-6 mt-8 border-t">
      <div className="text-lg font-medium">
        Total Extra Works Cost: <span className="font-semibold">${totalCost.toFixed(2)}</span>
      </div>
      <div className="flex space-x-2">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
            Previous
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={onSaveOnly}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button 
          onClick={onSaveAndContinue}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};
