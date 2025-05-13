
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { PoolCleanersTableHeader } from "./PoolCleanersTableHeader";
import { EmptyPoolCleanersState } from "./EmptyPoolCleanersState";
import { PoolCleanerRow } from "./PoolCleanerRow";
import { PoolCleanersActions } from "./PoolCleanersActions";
import { usePoolCleanerEditing } from "../../hooks/usePoolCleanerEditing";
import { AddPoolCleanerForm } from "./AddPoolCleanerForm";

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
    return <div className="p-4 text-center">Loading pool cleaners...</div>;
  }

  return (
    <div className="space-y-4">
      <PoolCleanersActions onAddNew={() => setIsDialogOpen(true)} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <PoolCleanersTableHeader />
            <TableBody>
              {!poolCleaners || poolCleaners.length === 0 ? (
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
        </CardContent>
      </Card>

      <AddPoolCleanerForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};
