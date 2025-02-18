
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import PoolSpecifications from "@/pages/PoolSpecifications";
import ConstructionCosts from "@/pages/ConstructionCosts";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import PavingRetaining from "@/pages/ConstructionCosts/PavingRetaining";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "@/pages/ConstructionCosts/CraneCosts";
import FixedCosts from "@/pages/ConstructionCosts/FixedCosts";
import PoolSpecificCosts from "@/pages/ConstructionCosts/PoolSpecificCosts";
import FiltrationSystems from "@/pages/FiltrationSystems";
import PricingModels from "@/pages/PricingModels";
import PricingWorksheet from "@/pages/PricingModels/PricingWorksheet";
import PoolDetails from "@/pages/PricingModels/PoolDetails";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pool-specifications" element={<PoolSpecifications />} />
          <Route path="/construction-costs" element={<ConstructionCosts />} />
          <Route path="/construction-costs/excavation" element={<Excavation />} />
          <Route path="/construction-costs/paving-retaining" element={<PavingRetaining />} />
          <Route path="/construction-costs/bobcat-costs" element={<BobcatCosts />} />
          <Route path="/construction-costs/crane-costs" element={<CraneCosts />} />
          <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
          <Route path="/construction-costs/pool-specific-costs" element={<PoolSpecificCosts />} />
          <Route path="/filtration-systems" element={<FiltrationSystems />} />
          <Route path="/pricing-models" element={<PricingModels />} />
          <Route path="/pricing-models/worksheet" element={<PricingWorksheet />} />
          <Route path="/pricing-models/pools/:id" element={<PoolDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
