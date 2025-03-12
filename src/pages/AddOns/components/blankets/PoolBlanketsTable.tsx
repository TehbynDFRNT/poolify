
import { useState } from "react";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import { AddPoolBlanketForm } from "./AddPoolBlanketForm";
import { PoolBlanketsActions } from "./PoolBlanketsActions";
import { PoolRangeSection } from "./PoolRangeSection";
import { PoolBlanket } from "@/types/pool-blanket";
import { Card, CardContent } from "@/components/ui/card";

export const PoolBlanketsTable = () => {
  const { poolBlankets, isLoading, deletePoolBlanket, updatePoolBlanket } = usePoolBlankets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBlanket, setEditingBlanket] = useState<PoolBlanket | null>(null);

  const handleDeleteBlanket = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool blanket?")) {
      deletePoolBlanket(id);
    }
  };

  const handleEditBlanket = (blanket: PoolBlanket) => {
    setEditingBlanket(blanket);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingBlanket(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading pool blankets...</div>
        </CardContent>
      </Card>
    );
  }

  if (!poolBlankets?.length) {
    return (
      <div className="space-y-4">
        <PoolBlanketsActions onAddNew={() => setIsAddDialogOpen(true)} />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No pool blankets found. Add your first one!</p>
          </CardContent>
        </Card>
        <AddPoolBlanketForm 
          open={isAddDialogOpen} 
          onOpenChange={handleCloseDialog} 
          editBlanket={editingBlanket}
        />
      </div>
    );
  }

  // Group blankets by range
  const blanketsByRange = poolBlankets.reduce((acc, blanket) => {
    if (!acc[blanket.pool_range]) {
      acc[blanket.pool_range] = [];
    }
    acc[blanket.pool_range].push(blanket);
    return acc;
  }, {} as Record<string, PoolBlanket[]>);

  return (
    <div className="space-y-4">
      <PoolBlanketsActions onAddNew={() => setIsAddDialogOpen(true)} />

      <div className="space-y-6">
        {Object.entries(blanketsByRange).map(([range, blanketsInRange]) => (
          <PoolRangeSection
            key={range}
            range={range}
            blankets={blanketsInRange}
            onEditBlanket={handleEditBlanket}
            onDeleteBlanket={handleDeleteBlanket}
          />
        ))}
      </div>

      <AddPoolBlanketForm 
        open={isAddDialogOpen} 
        onOpenChange={handleCloseDialog} 
        editBlanket={editingBlanket}
      />
    </div>
  );
};
