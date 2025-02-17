
import { FiltrationComponent, FiltrationComponentType } from "@/types/filtration";
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

interface FiltrationComponentsSectionProps {
  components: FiltrationComponent[] | undefined;
  componentTypes: FiltrationComponentType[] | undefined;
  selectedTypeId: string | null;
  onTypeChange: (typeId: string | null) => void;
  onAddClick: () => void;
}

export function FiltrationComponentsSection({
  components,
  componentTypes,
  selectedTypeId,
  onTypeChange,
  onAddClick,
}: FiltrationComponentsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtration Components</CardTitle>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedTypeId || ""}
            onChange={(e) => onTypeChange(e.target.value || null)}
          >
            <option value="">All Components</option>
            {componentTypes?.filter(type => type.name !== "Handover Kit").map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Component
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Flow Rate</TableHead>
              <TableHead className="text-right">Power Usage</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components?.filter(component => 
              componentTypes?.find(t => t.id === component.type_id)?.name !== "Handover Kit"
            ).map((component) => (
              <TableRow key={component.id}>
                <TableCell className="font-medium">{component.model_number}</TableCell>
                <TableCell>{component.name}</TableCell>
                <TableCell>
                  {componentTypes?.find(t => t.id === component.type_id)?.name}
                </TableCell>
                <TableCell className="text-right">
                  {component.flow_rate ? `${component.flow_rate} L/min` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {component.power_consumption ? `${component.power_consumption}W` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(component.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
