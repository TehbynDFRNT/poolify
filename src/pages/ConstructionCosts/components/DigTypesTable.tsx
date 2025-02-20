
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DigType } from "@/types/dig-type";
import { DigTypeRow } from "@/components/dig-types/DigTypeRow";

interface DigTypesTableProps {
  digTypes?: DigType[];
  isLoading: boolean;
  editingRows: Record<string, Partial<DigType>>;
  onEdit: (digTypeId: string) => void;
  onSave: (digType: DigType) => void;
  onCancel: (digTypeId: string) => void;
  onValueChange: (digType: DigType, field: keyof DigType, value: any) => void;
}

export const DigTypesTable = ({
  digTypes,
  isLoading,
  editingRows,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
}: DigTypesTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dig Type</TableHead>
            <TableHead>Trucks</TableHead>
            <TableHead>Truck Rate</TableHead>
            <TableHead>Truck Hours</TableHead>
            <TableHead>Truck Subtotal</TableHead>
            <TableHead>Excavation Rate</TableHead>
            <TableHead>Excavation Hours</TableHead>
            <TableHead>Excavation Subtotal</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-4">
                Loading dig types...
              </TableCell>
            </TableRow>
          ) : digTypes?.map((type) => (
            <DigTypeRow
              key={type.id}
              digType={type}
              isEditing={!!editingRows[type.id]}
              editingRow={editingRows[type.id]}
              onEdit={() => onEdit(type.id)}
              onSave={() => onSave(type)}
              onCancel={() => onCancel(type.id)}
              onValueChange={(field, value) => onValueChange(type, field, value)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
