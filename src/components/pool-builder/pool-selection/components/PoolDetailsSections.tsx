import { Pool } from "@/types/pool";
import { PoolDetailsSection } from "./pool-details/PoolDetailsSection";
import { Button } from "@/components/ui/button";
import { SaveAll } from "lucide-react";

interface PoolDetailsSectionsProps {
  pool: Pool;
  selectedColor?: string;
  customerId?: string;
  isSubmittingAll?: boolean;
  handleSaveAll?: () => Promise<void>;
}

export const PoolDetailsSections = ({ pool, selectedColor, customerId, isSubmittingAll, handleSaveAll }: PoolDetailsSectionsProps) => {
  const sections = [
    {
      id: "details",
      title: "Pool Details",
    },
    {
      id: "dimensions",
      title: "Pool Dimensions",
    },
    {
      id: "pricing",
      title: "Pricing",
    },
    {
      id: "fixed-costs",
      title: "Fixed Costs",
    },
    {
      id: "filtration",
      title: "Filtration",
    },
    {
      id: "crane",
      title: "Crane",
    },
    {
      id: "excavation",
      title: "Excavation",
    },
    {
      id: "individual-costs",
      title: "Individual Costs",
    },
    {
      id: "costs-summary",
      title: "Costs Summary",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <PoolDetailsSection
          key={section.id}
          pool={pool}
          selectedColor={selectedColor}
          sectionId={section.id}
          title={section.title}
          className="w-full"
          customerId={customerId}
        />
      ))}
      
      {/* Save All button after Web RRP */}
      {customerId && handleSaveAll && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSaveAll}
            disabled={isSubmittingAll}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <SaveAll className="mr-2 h-5 w-5" />
            {isSubmittingAll ? "Saving All..." : "Save All Sections"}
          </Button>
        </div>
      )}
    </div>
  );
};
