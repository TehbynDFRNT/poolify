
import { FiltrationComponent, FiltrationComponentType } from "@/types/filtration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FiltrationComponentsSectionProps {
  components: FiltrationComponent[] | undefined;
  componentTypes: FiltrationComponentType[] | undefined;
  selectedTypeId: string | null;
  onTypeChange: (typeId: string | null) => void;
  onAddClick: () => void;
}

interface EditableCell {
  id: string;
  field: 'model_number' | 'name' | 'flow_rate' | 'power_consumption' | 'price';
  value: string | number | null;
}

export function FiltrationComponentsSection({
  components,
  componentTypes,
  selectedTypeId,
  onTypeChange,
  onAddClick,
}: FiltrationComponentsSectionProps) {
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const queryClient = useQueryClient();

  const handleStartEdit = (component: FiltrationComponent, field: EditableCell['field']) => {
    setEditingCell({
      id: component.id,
      field,
      value: component[field]?.toString() || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCell) return;

    try {
      let value: string | number | null = editingCell.value;
      
      // Convert to number for numeric fields
      if (['price', 'flow_rate', 'power_consumption'].includes(editingCell.field)) {
        value = editingCell.value === '' ? null : parseFloat(editingCell.value.toString());
      }

      const { error } = await supabase
        .from('filtration_components')
        .update({ [editingCell.field]: value })
        .eq('id', editingCell.id);

      if (error) throw error;

      toast.success("Component updated successfully");
      queryClient.invalidateQueries({ queryKey: ["filtration-components"] });
      setEditingCell(null);
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error("Failed to update component");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

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
                <TableCell>
                  {editingCell?.id === component.id && editingCell.field === 'model_number' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-between group"
                      onClick={() => handleStartEdit(component, 'model_number')}
                    >
                      {component.model_number}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCell?.id === component.id && editingCell.field === 'name' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-between group"
                      onClick={() => handleStartEdit(component, 'name')}
                    >
                      {component.name}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {componentTypes?.find(t => t.id === component.type_id)?.name}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.id === component.id && editingCell.field === 'flow_rate' ? (
                    <div className="flex items-center gap-2 justify-end">
                      <Input
                        type="number"
                        value={editingCell.value === null ? '' : editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-32"
                        step="0.1"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-end gap-2 group"
                      onClick={() => handleStartEdit(component, 'flow_rate')}
                    >
                      {component.flow_rate ? `${component.flow_rate} L/min` : '-'}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.id === component.id && editingCell.field === 'power_consumption' ? (
                    <div className="flex items-center gap-2 justify-end">
                      <Input
                        type="number"
                        value={editingCell.value === null ? '' : editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-32"
                        step="0.1"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-end gap-2 group"
                      onClick={() => handleStartEdit(component, 'power_consumption')}
                    >
                      {component.power_consumption ? `${component.power_consumption}W` : '-'}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.id === component.id && editingCell.field === 'price' ? (
                    <div className="flex items-center gap-2 justify-end">
                      <Input
                        type="number"
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-32"
                        step="0.01"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-end gap-2 group"
                      onClick={() => handleStartEdit(component, 'price')}
                    >
                      {formatCurrency(component.price)}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
