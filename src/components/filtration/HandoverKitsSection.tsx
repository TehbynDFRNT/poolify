
import { FiltrationComponent } from "@/types/filtration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

interface HandoverKitsSectionProps {
  handoverKits: FiltrationComponent[] | undefined;
  onAddClick: () => void;
}

export function HandoverKitsSection({
  handoverKits,
  onAddClick,
}: HandoverKitsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Handover Kits</CardTitle>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Handover Kit
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {handoverKits?.map((kit) => (
              <TableRow key={kit.id}>
                <TableCell className="font-medium">{kit.model_number}</TableCell>
                <TableCell>{kit.name}</TableCell>
                <TableCell>{kit.description || '-'}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(kit.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
