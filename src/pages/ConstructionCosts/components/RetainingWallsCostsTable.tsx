
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { RetainingWall } from "@/types/retaining-wall";
import { NewRetainingWallRow } from "./NewRetainingWallRow";
import { RetainingWallRow } from "./RetainingWallRow";

interface RetainingWallsCostsTableProps {
  costs: RetainingWall[];
  onUpdate: (id: string, updates: Partial<RetainingWall>) => void;
  onAdd: (cost: Omit<RetainingWall, 'id'>) => void;
}

export const RetainingWallsCostsTable = ({ costs, onUpdate, onAdd }: RetainingWallsCostsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<RetainingWall>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCost, setNewCost] = useState<Partial<RetainingWall>>({
    type: '',
    rate: 0,
    extra_rate: 0,
    total: 0
  });

  const handleEdit = (cost: RetainingWall) => {
    setEditingId(cost.id);
    setEditValues({
      type: cost.type,
      rate: cost.rate,
      extra_rate: cost.extra_rate,
      total: cost.total
    });
  };

  const handleSave = (id: string) => {
    if (!editValues.type || typeof editValues.rate !== 'number' || typeof editValues.extra_rate !== 'number') {
      toast.error('All fields are required');
      return;
    }
    
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleAdd = () => {
    if (!newCost.type || typeof newCost.rate !== 'number' || typeof newCost.extra_rate !== 'number') {
      toast.error('All fields are required');
      return;
    }

    onAdd(newCost as Omit<RetainingWall, 'id'>);
    setIsAdding(false);
    setNewCost({ type: '', rate: 0, extra_rate: 0, total: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Extra Rate</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <NewRetainingWallRow
                newCost={newCost}
                onNewCostChange={(updates) => setNewCost(prev => ({ ...prev, ...updates }))}
                onSave={handleAdd}
                onCancel={() => setIsAdding(false)}
              />
            )}
            {costs.map((cost) => (
              <RetainingWallRow
                key={cost.id}
                cost={cost}
                isEditing={editingId === cost.id}
                editValues={editValues}
                onEdit={() => handleEdit(cost)}
                onSave={() => handleSave(cost.id)}
                onCancel={() => {
                  setEditingId(null);
                  setEditValues({});
                }}
                onEditValueChange={(updates) => setEditValues(prev => ({ ...prev, ...updates }))}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
