
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { FencingCost, FENCE_CATEGORIES, FENCE_TYPES } from "../types/fencing";
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
    if (!editValues.item || !editValues.type || typeof editValues.unit_price !== 'number') {
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
    setNewCost({ item: '', type: '', unit_price: 0, category: 'Fencing' });
  };

  const sortedCosts = [...costs].sort((a, b) => {
    // First sort by category
    const categoryOrder = FENCE_CATEGORIES.indexOf(a.category) - FENCE_CATEGORIES.indexOf(b.category);
    if (categoryOrder !== 0) return categoryOrder;
    
    // Then by display_order if it exists
    if (a.display_order !== undefined && b.display_order !== undefined) {
      return a.display_order - b.display_order;
    }
    
    // Finally by item name
    return a.item.localeCompare(b.item);
  });

  const renderNewCostRow = () => (
    <TableRow>
      <TableCell>
        <Input
          value={newCost.item}
          onChange={(e) => setNewCost(prev => ({ ...prev, item: e.target.value }))}
          placeholder="Enter item name"
        />
      </TableCell>
      <TableCell>
        <Select 
          value={newCost.category} 
          onValueChange={(value) => setNewCost(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {FENCE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select 
          value={newCost.type} 
          onValueChange={(value) => setNewCost(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {FENCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  let currentCategory: string | null = null;

  return (
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
          {isAdding && renderNewCostRow()}
          {sortedCosts.map((cost) => {
            const isNewCategory = currentCategory !== cost.category;
            currentCategory = cost.category;

            return (
              <TableRow key={cost.id} className={isNewCategory ? "border-t-2 border-t-gray-200" : ""}>
                <TableCell>
                  <EditableCell
                    value={editingId === cost.id ? editValues.item || '' : cost.item}
                    isEditing={editingId === cost.id}
                    onEdit={() => handleEdit(cost)}
                    onSave={() => handleSave(cost.id)}
                    onCancel={() => {
                      setEditingId(null);
                      setEditValues({});
                    }}
                    onChange={(value) => setEditValues(prev => ({ ...prev, item: value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(cost.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                </TableCell>
                <TableCell>
                  {editingId === cost.id ? (
                    <Select 
                      value={editValues.category || cost.category} 
                      onValueChange={(value) => setEditValues(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FENCE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{cost.category}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cost.id ? (
                    <Select 
                      value={editValues.type || cost.type} 
                      onValueChange={(value) => setEditValues(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FENCE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{cost.type}</span>
                  )}
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={editingId === cost.id ? editValues.unit_price?.toString() || '' : formatCurrency(cost.unit_price)}
                    isEditing={editingId === cost.id}
                    onEdit={() => handleEdit(cost)}
                    onSave={() => handleSave(cost.id)}
                    onCancel={() => {
                      setEditingId(null);
                      setEditValues({});
                    }}
                    onChange={(value) => setEditValues(prev => ({ ...prev, unit_price: parseFloat(value) }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(cost.id);
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
                        onClick={() => handleSave(cost.id)}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditingId(null);
                          setEditValues({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(cost)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!isAdding && (
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setIsAdding(true)}
          >
            Add New Fencing Component
          </Button>
        </div>
      )}
    </div>
  );
};
