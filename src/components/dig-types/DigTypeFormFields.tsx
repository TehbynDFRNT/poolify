
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DigTypeFormFieldsProps {
  formData: {
    name: string;
    truck_quantity: string;
    truck_hourly_rate: string;
    truck_hours: string;
    excavation_hourly_rate: string;
    excavation_hours: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DigTypeFormFields({ formData, onChange }: DigTypeFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="truck_quantity">Number of Trucks *</Label>
        <Input
          id="truck_quantity"
          name="truck_quantity"
          type="number"
          value={formData.truck_quantity}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="truck_hourly_rate">Truck Hourly Rate *</Label>
        <Input
          id="truck_hourly_rate"
          name="truck_hourly_rate"
          type="number"
          step="0.01"
          value={formData.truck_hourly_rate}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="truck_hours">Truck Hours *</Label>
        <Input
          id="truck_hours"
          name="truck_hours"
          type="number"
          value={formData.truck_hours}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excavation_hourly_rate">Excavation Hourly Rate *</Label>
        <Input
          id="excavation_hourly_rate"
          name="excavation_hourly_rate"
          type="number"
          step="0.01"
          value={formData.excavation_hourly_rate}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excavation_hours">Excavation Hours *</Label>
        <Input
          id="excavation_hours"
          name="excavation_hours"
          type="number"
          value={formData.excavation_hours}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
}
