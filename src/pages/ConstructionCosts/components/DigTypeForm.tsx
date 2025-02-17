
import { type ExcavationDigType } from "@/types/excavation-dig-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DigTypeFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingDigType: ExcavationDigType | null;
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="truck_count" className="text-sm font-medium">
              Truck Count (1-10)
            </label>
            <Input
              id="truck_count"
              name="truck_count"
              type="number"
              min="1"
              max="10"
              required
              defaultValue={editingDigType?.truck_count}
            />
          </div>
          <div>
            <label htmlFor="truck_hourly_rate" className="text-sm font-medium">
              Truck Rate ($/hr)
            </label>
            <Input
              id="truck_hourly_rate"
              name="truck_hourly_rate"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={editingDigType?.truck_hourly_rate}
            />
          </div>
          <div>
            <label htmlFor="truck_hours" className="text-sm font-medium">
              Truck Hours (1-24)
            </label>
            <Input
              id="truck_hours"
              name="truck_hours"
              type="number"
              min="1"
              max="24"
              required
              defaultValue={editingDigType?.truck_hours}
            />
          </div>
          <div>
            <label htmlFor="excavation_hourly_rate" className="text-sm font-medium">
              Excavation Rate ($/hr)
            </label>
            <Input
              id="excavation_hourly_rate"
              name="excavation_hourly_rate"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={editingDigType?.excavation_hourly_rate}
            />
          </div>
          <div>
            <label htmlFor="excavation_hours" className="text-sm font-medium">
              Excavation Hours (1-24)
            </label>
            <Input
              id="excavation_hours"
              name="excavation_hours"
              type="number"
              min="1"
              max="24"
              required
              defaultValue={editingDigType?.excavation_hours}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {editingDigType ? "Update" : "Create"} Dig Type
        </Button>
      </form>
    </>
  );
};
