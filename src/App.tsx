
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

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-specifications" element={<PoolSpecifications />} />
        <Route path="/construction-costs" element={<ConstructionCosts />} />
        <Route path="/third-party-costs" element={<ThirdPartyCosts />} />
        <Route path="/third-party-costs/electrical" element={<Electrical />} />
        <Route path="/third-party-costs/fencing" element={<Fencing />} />
        <Route path="/filtration-systems" element={<FiltrationSystems />} />
        <Route path="/price-builder" element={<PriceBuilder />} />
        <Route path="/price-builder/:poolId" element={<PoolPricing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
