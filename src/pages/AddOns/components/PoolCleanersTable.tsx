
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { AddPoolCleanerForm } from "./AddPoolCleanerForm";
import { PoolCleanersTableHeader } from "./poolCleaners/PoolCleanersTableHeader";
import { EmptyPoolCleanersState } from "./poolCleaners/EmptyPoolCleanersState";
import { PoolCleanerRow } from "./poolCleaners/PoolCleanerRow";
import { PoolCleanersActions } from "./poolCleaners/PoolCleanersActions";
import { usePoolCleanerEditing } from "../hooks/usePoolCleanerEditing";

export const PoolCleanersTable = () => {
  const { poolCleaners, isLoading, deletePoolCleaner } = usePoolCleaners();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    editingCells,
    editValues,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
    handleEditChange,
    handleEditKeyDown
  } = usePoolCleanerEditing();

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
      <PoolCleanersActions onAddNew={() => setIsDialogOpen(true)} />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <PoolCleanersTableHeader />
          <TableBody>
            {poolCleaners?.length === 0 ? (
              <EmptyPoolCleanersState />
            ) : (
              poolCleaners?.map((cleaner) => (
                <PoolCleanerRow
                  key={cleaner.id}
                  cleaner={cleaner}
                  editingCells={editingCells[cleaner.id] || {}}
                  editValues={editValues[cleaner.id] || {}}
                  onEditStart={(field, value) => handleEditStart(cleaner.id, field, value)}
                  onEditSave={(field) => handleEditSave(cleaner.id, field)}
                  onEditCancel={(field) => handleEditCancel(cleaner.id, field)}
                  onEditChange={(field, value) => handleEditChange(cleaner.id, field, value)}
                  onEditKeyDown={(e, field) => handleEditKeyDown(e, cleaner.id, field)}
                  onDelete={() => handleDeleteCleaner(cleaner.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddPoolCleanerForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};
