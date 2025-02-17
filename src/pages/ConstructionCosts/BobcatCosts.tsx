
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Truck } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import type { BobcatCost } from "@/types/bobcat-cost";
import { Button } from "@/components/ui/button";
import { AddBobcatCostForm } from "./components/AddBobcatCostForm";

const BobcatCosts = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);

  const { data: costs, isLoading } = useQuery({
    queryKey: ["bobcat-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bobcat_costs")
        .select("*")
        .order("size_category")
        .order("display_order");

      if (error) {
        throw error;
      }

      return data as BobcatCost[];
    },
  });

  const startEditing = (cost: BobcatCost) => {
    setEditingId(cost.id);
    setEditingPrice(cost.price.toString());
  };

  const handleSave = async (cost: BobcatCost) => {
    try {
      const newPrice = parseFloat(editingPrice);
      if (isNaN(newPrice)) {
        toast.error("Please enter a valid price");
        return;
      }

      const { error } = await supabase
        .from("bobcat_costs")
        .update({ price: newPrice })
        .eq("id", cost.id);

      if (error) throw error;

      toast.success("Price updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bobcat-costs"] });
    } catch (error) {
      toast.error("Failed to update price");
      console.error("Error updating price:", error);
    } finally {
      setEditingId(null);
      setEditingPrice("");
    }
  };

  // Group costs by size category
  const groupedCosts = costs?.reduce((acc, cost) => {
    if (!acc[cost.size_category]) {
      acc[cost.size_category] = [];
    }
    acc[cost.size_category].push(cost);
    return acc;
  }, {} as Record<string, BobcatCost[]>);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/bobcat-costs" className="transition-colors hover:text-foreground">
                Bobcat Costs
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bobcat Costs</h1>
            <p className="text-gray-500 mt-1">View and manage bobcat rental costs by size and code</p>
          </div>
          <Truck className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {isLoading ? (
            <p className="text-gray-500">Loading costs...</p>
          ) : (
            <div className="space-y-8">
              {groupedCosts && Object.entries(groupedCosts).map(([sizeCategory, costs]) => (
                <div key={sizeCategory}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">{sizeCategory}</h2>
                    <Button
                      variant="outline"
                      onClick={() => setAddingToCategory(sizeCategory)}
                    >
                      Add New Code
                    </Button>
                  </div>
                  
                  {addingToCategory === sizeCategory && (
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                      <AddBobcatCostForm
                        sizeCategory={sizeCategory}
                        onSuccess={() => setAddingToCategory(null)}
                      />
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costs.map((cost) => (
                        <TableRow key={cost.id}>
                          <TableCell>{cost.day_code}</TableCell>
                          <TableCell className="text-right">
                            {editingId === cost.id ? (
                              <Input
                                type="number"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                className="w-32 ml-auto"
                                step="0.01"
                              />
                            ) : (
                              formatCurrency(cost.price)
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId === cost.id ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSave(cost)}
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(cost)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BobcatCosts;
