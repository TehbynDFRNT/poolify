import { Button } from "@/components/ui/button";
import { DiscountPromotionTable } from "./DiscountPromotionTable";
import type { DiscountPromotion } from "@/types/discount-promotion";

interface DiscountPromotionSectionProps {
  discountPromotions: DiscountPromotion[] | undefined;
  isLoading: boolean;
  isAdding: boolean;
  editingId: string | null;
  editingValue: string;
  onAddToggle: () => void;
  onEdit: (promotion: DiscountPromotion) => void;
  onSave: (promotion: DiscountPromotion) => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
  onDelete: (promotionUuid: string) => void;
  isDeletingPromotion: boolean;
  AddForm: React.ComponentType<{ onSuccess: () => void }>;
}

export const DiscountPromotionSection = ({
  discountPromotions,
  isLoading,
  isAdding,
  editingId,
  editingValue,
  onAddToggle,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
  onDelete,
  isDeletingPromotion,
  AddForm,
}: DiscountPromotionSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Discount Promotions</h2>
        <Button
          variant="outline"
          onClick={onAddToggle}
        >
          {isAdding ? "Cancel" : "Add New Promotion"}
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <AddForm onSuccess={onAddToggle} />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading discount promotions...</p>
      ) : (
        <DiscountPromotionTable
          discountPromotions={discountPromotions || []}
          editingId={editingId}
          editingValue={editingValue}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onValueChange={onValueChange}
          onDelete={onDelete}
          isDeletingPromotion={isDeletingPromotion}
        />
      )}
    </div>
  );
};