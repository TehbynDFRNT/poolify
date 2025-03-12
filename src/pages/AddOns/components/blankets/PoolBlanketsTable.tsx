
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import { AddPoolBlanketForm } from "./AddPoolBlanketForm";
import { PoolBlanketsTableHeader } from "./PoolBlanketsTableHeader";
import { EmptyPoolBlanketsState } from "./EmptyPoolBlanketsState";
import { PoolBlanketRow } from "./PoolBlanketRow";
import { PoolBlanketsActions } from "./PoolBlanketsActions";
import { usePoolBlanketEditing } from "../../hooks/usePoolBlanketEditing";

export const PoolBlanketsTable = () => {
  const { poolBlankets, isLoading, deletePoolBlanket } = usePoolBlankets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    editingCells,
    editValues,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
    handleEditChange,
    handleEditKeyDown
  } = usePoolBlanketEditing();

  const handleDeleteBlanket = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool blanket?")) {
      deletePoolBlanket(id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading pool blankets...</div>;
  }

  // Group blankets by range
  const blanketsByRange = poolBlankets?.reduce((acc, blanket) => {
    if (!acc[blanket.pool_range]) {
      acc[blanket.pool_range] = [];
    }
    acc[blanket.pool_range].push(blanket);
    return acc;
  }, {} as Record<string, typeof poolBlankets>);

  return (
    <div className="space-y-4">
      <PoolBlanketsActions onAddNew={() => setIsDialogOpen(true)} />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <PoolBlanketsTableHeader />
          <TableBody>
            {!poolBlankets?.length ? (
              <EmptyPoolBlanketsState />
            ) : (
              Object.entries(blanketsByRange || {}).map(([range, blanketsInRange]) => (
                <PoolBlanketRow
                  key={range}
                  range={range}
                  blankets={blanketsInRange}
                  editingCells={editingCells}
                  editValues={editValues}
                  onEditStart={handleEditStart}
                  onEditSave={handleEditSave}
                  onEditCancel={handleEditCancel}
                  onEditChange={handleEditChange}
                  onEditKeyDown={handleEditKeyDown}
                  onDelete={handleDeleteBlanket}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddPoolBlanketForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};
