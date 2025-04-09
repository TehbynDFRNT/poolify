
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RetainingWall } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";

interface RetainingWallsTableProps {
  walls: RetainingWall[];
  onUpdate: (id: string, updates: Partial<RetainingWall>) => void;
}

export const RetainingWallsTable = ({ walls, onUpdate }: RetainingWallsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<RetainingWall>>({});

  const handleEdit = (wall: RetainingWall) => {
    setEditingId(wall.id);
    setEditingValues(wall);
  };

  const handleSave = async (id: string) => {
    if (editingValues) {
      await onUpdate(id, editingValues);
      setEditingId(null);
      setEditingValues({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingValues({});
  };

  const handleChange = (field: keyof RetainingWall, value: string) => {
    setEditingValues((prev) => {
      const updates = { ...prev, [field]: field === 'type' ? value : Number(value) };
      
      // Auto-calculate total when rate, extra_rate, or margin changes
      if (field === 'rate' || field === 'extra_rate' || field === 'margin') {
        const rate = field === 'rate' ? Number(value) : (prev.rate ?? 0);
        const extraRate = field === 'extra_rate' ? Number(value) : (prev.extra_rate ?? 0);
        const margin = field === 'margin' ? Number(value) : (prev.margin ?? 0);
        updates.total = rate + extraRate + margin;
      }
      
      return updates;
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Extra Rate</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walls.map((wall) => (
            <TableRow key={wall.id}>
              <TableCell>
                {editingId === wall.id ? (
                  <Input
                    value={editingValues.type ?? wall.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                  />
                ) : (
                  wall.type
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === wall.id ? (
                  <Input
                    type="number"
                    value={editingValues.rate ?? wall.rate}
                    onChange={(e) => handleChange('rate', e.target.value)}
                    className="w-24 ml-auto"
                  />
                ) : (
                  formatCurrency(wall.rate)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === wall.id ? (
                  <Input
                    type="number"
                    value={editingValues.extra_rate ?? wall.extra_rate}
                    onChange={(e) => handleChange('extra_rate', e.target.value)}
                    className="w-24 ml-auto"
                  />
                ) : (
                  formatCurrency(wall.extra_rate)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === wall.id ? (
                  <Input
                    type="number"
                    value={editingValues.margin ?? wall.margin}
                    onChange={(e) => handleChange('margin', e.target.value)}
                    className="w-24 ml-auto"
                  />
                ) : (
                  formatCurrency(wall.margin)
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(editingId === wall.id ? (editingValues.total ?? wall.total) : wall.total)}
              </TableCell>
              <TableCell className="text-right">
                {editingId === wall.id ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(wall.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(wall)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
