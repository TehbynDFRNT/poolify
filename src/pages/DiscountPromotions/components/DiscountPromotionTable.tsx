import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { DiscountPromotion } from "@/types/discount-promotion";

interface DiscountPromotionTableProps {
  discountPromotions: DiscountPromotion[];
  editingId: string | null;
  editingValue: string;
  onEdit: (promotion: DiscountPromotion) => void;
  onSave: (promotion: DiscountPromotion) => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
}

export const DiscountPromotionTable = ({
  discountPromotions,
  editingId,
  editingValue,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
}: DiscountPromotionTableProps) => {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Discount Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discountPromotions.map((promotion) => (
          <TableRow key={promotion.uuid}>
            <TableCell>
              {promotion.discount_name}
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                promotion.discount_type === 'dollar' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {promotion.discount_type === 'dollar' ? 'Dollar' : 'Percentage'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {editingId === promotion.uuid ? (
                <Input
                  type="number"
                  value={editingValue}
                  onChange={(e) => onValueChange(e.target.value)}
                  className="w-32 ml-auto"
                  step="1"
                  {...(promotion.discount_type === 'percentage' && { min: "0", max: "100" })}
                />
              ) : (
                promotion.discount_type === 'dollar' 
                  ? formatCurrency(promotion.dollar_value || 0)
                  : `${promotion.percentage_value || 0}%`
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === promotion.uuid ? (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSave(promotion)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(promotion)}
                >
                  Edit
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};