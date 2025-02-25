
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { ElectricalCost } from "../types/electrical";
import { useElectricalCosts } from "../hooks/useElectricalCosts";

interface ElectricalCostsTableProps {
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
}

export const ElectricalCostsTable = ({ isAdding, setIsAdding }: ElectricalCostsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ElectricalCost>>({});
  const { electricalCosts, updateMutation, addMutation } = useElectricalCosts();

  const handleEdit = (cost: ElectricalCost) => {
    setEditingId(cost.id);
    setEditValues({
      description: cost.description,
      rate: cost.rate
    });
  };

  const handleSave = (id: string) => {
    if (!editValues.description || !editValues.rate) {
      toast.error('Description and rate are required');
      return;
    }
    
    updateMutation.mutate({
      id,
      updates: editValues
    });
    setEditingId(null);
    setEditValues({});
  };

  const handleAdd = () => {
    if (!editValues.description || !editValues.rate) {
      toast.error('Description and rate are required');
      return;
    }

    addMutation.mutate({
      description: editValues.description,
      rate: editValues.rate
    });
    setIsAdding(false);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditValues({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              <TableCell>
                <Input
                  value={editValues.description ?? ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  className="max-w-sm"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={editValues.rate ?? ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  placeholder="Enter rate"
                  className="max-w-[150px]"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdd}
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
              </TableCell>
            </TableRow>
          )}
          {electricalCosts?.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    value={editValues.description ?? cost.description}
                    onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                    className="max-w-sm"
                  />
                ) : (
                  cost.description
                )}
              </TableCell>
              <TableCell>
                {editingId === cost.id ? (
                  <Input
                    type="number"
                    value={editValues.rate ?? cost.rate}
                    onChange={(e) => setEditValues(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="max-w-[150px]"
                  />
                ) : (
                  formatCurrency(cost.rate)
                )}
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
                      onClick={handleCancel}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
