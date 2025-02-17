
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { DigTypeForm } from "./components/DigTypeForm";
import { formatCurrency } from "@/utils/format";

const Excavation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDigType, setEditingDigType] = useState<ExcavationDigType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: digTypes, isLoading } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as ExcavationDigType[];
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const digTypeData = {
      name: formData.get("name") as string,
      truck_count: parseInt(formData.get("truck_count") as string),
      truck_hourly_rate: parseFloat(formData.get("truck_hourly_rate") as string),
      truck_hours: parseInt(formData.get("truck_hours") as string),
      excavation_hourly_rate: parseFloat(formData.get("excavation_hourly_rate") as string),
      excavation_hours: parseInt(formData.get("excavation_hours") as string),
    };

    try {
      if (editingDigType) {
        const { error } = await supabase
          .from("excavation_dig_types")
          .update(digTypeData)
          .eq("id", editingDigType.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("excavation_dig_types")
          .insert([digTypeData]);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["excavation-dig-types"] });
      setIsDialogOpen(false);
      setEditingDigType(null);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (digType: ExcavationDigType) => {
    setEditingDigType(digType);
    setIsDialogOpen(true);
  };

  const calculateTotalCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/construction-costs">
                Construction Costs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/excavation">
                Excavation
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Dig Types</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingDigType(null)}
                className="flex items-center gap-2 bg-[#9FC8C0] hover:bg-[#8AB3AB] text-white"
              >
                <Plus className="h-4 w-4" />
                Add Dig Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDigType ? "Edit Dig Type" : "Add New Dig Type"}
                </DialogTitle>
              </DialogHeader>
              <DigTypeForm 
                onSubmit={handleSubmit}
                editingDigType={editingDigType}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Dig Type</TableHead>
                <TableHead>Truck Count</TableHead>
                <TableHead>Truck Rate</TableHead>
                <TableHead>Truck Hours</TableHead>
                <TableHead>Excavation Rate</TableHead>
                <TableHead>Excavation Hours</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {digTypes?.map((digType) => (
                <TableRow key={digType.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{digType.name}</TableCell>
                  <TableCell>{digType.truck_count}</TableCell>
                  <TableCell>{formatCurrency(digType.truck_hourly_rate)}</TableCell>
                  <TableCell>{digType.truck_hours}</TableCell>
                  <TableCell>{formatCurrency(digType.excavation_hourly_rate)}</TableCell>
                  <TableCell>{digType.excavation_hours}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(calculateTotalCost(digType))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(digType)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Button>
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

export default Excavation;
