
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
      
      if (['price_inc_gst', 'price_ex_gst'].includes(editingCell.field)) {
        value = editingCell.value === '' ? null : parseFloat(editingCell.value.toString());
        
        // If updating the inc GST price, also update the ex GST price
        if (editingCell.field === 'price_inc_gst' && value !== null) {
          // Calculate ex GST price (divide by 1.1 for 10% GST)
          const exGstValue = parseFloat((value / 1.1).toFixed(2));
          
          const { error: exGstError } = await supabase
            .from('filtration_components')
            .update({ 'price_ex_gst': exGstValue })
            .eq('id', editingCell.id);
          
          if (exGstError) throw exGstError;
        }
        
        // If updating the ex GST price, also update the inc GST price
        if (editingCell.field === 'price_ex_gst' && value !== null) {
          // Calculate inc GST price (multiply by 1.1 for 10% GST)
          const incGstValue = parseFloat((value * 1.1).toFixed(2));
          
          const { error: incGstError } = await supabase
            .from('filtration_components')
            .update({ 'price_inc_gst': incGstValue })
            .eq('id', editingCell.id);
          
          if (incGstError) throw incGstError;
        }
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

  // Update all components to set ex GST price based on inc GST price
  const updateAllExGstPrices = async () => {
    try {
      if (!components || components.length === 0) {
        toast.error("No components to update");
        return;
      }

      const updates = components.map(async (component) => {
        if (component.price_inc_gst) {
          const exGstPrice = parseFloat((component.price_inc_gst / 1.1).toFixed(2));
          
          return supabase
            .from('filtration_components')
            .update({ price_ex_gst: exGstPrice })
            .eq('id', component.id);
        }
        return null;
      });

      await Promise.all(updates.filter(Boolean));
      
      queryClient.invalidateQueries({ queryKey: ["filtration-components"] });
      toast.success("All ex GST prices updated successfully");
    } catch (error) {
      console.error('Error updating ex GST prices:', error);
      toast.error("Failed to update ex GST prices");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtration Components</CardTitle>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={updateAllExGstPrices}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
          >
            Update Ex GST Prices
          </Button>
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
