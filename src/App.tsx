
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import PoolSpecifications from "@/pages/PoolSpecifications";
import ConstructionCosts from "@/pages/ConstructionCosts";
import ThirdPartyCosts from "@/pages/ThirdPartyCosts";
import FiltrationSystems from "@/pages/FiltrationSystems";
import PriceBuilder from "@/pages/PriceBuilder";
import PoolPricing from "@/pages/PriceBuilder/PoolPricing";
import Electrical from "@/pages/ThirdPartyCosts/Electrical";
import Fencing from "@/pages/ThirdPartyCosts/Fencing";
import RetainingWalls from "@/pages/ConstructionCosts/RetainingWalls";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "@/pages/ConstructionCosts/CraneCosts";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import FixedCosts from "@/pages/ConstructionCosts/FixedCosts";
import PoolIndividualCosts from "@/pages/ConstructionCosts/PoolIndividualCosts";
import AddOns from "@/pages/AddOns";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-specifications" element={<PoolSpecifications />} />
        <Route path="/construction-costs" element={<ConstructionCosts />} />
        <Route path="/construction-costs/retaining-walls" element={<RetainingWalls />} />
        <Route path="/construction-costs/bobcat-costs" element={<BobcatCosts />} />
        <Route path="/construction-costs/crane-costs" element={<CraneCosts />} />
        <Route path="/construction-costs/excavation" element={<Excavation />} />
        <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
        <Route path="/construction-costs/pool-individual-costs" element={<PoolIndividualCosts />} />
        <Route path="/third-party-costs" element={<ThirdPartyCosts />} />
        <Route path="/third-party-costs/electrical" element={<Electrical />} />
        <Route path="/third-party-costs/fencing" element={<Fencing />} />
        <Route path="/filtration-systems" element={<FiltrationSystems />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/price-builder" element={<PriceBuilder />} />
        <Route path="/price-builder/:poolId" element={<PoolPricing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
