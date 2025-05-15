import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pool } from "@/types/pool";
import { Calculator, CheckSquare, Droplets, Fence, FileText, Layers, ListFilter, MapPin, Package, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Tab content imports
import CustomerInformationSection from "@/components/pool-builder/customer-information/CustomerInformationSection";
import { FormulaReference } from "@/components/pool-builder/FormulaReference";
import { ConcreteAndPavingPlaceholder } from "@/components/pool-builder/pool-selection/components/concrete-paving/ConcreteAndPavingPlaceholder";
import { ElectricalPlaceholder } from "@/components/pool-builder/pool-selection/components/electrical/ElectricalPlaceholder";
import { FencingPlaceholder } from "@/components/pool-builder/pool-selection/components/fencing/FencingPlaceholder";
import { RetainingWallsPlaceholder } from "@/components/pool-builder/pool-selection/components/retaining-walls/RetainingWallsPlaceholder";
import { SiteRequirementsPlaceholder } from "@/components/pool-builder/pool-selection/components/site-requirements/SiteRequirementsPlaceholder";
import { UpgradesAndExtrasPlaceholder } from "@/components/pool-builder/pool-selection/components/upgrades-and-extras/UpgradesAndExtrasPlaceholder";
import { WaterFeatureSection } from "@/components/pool-builder/pool-selection/components/water-feature/WaterFeatureSection";
import PoolSelectionSection from "@/components/pool-builder/pool-selection/PoolSelectionSection";
import { SummarySection } from "@/components/pool-builder/summary/SummarySection";

interface PoolBuilderTabsProps {
  customerId: string | null;
  customer: PoolProject | null;
  selectedPool: Pool | null;
  loading: boolean;
}

// Import here to avoid circular dependencies
import { PoolProject } from "@/types/pool";

export const PoolBuilderTabs: React.FC<PoolBuilderTabsProps> = ({
  customerId,
  customer,
  selectedPool,
  loading
}) => {
  // Use a default tab state to allow navigation from the summary page
  const [activeTab, setActiveTab] = useState("builder");
  const location = useLocation();

  // Check for a defaultTab in the location state
  useEffect(() => {
    if (location.state && location.state.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state]);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading customer data...</p>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="builder" className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Customer Info
        </TabsTrigger>
        <TabsTrigger value="pool-selection" className="flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          Pool Selection
        </TabsTrigger>
        <TabsTrigger value="site-requirements" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Site Requirements
        </TabsTrigger>
        <TabsTrigger value="concrete-paving" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Concrete & Paving
        </TabsTrigger>
        <TabsTrigger value="retaining-walls" className="flex items-center gap-2">
          <Fence className="h-4 w-4" />
          Retaining Walls
        </TabsTrigger>
        <TabsTrigger value="fencing" className="flex items-center gap-2">
          <Fence className="h-4 w-4" />
          Fencing
        </TabsTrigger>
        <TabsTrigger value="electrical" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Electrical
        </TabsTrigger>
        <TabsTrigger value="water-feature" className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          Water Feature
        </TabsTrigger>
        <TabsTrigger value="upgrades-extras" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Upgrades & Extras
        </TabsTrigger>
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Summary
        </TabsTrigger>
        <TabsTrigger value="formula-reference" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Formula Reference
        </TabsTrigger>
      </TabsList>

      <TabsContent value="builder">
        <Card className="p-6">
          <CustomerInformationSection existingCustomer={customer} />
        </Card>
      </TabsContent>

      <TabsContent value="pool-selection">
        <Card className="p-6">
          <PoolSelectionSection customerId={customerId} />
        </Card>
      </TabsContent>

      <TabsContent value="site-requirements">
        <Card className="p-6">
          {selectedPool ? (
            <SiteRequirementsPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<MapPin className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Site requirements are specific to the pool model. Please select a pool in the Pool Selection tab to view site requirements."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="concrete-paving">
        <Card className="p-6">
          {selectedPool ? (
            <ConcreteAndPavingPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Layers className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Concrete and paving options are specific to the pool model. Please select a pool in the Pool Selection tab to view options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="retaining-walls">
        <Card className="p-6">
          {selectedPool ? (
            <RetainingWallsPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Fence className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Retaining wall options are specific to the pool model. Please select a pool in the Pool Selection tab to view options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="fencing">
        <Card className="p-6">
          {selectedPool ? (
            <FencingPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Fence className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Fencing options are specific to the pool model. Please select a pool in the Pool Selection tab to view fencing options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="electrical">
        <Card className="p-6">
          {selectedPool ? (
            <ElectricalPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Zap className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Electrical requirements are specific to the pool model. Please select a pool in the Pool Selection tab to view electrical options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="water-feature">
        <Card className="p-6">
          {selectedPool ? (
            <WaterFeatureSection pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Droplets className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Water feature options are specific to the pool model. Please select a pool in the Pool Selection tab to view options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="upgrades-extras">
        <Card className="p-6">
          {selectedPool ? (
            <UpgradesAndExtrasPlaceholder pool={selectedPool} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<Package className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="Upgrades and extras are specific to the pool model. Please select a pool in the Pool Selection tab to view options."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="summary">
        <Card className="p-6">
          {selectedPool ? (
            <SummarySection pool={selectedPool} customer={customer} customerId={customerId} />
          ) : (
            <PlaceholderMessage
              icon={<FileText className="h-12 w-12 text-muted-foreground mx-auto" />}
              title="Please Select a Pool First"
              description="The summary contains information from all sections. Please select a pool in the Pool Selection tab to view the complete summary."
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="formula-reference">
        <FormulaReference />
      </TabsContent>
    </Tabs>
  );
};

interface PlaceholderMessageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlaceholderMessage: React.FC<PlaceholderMessageProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
    </div>
  );
};
