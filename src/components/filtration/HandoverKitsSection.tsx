import React, { useState } from "react";
import { FiltrationComponent } from "@/types/filtration";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface HandoverKitsSectionProps {
  handoverKits: FiltrationComponent[] | undefined;
  onAddClick: () => void;
}

interface EditableCell {
  id: string;
  field: 'model_number' | 'name' | 'description' | 'price';
  value: string | number;
}

export function HandoverKitsSection({
  handoverKits,
  onAddClick,
}: HandoverKitsSectionProps) {
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
      const value = editingCell.field === 'price' 
        ? parseFloat(editingCell.value.toString())
        : editingCell.value;

      const { error } = await supabase
        .from('filtration_components')
        .update({ [editingCell.field]: value })
        .eq('id', editingCell.id);

      if (error) throw error;

      toast.success("Component updated successfully");
      queryClient.invalidateQueries({ queryKey: ["handover-components"] });
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
        <CardTitle>Handover Kit Components</CardTitle>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Component
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
                <TableCell>
                  {editingCell?.id === kit.id && editingCell.field === 'model_number' ? (
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
                      onClick={() => handleStartEdit(kit, 'model_number')}
                    >
                      {kit.model_number}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCell?.id === kit.id && editingCell.field === 'name' ? (
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
                      onClick={() => handleStartEdit(kit, 'name')}
                    >
                      {kit.name}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCell?.id === kit.id && editingCell.field === 'description' ? (
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
                      onClick={() => handleStartEdit(kit, 'description')}
                    >
                      {kit.description || '-'}
                      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.id === kit.id && editingCell.field === 'price' ? (
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
                      onClick={() => handleStartEdit(kit, 'price_inc_gst')}
                    >
                      {formatCurrency(kit.price_inc_gst)}
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
