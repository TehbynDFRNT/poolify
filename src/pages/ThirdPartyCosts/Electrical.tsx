
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Zap, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ElectricalCost {
  id: string;
  description: string;
  rate: number;
  display_order: number;
}

const Electrical = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ElectricalCost>>({});
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const { data: electricalCosts, isLoading } = useQuery({
    queryKey: ['electrical-costs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electrical_costs')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as ElectricalCost[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ElectricalCost> }) => {
      const { data, error } = await supabase
        .from('electrical_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electrical-costs'] });
      setEditingId(null);
      setEditValues({});
      toast.success('Electrical cost updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update electrical cost');
      console.error('Update error:', error);
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newCost: Partial<ElectricalCost>) => {
      const maxOrder = electricalCosts?.reduce((max, cost) => 
        Math.max(max, cost.display_order), 0) ?? 0;

      const { data, error } = await supabase
        .from('electrical_costs')
        .insert([{ ...newCost, display_order: maxOrder + 1 }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electrical-costs'] });
      setIsAdding(false);
      setEditValues({});
      toast.success('New electrical cost added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add electrical cost');
      console.error('Add error:', error);
    }
  });

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
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditValues({});
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/third-party-costs" className="transition-colors hover:text-foreground">
                Third Party Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/third-party-costs/electrical" className="transition-colors hover:text-foreground">
                Electrical
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Electrical Costs</h1>
            <p className="text-gray-500 mt-1">Manage electrical contractor costs and requirements</p>
          </div>
          <Button
            onClick={() => {
              setIsAdding(true);
              setEditValues({});
            }}
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
      </div>
    </DashboardLayout>
  );
};

export default Electrical;
