
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DigType } from "@/types/dig-type";
import { useState } from "react";
import { useDigTypes } from "@/hooks/useDigTypes";
import { AddDigTypeForm } from "@/components/dig-types/AddDigTypeForm";
import { usePoolSpecifications } from "./hooks/usePoolSpecifications";
import { usePoolDigTypeMatches } from "./hooks/usePoolDigTypeMatches";
import { DigTypesTable } from "./components/DigTypesTable";
import { PoolDigTypeMatchesTable } from "./components/PoolDigTypeMatchesTable";

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

  const handleDigTypeChange = (poolId: string, digTypeId: string) => {
    setEditingPoolMatches(prev => ({
      ...prev,
      [poolId]: { digTypeId }
    }));
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
          <DigTypesTable
            digTypes={digTypes}
            isLoading={isLoading}
            editingRows={editingRows}
            onEdit={(id) => setEditingRows((prev) => ({ ...prev, [id]: {} }))}
            onSave={handleSaveRow}
            onCancel={handleCancelRow}
            onValueChange={handleValueChange}
          />

          <PoolDigTypeMatchesTable
            pools={pools}
            digTypes={digTypes}
            isLoading={isLoadingPools || isLoadingMatches}
            editingPoolMatches={editingPoolMatches}
            getSelectedDigType={getSelectedDigType}
            onEdit={handleEditPoolMatch}
            onSave={handleSavePoolMatch}
            onCancel={handleCancelPoolMatch}
            onDigTypeChange={handleDigTypeChange}
          />
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
