
import { Button } from "@/components/ui/button";
import { AddBobcatCostForm } from "./AddBobcatCostForm";
import { BobcatCostTable } from "./BobcatCostTable";
import type { BobcatCost } from "@/types/bobcat-cost";

interface BobcatCostGroupProps {
  sizeCategory: string;
  costs: BobcatCost[];
  editingId: string | null;
  editingPrice: string;
  addingToCategory: string | null;
  onEdit: (cost: BobcatCost) => void;
  onSave: (cost: BobcatCost) => void;
  onCancel: () => void;
  setAddingToCategory: (category: string | null) => void;
}

export const BobcatCostGroup = ({
  sizeCategory,
  costs,
  editingId,
  editingPrice,
  addingToCategory,
  onEdit,
  onSave,
  onCancel,
  setAddingToCategory,
}: BobcatCostGroupProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">{sizeCategory}</h2>
        <Button
          variant="outline"
          onClick={() => setAddingToCategory(sizeCategory)}
        >
          Add New Code
        </Button>
      </div>
      
      {addingToCategory === sizeCategory && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <AddBobcatCostForm
            sizeCategory={sizeCategory}
            onSuccess={() => setAddingToCategory(null)}
          />
        </div>
      )}

      <BobcatCostTable
        costs={costs}
        editingId={editingId}
        editingPrice={editingPrice}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};
