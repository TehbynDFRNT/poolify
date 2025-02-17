
import { Button } from "@/components/ui/button";
import { CostTable } from "./CostTable";
import type { CraneCost } from "@/types/crane-cost";
import type { TrafficControlCost } from "@/types/traffic-control-cost";

interface CostSectionProps {
  title: string;
  nameLabel: string;
  costs: (CraneCost | TrafficControlCost)[];
  isLoading: boolean;
  isAdding: boolean;
  editingId: string | null;
  editingPrice: string;
  onAddToggle: () => void;
  onEdit: (cost: CraneCost | TrafficControlCost) => void;
  onSave: (cost: CraneCost | TrafficControlCost) => void;
  onCancel: () => void;
  onPriceChange: (value: string) => void;
  AddForm: React.ComponentType<{ onSuccess: () => void }>;
}

export const CostSection = ({
  title,
  nameLabel,
  costs,
  isLoading,
  isAdding,
  editingId,
  editingPrice,
  onAddToggle,
  onEdit,
  onSave,
  onCancel,
  onPriceChange,
  AddForm,
}: CostSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Button
          variant="outline"
          onClick={onAddToggle}
        >
          {isAdding ? "Cancel" : `Add New ${title}`}
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <AddForm onSuccess={onAddToggle} />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading costs...</p>
      ) : (
        <CostTable
          costs={costs}
          editingId={editingId}
          editingPrice={editingPrice}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onPriceChange={onPriceChange}
          nameLabel={nameLabel}
        />
      )}
    </div>
  );
};
