
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add New Heat Pump
    </Button>
  );
};
