
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PoolIndividualCost } from "@/types/pool-individual-cost";
import { EditableCell } from "@/components/pools/components/EditableCell";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { usePoolIndividualCosts } from "./hooks/usePoolIndividualCosts";

const editableFields: (keyof PoolIndividualCost)[] = [
  "name",
  "range",
  "cost_value",
  "description",
  "notes"
];

interface PoolIndividualCostsTableProps {
  costs: PoolIndividualCost[];
}

export const PoolIndividualCostsTable: React.FC<PoolIndividualCostsTableProps> = ({ costs }) => {
  const { editingRows, setEditingRows, updateCostMutation } = usePoolIndividualCosts();

  const handleValueChange = (cost: PoolIndividualCost, field: keyof PoolIndividualCost, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [cost.id]: {
        ...prev[cost.id],
        [field]: value
      }
    }));
  };

  const handleSaveRow = (cost: PoolIndividualCost) => {
    const updates = editingRows[cost.id];
    if (!updates) return;

    updateCostMutation.mutate({ 
      id: cost.id, 
      updates
    });
  };

  const handleCancelRow = (costId: string) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[costId];
      return next;
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {editableFields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.map((cost) => {
            const isEditing = !!editingRows[cost.id];
            return (
              <TableRow key={cost.id}>
                {editableFields.map((field) => (
                  <TableCell key={field}>
                    <EditableCell
                      pool={cost}
                      field={field}
                      value={editingRows[cost.id]?.[field] ?? cost[field]}
                      isEditing={isEditing}
                      onValueChange={(value) => handleValueChange(cost, field, value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <PoolTableActions
                    isEditing={isEditing}
                    onSave={() => handleSaveRow(cost)}
                    onCancel={() => handleCancelRow(cost.id)}
                    onEdit={() => setEditingRows((prev) => ({
                      ...prev,
                      [cost.id]: {}
                    }))}
                  />
                </TableCell>