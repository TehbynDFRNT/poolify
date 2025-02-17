
import { type ExcavationDigType } from "@/types/excavation-dig-type";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { calculateDigTypeCost } from "@/utils/calculations";

interface DigTypesTableProps {
  digTypes: ExcavationDigType[];
  onEdit: (digType: ExcavationDigType) => void;
}

export const DigTypesTable = ({ digTypes, onEdit }: DigTypesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
          <TableRow key={digType.id}>
            <TableCell className="font-medium">{digType.name}</TableCell>
            <TableCell>{digType.truck_count}</TableCell>
            <TableCell>{formatCurrency(digType.truck_hourly_rate)}</TableCell>
            <TableCell>{digType.truck_hours}</TableCell>
            <TableCell>{formatCurrency(digType.excavation_hourly_rate)}</TableCell>
            <TableCell>{digType.excavation_hours}</TableCell>
            <TableCell className="font-semibold">
              {formatCurrency(calculateDigTypeCost(digType))}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(digType)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
