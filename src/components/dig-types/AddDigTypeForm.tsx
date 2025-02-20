
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DigTypeFormFields } from "./DigTypeFormFields";
import { useDigTypeForm } from "@/hooks/useDigTypeForm";

interface AddDigTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDigTypeForm({ open, onOpenChange }: AddDigTypeFormProps) {
  const { formData, isSubmitting, handleSubmit, handleChange } = useDigTypeForm(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Dig Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DigTypeFormFields 
            formData={formData}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Dig Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
