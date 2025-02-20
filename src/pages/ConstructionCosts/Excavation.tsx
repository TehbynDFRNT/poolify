
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { DigType } from "@/types/dig-type";
import { useState } from "react";
import { useDigTypes } from "@/hooks/useDigTypes";
import { DigTypeRow } from "@/components/dig-types/DigTypeRow";
import { AddDigTypeForm } from "@/components/dig-types/AddDigTypeForm";
import { usePoolSpecifications } from "./hooks/usePoolSpecifications";
import { usePoolDigTypeMatches } from "./hooks/usePoolDigTypeMatches";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";

const Excavation = () => {
  const [editingRows, setEditingRows] = useState<Record<string, Partial<DigType>>>({});
  const [editingPoolMatches, setEditingPoolMatches] = useState<Record<string, { digTypeId: string }>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { digTypes, isLoading, updateDigType } = useDigTypes();
  const { data: pools, isLoading: isLoadingPools } = usePoolSpecifications();
  const { matches, updateMatch, isLoading: isLoadingMatches } = usePoolDigTypeMatches();

  const handleValueChange = (digType: DigType, field: keyof DigType, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [digType.id]: {
        ...prev[digType.id],
        [field]: value
      }
    }));
  };

  const handleSaveRow = (digType: DigType) => {
    const updates = editingRows[digType.id];
    if (!updates) return;

    updateDigType({ 
      id: digType.id, 
      updates 
    });
    
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[digType.id];
      return next;
    });
  };

  const handleCancelRow = (digTypeId: string) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[digTypeId];
      return next;
    });
  };

  const getSelectedDigType = (poolId: string) => {
    const match = matches?.find(m => m.pool_id === poolId);
    const editingMatch = editingPoolMatches[poolId];
    const digTypeId = editingMatch?.digTypeId || match?.dig_type_id;
    return digTypes?.find(d => d.id === digTypeId);
  };

  const handleEditPoolMatch = (poolId: string) => {
    const currentMatch = matches?.find(m => m.pool_id === poolId);
    setEditingPoolMatches(prev => ({
      ...prev,
      [poolId]: { digTypeId: currentMatch?.dig_type_id || '' }
    }));
  };

  const handleSavePoolMatch = (poolId: string) => {
    const updates = editingPoolMatches[poolId];
    if (!updates) return;

    updateMatch({ 
      poolId, 
      digTypeId: updates.digTypeId 
    });
    
    setEditingPoolMatches(prev => {
      const next = { ...prev };
      delete next[poolId];
      return next;
    });
  };

  const handleCancelPoolMatch = (poolId: string) => {
    setEditingPoolMatches(prev => {
      const next = { ...prev };
      delete next[poolId];
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/excavation" className="transition-colors hover:text-foreground">
                Excavation
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Excavation Costs</h1>
            <p className="text-gray-500 mt-1">Manage excavation costs for different dig types</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Dig Type
            </Button>
            <Construction className="h-6 w-6 text-gray-500" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dig Type</TableHead>
                  <TableHead>Trucks</TableHead>
                  <TableHead>Truck Rate</TableHead>
                  <TableHead>Truck Hours</TableHead>
                  <TableHead>Truck Subtotal</TableHead>
                  <TableHead>Excavation Rate</TableHead>
                  <TableHead>Excavation Hours</TableHead>
                  <TableHead>Excavation Subtotal</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Loading dig types...
                    </TableCell>
                  </TableRow>
                ) : digTypes?.map((type) => (
                  <DigTypeRow
                    key={type.id}
                    digType={type}
                    isEditing={!!editingRows[type.id]}
                    editingRow={editingRows[type.id]}
                    onEdit={() => setEditingRows((prev) => ({
                      ...prev,
                      [type.id]: {}
                    }))}
                    onSave={() => handleSaveRow(type)}
                    onCancel={() => handleCancelRow(type.id)}
                    onValueChange={(field, value) => handleValueChange(type, field, value)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pool Dig Type Matching</h2>
              <p className="text-sm text-gray-500">Match pools with their appropriate dig types</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool Range</TableHead>
                  <TableHead>Pool Name</TableHead>
                  <TableHead>Dig Type</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPools || isLoadingMatches ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading pools...
                    </TableCell>
                  </TableRow>
                ) : pools?.map((pool) => {
                  const isEditing = !!editingPoolMatches[pool.id];
                  const selectedDigType = getSelectedDigType(pool.id);
                  return (
                    <TableRow key={pool.id}>
                      <TableCell>{pool.range}</TableCell>
                      <TableCell>{pool.name}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={editingPoolMatches[pool.id]?.digTypeId || ''}
                            onValueChange={(value) => setEditingPoolMatches(prev => ({
                              ...prev,
                              [pool.id]: { digTypeId: value }
                            }))}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select dig type" />
                            </SelectTrigger>
                            <SelectContent>
                              {digTypes?.map((digType) => (
                                <SelectItem key={digType.id} value={digType.id}>
                                  {digType.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="px-3 py-2">
                            {selectedDigType?.name || 'No dig type selected'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {selectedDigType ? formatCurrency(calculateGrandTotal(selectedDigType)) : '-'}
                      </TableCell>
                      <TableCell>
                        <PoolTableActions
                          isEditing={isEditing}
                          onEdit={() => handleEditPoolMatch(pool.id)}
                          onSave={() => handleSavePoolMatch(pool.id)}
                          onCancel={() => handleCancelPoolMatch(pool.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <AddDigTypeForm
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
