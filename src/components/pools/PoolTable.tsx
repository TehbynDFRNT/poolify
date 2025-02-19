
import React from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { EditableCell } from "./components/EditableCell";
import { PoolTableActions } from "./components/PoolTableActions";
import { usePoolUpdates } from "./hooks/usePoolUpdates";
import { validatePoolUpdates } from "./utils/poolValidation";
import { editableFields } from "./types/poolTableTypes";

interface PoolTableProps {
  pools: Pool[];
}

export const PoolTable = ({ pools }: PoolTableProps) => {
  const { editingRows, setEditingRows, updatePoolMutation } = usePoolUpdates();

  const handleValueChange = (pool: Pool, field: keyof Pool, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [pool.id]: {
        ...prev[pool.id],
        [field]: value
      }
    }));
  };

  const handleSaveRow = (pool: Pool) => {
    const updates = editingRows[pool.id];
    if (!updates) return;

    const validatedUpdates = validatePoolUpdates(updates);
    if (!validatedUpdates) return;

    updatePoolMutation.mutate({ 
      id: pool.id, 
      updates: validatedUpdates 
    });
  };

  const handleCancelRow = (poolId: string) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[poolId];
      return next;
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {editableFields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => {
            const isEditing = !!editingRows[pool.id];
            return (
              <TableRow key={pool.id}>
                {editableFields.map((field) => (
                  <TableCell key={field}>
                    <EditableCell
                      pool={pool}
                      field={field}
                      value={editingRows[pool.id]?.[field] ?? pool[field]}
                      isEditing={isEditing}
                      onValueChange={(value) => handleValueChange(pool, field, value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <PoolTableActions
                    isEditing={isEditing}
                    onSave={() => handleSaveRow(pool)}
                    onCancel={() => handleCancelRow(pool.id)}
                    onEdit={() => setEditingRows((prev) => ({
                      ...prev,
                      [pool.id]: {}
                    }))}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
