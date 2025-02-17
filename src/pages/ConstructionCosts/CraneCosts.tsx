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
import { Construction } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import type { CraneCost } from "@/types/crane-cost";
import type { TrafficControlCost } from "@/types/traffic-control-cost";
import { Button } from "@/components/ui/button";
import { AddCraneCostForm } from "./components/AddCraneCostForm";
import { AddTrafficControlCostForm } from "./components/AddTrafficControlCostForm";

type TableNames = "crane_costs" | "traffic_control_costs";

const CraneCosts = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isAddingNewCrane, setIsAddingNewCrane] = useState(false);
  const [isAddingNewTraffic, setIsAddingNewTraffic] = useState(false);

  const { data: craneCosts, isLoading: isLoadingCrane } = useQuery({
    queryKey: ["crane-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");

      if (error) {
        throw error;
      }

      return data as CraneCost[];
    },
  });

  const { data: trafficCosts, isLoading: isLoadingTraffic } = useQuery({
    queryKey: ["traffic-control-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traffic_control_costs")
        .select("*")
        .order("display_order");

      if (error) {
        throw error;
      }

      return data as TrafficControlCost[];
    },
  });

  const startEditing = (cost: CraneCost | TrafficControlCost) => {
    setEditingId(cost.id);
    setEditingPrice(cost.price.toString());
  };

  const handleSave = async (cost: CraneCost | TrafficControlCost, table: TableNames) => {
    try {
      const newPrice = parseFloat(editingPrice);
      if (isNaN(newPrice)) {
        toast.error("Please enter a valid price");
        return;
      }

      const { error } = await supabase
        .from(table)
        .update({ price: newPrice })
        .eq("id", cost.id);

      if (error) throw error;

      toast.success("Price updated successfully");
      queryClient.invalidateQueries({ queryKey: [table === "crane_costs" ? "crane-costs" : "traffic-control-costs"] });
    } catch (error) {
      toast.error("Failed to update price");
      console.error("Error updating price:", error);
    } finally {
      setEditingId(null);
      setEditingPrice("");
    }
  };

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
              <Link to="/crane-costs" className="transition-colors hover:text-foreground">
                Crane & Traffic Control Costs
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Crane & Traffic Control Costs</h1>
            <p className="text-gray-500 mt-1">Manage crane hire and traffic control costs for pool installations</p>
          </div>
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

        <div className="space-y-8">
          {/* Crane Costs Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Crane Hire Costs</h2>
              <Button
                variant="outline"
                onClick={() => setIsAddingNewCrane(!isAddingNewCrane)}
              >
                {isAddingNewCrane ? "Cancel" : "Add New Crane Cost"}
              </Button>
            </div>

            {isAddingNewCrane && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <AddCraneCostForm onSuccess={() => setIsAddingNewCrane(false)} />
              </div>
            )}

            {isLoadingCrane ? (
              <p className="text-gray-500">Loading costs...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {craneCosts?.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.name}</TableCell>
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
                              onClick={() => handleSave(cost, "crane_costs")}
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
            )}
          </div>

          {/* Traffic Control Costs Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Traffic Control Costs</h2>
              <Button
                variant="outline"
                onClick={() => setIsAddingNewTraffic(!isAddingNewTraffic)}
              >
                {isAddingNewTraffic ? "Cancel" : "Add New Traffic Control Cost"}
              </Button>
            </div>

            {isAddingNewTraffic && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <AddTrafficControlCostForm onSuccess={() => setIsAddingNewTraffic(false)} />
              </div>
            )}

            {isLoadingTraffic ? (
              <p className="text-gray-500">Loading costs...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trafficCosts?.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.name}</TableCell>
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
                              onClick={() => handleSave(cost, "traffic_control_costs")}
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
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CraneCosts;
