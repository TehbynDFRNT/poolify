
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HeatingInstallation } from "@/types/heating-installation";

interface DeleteConfirmDialogProps {
  installation: HeatingInstallation | null;
  onOpenChange: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({
  installation,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  if (!installation) return null;

  return (
    <AlertDialog open={!!installation} onOpenChange={() => onOpenChange()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Heating Installation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{installation.installation_type}&quot; installation? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
