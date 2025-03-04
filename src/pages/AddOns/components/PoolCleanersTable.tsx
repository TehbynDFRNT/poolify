
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { PoolCleaner } from "@/types/pool-cleaner";
import { AddPoolCleanerForm } from "./AddPoolCleanerForm";

export const PoolCleanersTable = () => {
  const { poolCleaners, isLoading, updatePoolCleaner, deletePoolCleaner } = usePoolCleaners();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCells, setEditingCells] = useState<Record<string, Record<string, boolean>>>({});
  const [editValues, setEditValues] = useState<Record<string, Record<string, any>>>({});

  const handleEditStart = (id: string, field: string) => {
    setEditingCells((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: true },
    }));

    // Initialize edit values if they don't exist
    if (!editValues[id]) {
      const cleaner = poolCleaners?.find((c) => c.id === id);
      if (cleaner) {
        setEditValues((prev) => ({
          ...prev,
          [id]: {
            model_number: cleaner.model_number,
            name: cleaner.name,
            price: cleaner.price,
            margin: cleaner.margin,
          },
        }));
      }
    }
  };

  const handleEditCancel = (id: string, field: string) => {
    setEditingCells((prev) => {
      const newState = { ...prev };
      if (newState[id]) {
        newState[id] = { ...newState[id], [field]: false };
      }
      return newState;
    });
  };

  const handleEditSave = (id: string, field: string) => {
    const updates: Partial<PoolCleaner> = {};
    
    if (editValues[id] && editValues[id][field] !== undefined) {
      if (field === 'price' || field === 'margin') {
        updates[field] = parseFloat(editValues[id][field]);
      } else {
        updates[field] = editValues[id][field];
      }
      
      updatePoolCleaner({ id, updates });
    }

    handleEditCancel(id, field);
  };

  const handleEditChange = (id: string, field: string, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string, field: string) => {
    if (e.key === "Enter") {
      handleEditSave(id, field);
    } else if (e.key === "Escape") {
      handleEditCancel(id, field);
    }
  };

  const handleDeleteCleaner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool cleaner?")) {
      deletePoolCleaner(id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading pool cleaners...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Cleaner
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">RRP ($)</TableHead>
              <TableHead className="text-right">Margin (%)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poolCleaners?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No pool cleaners found. Add your first one!
                </TableCell>
              </TableRow>
            ) : (
              poolCleaners?.map((cleaner) => (
                <TableRow key={cleaner.id}>
                  <TableCell>
                    <EditableCell
                      value={editValues[cleaner.id]?.model_number || cleaner.model_number}
                      isEditing={editingCells[cleaner.id]?.model_number || false}
                      onEdit={() => handleEditStart(cleaner.id, "model_number")}
                      onSave={() => handleEditSave(cleaner.id, "model_number")}
                      onCancel={() => handleEditCancel(cleaner.id, "model_number")}
                      onChange={(value) => handleEditChange(cleaner.id, "model_number", value)}
                      onKeyDown={(e) => handleEditKeyDown(e, cleaner.id, "model_number")}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={editValues[cleaner.id]?.name || cleaner.name}
                      isEditing={editingCells[cleaner.id]?.name || false}
                      onEdit={() => handleEditStart(cleaner.id, "name")}
                      onSave={() => handleEditSave(cleaner.id, "name")}
                      onCancel={() => handleEditCancel(cleaner.id, "name")}
                      onChange={(value) => handleEditChange(cleaner.id, "name", value)}
                      onKeyDown={(e) => handleEditKeyDown(e, cleaner.id, "name")}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell
                      value={editValues[cleaner.id]?.price || cleaner.price}
                      isEditing={editingCells[cleaner.id]?.price || false}
                      onEdit={() => handleEditStart(cleaner.id, "price")}
                      onSave={() => handleEditSave(cleaner.id, "price")}
                      onCancel={() => handleEditCancel(cleaner.id, "price")}
                      onChange={(value) => handleEditChange(cleaner.id, "price", value)}
                      onKeyDown={(e) => handleEditKeyDown(e, cleaner.id, "price")}
                      type="number"
                      align="right"
                      format={formatCurrency}
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell
                      value={editValues[cleaner.id]?.margin || cleaner.margin}
                      isEditing={editingCells[cleaner.id]?.margin || false}
                      onEdit={() => handleEditStart(cleaner.id, "margin")}
                      onSave={() => handleEditSave(cleaner.id, "margin")}
                      onCancel={() => handleEditCancel(cleaner.id, "margin")}
                      onChange={(value) => handleEditChange(cleaner.id, "margin", value)}
                      onKeyDown={(e) => handleEditKeyDown(e, cleaner.id, "margin")}
                      type="number"
                      align="right"
                      format={(v) => `${v}%`}
                      step="1"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCleaner(cleaner.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddPoolCleanerForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};
