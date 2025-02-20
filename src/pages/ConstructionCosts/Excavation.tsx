
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import type { DigType } from "@/types/dig-type";
import { useState } from "react";
import { useDigTypes } from "@/hooks/useDigTypes";
import { DigTypeRow } from "@/components/dig-types/DigTypeRow";

const Excavation = () => {
  const [editingRows, setEditingRows] = useState<Record<string, Partial<DigType>>>({});
  const { digTypes, isLoading, updateDigType } = useDigTypes();

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
                  <TableHead colSpan={10} className="text-center py-4">
                    Loading dig types...
                  </TableHead>
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
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
