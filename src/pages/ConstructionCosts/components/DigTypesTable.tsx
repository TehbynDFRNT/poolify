
import { type ExcavationDigType } from "@/types/excavation-dig-type";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

interface DigTypesTableProps {
  digTypes: ExcavationDigType[];
  onEdit: (digType: ExcavationDigType) => void;
  calculateTotalCost: (digType: ExcavationDigType) => number;
}

export const DigTypesTable = ({ digTypes, onEdit, calculateTotalCost }: DigTypesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Dig Type</TableHead>
          <TableHead>Truck Count</TableHead>
          <TableHead>Truck Rate</TableHead>
          <TableHead>Truck Hours</TableHead>
          <TableHead>Excavation Rate</TableHead>
          <TableHead>Excavation Hours</TableHead>
          <TableHead>Total Cost</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {digTypes?.map((digType) => (
          <TableRow key={digType.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{digType.name}</TableCell>
            <TableCell>{digType.truck_count}</TableCell>
            <TableCell>{formatCurrency(digType.truck_hourly_rate)}</TableCell>
            <TableCell>{digType.truck_hours}</TableCell>
            <TableCell>{formatCurrency(digType.excavation_hourly_rate)}</TableCell>
            <TableCell>{digType.excavation_hours}</TableCell>
            <TableCell className="font-semibold">
              {formatCurrency(calculateTotalCost(digType))}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(digType)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
