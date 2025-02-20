
import { type DigType } from "@/types/excavation-dig-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DigTypeFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingDigType: DigType | null;
}

export const DigTypeForm = ({ onSubmit, editingDigType }: DigTypeFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingDigType ? "Edit Dig Type" : "Add New Dig Type"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={editingDigType?.name}
          />
        </div>
        <div>
          <label htmlFor="cost" className="text-sm font-medium">
            Cost
          </label>
          <Input
            id="cost"
            name="cost"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={editingDigType?.cost}
          />
        </div>
        <Button type="submit" className="w-full">
          {editingDigType ? "Update" : "Create"} Dig Type
        </Button>
      </form>
    </>
  );
};
