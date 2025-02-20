
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExcavationPageHeader } from "./components/ExcavationPageHeader";
import { DigTypesSection } from "./components/DigTypesSection";
import { PoolExcavationTable } from "./components/PoolExcavationTable";
import { useDigTypes, usePoolExcavationTypes } from "./hooks/useExcavationQueries";

const Excavation = () => {
  const { data: digTypes, isLoading } = useDigTypes();
  const { data: poolExcavationTypes } = usePoolExcavationTypes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <ExcavationPageHeader />
        <DigTypesSection digTypes={digTypes || []} />
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <PoolExcavationTable 
            pools={poolExcavationTypes || []} 
            digTypes={digTypes || []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
