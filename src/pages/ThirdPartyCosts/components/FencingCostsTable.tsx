
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { FencingCost } from "../types/fencing";
import { EditableCell } from "@/components/filtration/components/EditableCell";

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
    type: '',
    unit_price: 0
  });

  const handleEdit = (e: React.MouseEvent, cost: FencingCost) => {
    e.preventDefault();
    setEditingId(cost.id);
    setEditValues({
      item: cost.item,
      type: cost.type,
      unit_price: cost.unit_price
    });
  };

  const handleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!editValues.item || !editValues.type || typeof editValues.unit_price !== 'number') {
      toast.error('All fields are required');
      return;
    }
    
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCost.item || !newCost.type || typeof newCost.unit_price !== 'number') {
      toast.error('All fields are required');
      return;
    }

    onAdd(newCost as Omit<FencingCost, 'id' | 'created_at'>);
    setIsAdding(false);
    setNewCost({ item: '', type: '', unit_price: 0 });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Unit Price ($)</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              <TableCell>
                <Input
                  value={newCost.item}
                  onChange={(e) => setNewCost(prev => ({ ...prev, item: e.target.value }))}
                  placeholder="Enter item name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={newCost.type}
                  onChange={(e) => setNewCost(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Enter type"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={newCost.unit_price}
                  onChange={(e) => setNewCost(prev => ({ ...prev, unit_price: parseFloat(e.target.value) }))}
                  placeholder="Enter unit price"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleAdd}>Save</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {costs.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell>
                <EditableCell
                  value={editingId === cost.id ? editValues.item || '' : cost.item}
                  isEditing={editingId === cost.id}
                  onEdit={() => handleEdit(new MouseEvent('click'), cost)}
                  onSave={() => handleSave(new MouseEvent('click'), cost.id)}
                  onCancel={() => {
                    setEditingId(null);
                    setEditValues({});
                  }}
                  onChange={(value) => setEditValues(prev => ({ ...prev, item: value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(new MouseEvent('click'), cost.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={editingId === cost.id ? editValues.type || '' : cost.type}
                  isEditing={editingId === cost.id}
                  onEdit={() => handleEdit(new MouseEvent('click'), cost)}
                  onSave={() => handleSave(new MouseEvent('click'), cost.id)}
                  onCancel={() => {
                    setEditingId(null);
                    setEditValues({});
                  }}
                  onChange={(value) => setEditValues(prev => ({ ...prev, type: value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(new MouseEvent('click'), cost.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={editingId === cost.id ? editValues.unit_price?.toString() || '' : formatCurrency(cost.unit_price)}
                  isEditing={editingId === cost.id}
                  onEdit={() => handleEdit(new MouseEvent('click'), cost)}
                  onSave={() => handleSave(new MouseEvent('click'), cost.id)}
                  onCancel={() => {
                    setEditingId(null);
                    setEditValues({});
                  }}
                  onChange={(value) => setEditValues(prev => ({ ...prev, unit_price: parseFloat(value) }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(new MouseEvent('click'), cost.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  type="number"
                />
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => handleSave(e, cost.id)}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => handleEdit(e, cost)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isAdding && (
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              setIsAdding(true);
            }}
          >
            Add New Fencing Component
          </Button>
        </div>
      )}
    </div>
  );
};
