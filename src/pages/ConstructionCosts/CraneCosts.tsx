
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction, Info } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CostSection } from "./components/CostSection";
import { AddCraneCostForm } from "./components/AddCraneCostForm";
import { AddTrafficControlCostForm } from "./components/AddTrafficControlCostForm";
import { useCosts } from "./hooks/useCosts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CraneCosts = () => {
  const {
    costs: craneCosts,
    isLoading: isLoadingCrane,
    editingId: craneEditingId,
    editingPrice: craneEditingPrice,
    isAdding: isAddingCrane,
    setIsAdding: setIsAddingCrane,
    startEditing: startEditingCrane,
    handleSave: handleSaveCrane,
    handleCancel: handleCancelCrane,
    setEditingPrice: setCraneEditingPrice,
  } = useCosts("crane_costs", "crane-costs");

  const {
    costs: trafficCosts,
    isLoading: isLoadingTraffic,
    editingId: trafficEditingId,
    editingPrice: trafficEditingPrice,
    isAdding: isAddingTraffic,
    setIsAdding: setIsAddingTraffic,
    startEditing: startEditingTraffic,
    handleSave: handleSaveTraffic,
    handleCancel: handleCancelTraffic,
    setEditingPrice: setTrafficEditingPrice,
  } = useCosts("traffic_control_costs", "traffic-control-costs");

  // Find the Franna crane in the list
  const frannaCrane = craneCosts?.find(cost => 
    cost.name.toLowerCase().includes('franna')
  );

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
              <Link to="/construction-costs/crane" className="transition-colors hover:text-foreground">
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

        <Card className="mb-8 bg-muted/30 border-dashed">
          <CardContent className="flex items-start p-4 gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">
                The <strong>Franna Crane ({frannaCrane ? `$${frannaCrane.price}` : 'loading...'}) is used as the default</strong> crane type in all pool pricing calculations. 
                Other crane types listed below are considered options that can be selected for specific projects as needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <CostSection
            title="Crane Hire Costs"
            nameLabel="Name"
            costs={craneCosts || []}
            isLoading={isLoadingCrane}
            isAdding={isAddingCrane}
            editingId={craneEditingId}
            editingPrice={craneEditingPrice}
            onAddToggle={() => setIsAddingCrane(!isAddingCrane)}
            onEdit={startEditingCrane}
            onSave={handleSaveCrane}
            onCancel={handleCancelCrane}
            onPriceChange={setCraneEditingPrice}
            AddForm={AddCraneCostForm}
            renderExtra={(cost) => cost.name.toLowerCase().includes('franna') ? (
              <Badge variant="outline" className="ml-2 text-primary border-primary">Default</Badge>
            ) : null}
          />

          <CostSection
            title="Traffic Control Costs"
            nameLabel="Level"
            costs={trafficCosts || []}
            isLoading={isLoadingTraffic}
            isAdding={isAddingTraffic}
            editingId={trafficEditingId}
            editingPrice={trafficEditingPrice}
            onAddToggle={() => setIsAddingTraffic(!isAddingTraffic)}
            onEdit={startEditingTraffic}
            onSave={handleSaveTraffic}
            onCancel={handleCancelTraffic}
            onPriceChange={setTrafficEditingPrice}
            AddForm={AddTrafficControlCostForm}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CraneCosts;
