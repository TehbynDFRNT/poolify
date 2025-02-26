
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FencingCost, FENCE_CATEGORIES } from "../types/fencing";
import { NewFencingCostRow } from "./NewFencingCostRow";
import { FencingCostRow } from "./FencingCostRow";

interface FencingCostsTableProps {
  costs: FencingCost[];
  onUpdate: (id: string, updates: Partial<FencingCost>) => void;
  onAdd: (cost: Omit<FencingCost, 'id' | 'created_at'>) => void;
}

export const FencingCostsTable = ({ costs, onUpdate, onAdd }: FencingCostsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FencingCost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCost, setNewCost] = useState<Partial<FencingCost>>({
    item: '',
    type: 'Fence (per meter)',
    unit_price: 0,
    category: 'Fencing'
  });

  const handleEdit = (cost: FencingCost) => {
    setEditingId(cost.id);
    setEditValues({
      item: cost.item,
      type: cost.type,
      unit_price: cost.unit_price,
      category: cost.category
    });
  };

  const handleSave = (id: string) => {
    if (!editValues.item || !editValues.type || typeof editValues.unit_price !== 'number' || !editValues.category) {
      toast.error('All fields are required');
      return;
    }
    
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleAdd = () => {
    if (!newCost.item || !newCost.type || typeof newCost.unit_price !== 'number' || !newCost.category) {
      toast.error('All fields are required');
      return;
    }

    onAdd(newCost as Omit<FencingCost, 'id' | 'created_at'>);
    setIsAdding(false);
    setNewCost({ item: '', type: 'Fence (per meter)', unit_price: 0, category: 'Fencing' });
  };

  const sortedCosts = [...costs].sort((a, b) => {
    const categoryOrder = FENCE_CATEGORIES.indexOf(a.category) - FENCE_CATEGORIES.indexOf(b.category);
    if (categoryOrder !== 0) return categoryOrder;
    
    if (a.display_order !== undefined && b.display_order !== undefined) {
      return a.display_order - b.display_order;
    }
    
    return a.item.localeCompare(b.item);
  });

  let currentCategory: string | null = null;

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
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit Price ($)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <NewFencingCostRow
                newCost={newCost}
                onNewCostChange={(updates) => setNewCost(prev => ({ ...prev, ...updates }))}
                onSave={handleAdd}
                onCancel={() => setIsAdding(false)}
              />
            )}
            {sortedCosts.map((cost) => {
              const isNewCategory = currentCategory !== cost.category;
              currentCategory = cost.category;

              return (
                <FencingCostRow
                  key={cost.id}
                  cost={cost}
                  isEditing={editingId === cost.id}
                  editValues={editValues}
                  isNewCategory={isNewCategory}
                  onEdit={() => handleEdit(cost)}
                  onSave={() => handleSave(cost.id)}
                  onCancel={() => {
                    setEditingId(null);
                    setEditValues({});
                  }}
                  onEditValueChange={(updates) => setEditValues(prev => ({ ...prev, ...updates }))}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
