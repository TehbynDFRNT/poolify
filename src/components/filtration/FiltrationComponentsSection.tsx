
import { FiltrationComponent, FiltrationComponentType } from "@/types/filtration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ComponentsTableHeader } from "./components/ComponentsTableHeader";
import { ComponentTableRow } from "./components/ComponentTableRow";

interface FiltrationComponentsSectionProps {
  components: FiltrationComponent[] | undefined;
  componentTypes: FiltrationComponentType[] | undefined;
  selectedTypeId: string | null;
  onTypeChange: (typeId: string | null) => void;
  onAddClick: () => void;
}

interface EditableCell {
  id: string;
  field: keyof Omit<FiltrationComponent, 'id' | 'created_at'>;
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
      value: field === 'type_id' ? component[field] || '' : component[field]?.toString() || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCell) return;

    try {
      let value: string | number | null = editingCell.value;
      
      if (['price', 'flow_rate', 'power_consumption'].includes(editingCell.field)) {
        value = editingCell.value === '' ? null : parseFloat(editingCell.value.toString());
      }

      if (editingCell.field === 'type_id') {
        value = editingCell.value === '' ? null : editingCell.value;
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

  const filteredComponents = components?.filter(component => {
    if (!selectedTypeId) return true;
    return component.type_id === selectedTypeId;
  });

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
          <ComponentsTableHeader />
          <TableBody>
            {filteredComponents?.filter(component => 
              componentTypes?.find(t => t.id === component.type_id)?.name !== "Handover Kit"
            ).map((component) => (
              <ComponentTableRow
                key={component.id}
                component={component}
                componentType={componentTypes?.find(t => t.id === component.type_id)}
                componentTypes={componentTypes}
                editingCell={editingCell}
                onStartEdit={(field) => handleStartEdit(component, field as EditableCell['field'])}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onEditValueChange={(value) => setEditingCell(prev => prev ? { ...prev, value } : null)}
                onKeyDown={handleKeyDown}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
