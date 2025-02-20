
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import PoolSpecifications from "@/pages/PoolSpecifications";
import ConstructionCosts from "@/pages/ConstructionCosts";
import PavingRetaining from "@/pages/ConstructionCosts/PavingRetaining";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "@/pages/ConstructionCosts/CraneCosts";
import FixedCosts from "@/pages/ConstructionCosts/FixedCosts";
import PoolIndividualCosts from "@/pages/ConstructionCosts/PoolIndividualCosts";
import FiltrationSystems from "@/pages/FiltrationSystems";
import PriceBuilder from "@/pages/PriceBuilder";
import PoolPricing from "@/pages/PriceBuilder/PoolPricing";

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
          <Route path="/construction-costs/paving-retaining" element={<PavingRetaining />} />
          <Route path="/construction-costs/bobcat-costs" element={<BobcatCosts />} />
          <Route path="/construction-costs/crane-costs" element={<CraneCosts />} />
          <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
          <Route path="/construction-costs/pool-individual-costs" element={<PoolIndividualCosts />} />
          <Route path="/filtration-systems" element={<FiltrationSystems />} />
          <Route path="/price-builder" element={<PriceBuilder />} />
          <Route path="/price-builder/:poolId" element={<PoolPricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
