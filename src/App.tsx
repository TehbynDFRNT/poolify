
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PoolSpecifications from "@/pages/PoolSpecifications";
import FiltrationSystems from "@/pages/FiltrationSystems";
import ConstructionCosts from "@/pages/ConstructionCosts";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "@/pages/ConstructionCosts/CraneCosts";
import FixedCosts from "@/pages/ConstructionCosts/FixedCosts";
import RetainingWalls from "@/pages/ConstructionCosts/RetainingWalls";
import WaterFeature from "@/pages/ConstructionCosts/WaterFeature";
import ExtraPaving from "@/pages/ConstructionCosts/ExtraPaving";
import PoolIndividualCosts from "@/pages/ConstructionCosts/PoolIndividualCosts";
import ThirdPartyCosts from "@/pages/ThirdPartyCosts";
import Electrical from "@/pages/ThirdPartyCosts/Electrical";
import Fencing from "@/pages/ThirdPartyCosts/Fencing";
import AddOns from "@/pages/AddOns";
import PriceBuilder from "@/pages/PriceBuilder";
import PoolPricing from "@/pages/PriceBuilder/PoolPricing";
import Quotes from "@/pages/Quotes";
import CreateQuote from "@/pages/Quotes/CreateQuote";
import EditQuote from "@/pages/Quotes/EditQuote";
import PoolCreationWizard from "@/pages/PoolCreationWizard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-specifications" element={<PoolSpecifications />} />
        <Route path="/pool-creation-wizard" element={<PoolCreationWizard />} />
        <Route path="/filtration-systems" element={<FiltrationSystems />} />
        <Route path="/construction-costs" element={<ConstructionCosts />} />
        <Route path="/construction-costs/excavation" element={<Excavation />} />
        <Route path="/construction-costs/bobcat" element={<BobcatCosts />} />
        <Route path="/construction-costs/crane" element={<CraneCosts />} />
        <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
        <Route path="/construction-costs/retaining-walls" element={<RetainingWalls />} />
        <Route path="/construction-costs/water-feature" element={<WaterFeature />} />
        <Route path="/construction-costs/extra-paving" element={<ExtraPaving />} />
        <Route path="/construction-costs/pool-individual-costs" element={<PoolIndividualCosts />} />
        <Route path="/third-party-costs" element={<ThirdPartyCosts />} />
        <Route path="/third-party-costs/electrical" element={<Electrical />} />
        <Route path="/third-party-costs/fencing" element={<Fencing />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/price-builder" element={<PriceBuilder />} />
        <Route path="/price-builder/pool/:poolId" element={<PoolPricing />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/quotes/new" element={<CreateQuote />} />
        <Route path="/quotes/edit/:quoteId" element={<EditQuote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
