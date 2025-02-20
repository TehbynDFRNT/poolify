
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { DigType } from "@/types/dig-type";
import { EditableCell } from "@/components/pools/components/EditableCell";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Excavation = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, Partial<DigType>>>({});

  const { data: digTypes, isLoading } = useQuery({
    queryKey: ['dig-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dig_types')
        .select('*')
        .order('name') as { data: DigType[] | null; error: any };
      
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DigType> }) => {
      const { data, error } = await supabase
        .from('dig_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dig-types'] });
      toast.success("Dig type updated successfully");
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      toast.error("Failed to update dig type");
      console.error("Error updating dig type:", error);
    },
  });

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

    updateMutation.mutate({ 
      id: digType.id, 
      updates 
    });
  };

  const handleCancelRow = (digTypeId: string) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[digTypeId];
      return next;
    });
  };

  const calculateTruckSubTotal = (type: DigType) => {
    const editingRow = editingRows[type.id];
    const quantity = editingRow?.truck_quantity ?? type.truck_quantity;
    const rate = editingRow?.truck_hourly_rate ?? type.truck_hourly_rate;
    const hours = editingRow?.truck_hours ?? type.truck_hours;
    return quantity * rate * hours;
  };

  const calculateExcavationSubTotal = (type: DigType) => {
    const editingRow = editingRows[type.id];
    const rate = editingRow?.excavation_hourly_rate ?? type.excavation_hourly_rate;
    const hours = editingRow?.excavation_hours ?? type.excavation_hours;
    return rate * hours;
  };

  const calculateGrandTotal = (type: DigType) => {
    return calculateTruckSubTotal(type) + calculateExcavationSubTotal(type);
  };

  const editableFields: (keyof DigType)[] = [
    'name',
    'truck_quantity',
    'truck_hourly_rate',
    'truck_hours',
    'excavation_hourly_rate',
    'excavation_hours'
  ];

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
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

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
              ) : digTypes?.map((type) => {
                const isEditing = !!editingRows[type.id];
                return (
                  <TableRow key={type.id}>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.name ?? type.name}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'name', value)}
                        type="text"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.truck_quantity ?? type.truck_quantity}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'truck_quantity', parseInt(value))}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.truck_hourly_rate ?? type.truck_hourly_rate}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'truck_hourly_rate', parseFloat(value))}
                        type="number"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.truck_hours ?? type.truck_hours}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'truck_hours', parseInt(value))}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(calculateTruckSubTotal(type))}</TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.excavation_hourly_rate ?? type.excavation_hourly_rate}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'excavation_hourly_rate', parseFloat(value))}
                        type="number"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={editingRows[type.id]?.excavation_hours ?? type.excavation_hours}
                        isEditing={isEditing}
                        onChange={(value) => handleValueChange(type, 'excavation_hours', parseInt(value))}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(calculateExcavationSubTotal(type))}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(calculateGrandTotal(type))}
                    </TableCell>
                    <TableCell>
                      <PoolTableActions
                        isEditing={isEditing}
                        onEdit={() => setEditingRows((prev) => ({
                          ...prev,
                          [type.id]: {}
                        }))}
                        onSave={() => handleSaveRow(type)}
                        onCancel={() => handleCancelRow(type.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
