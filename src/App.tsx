
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Index from "./pages/Index";
import PoolBuilder from "./pages/PoolBuilder";
import NotFound from "./pages/NotFound";
import PoolWorksheet from "./pages/PoolWorksheet";
import PoolSpecifications from "./pages/PoolSpecifications";
import AddOns from "./pages/AddOns";
import FiltrationSystems from "./pages/FiltrationSystems";
import ConstructionCosts from "./pages/ConstructionCosts";
import ThirdPartyCosts from "./pages/ThirdPartyCosts";
import PoolCreationWizard from "./pages/PoolCreationWizard";
import Customers from "./pages/Customers";

// Import construction costs sub-pages
import Excavation from "./pages/ConstructionCosts/Excavation";
import FixedCosts from "./pages/ConstructionCosts/FixedCosts";
import RetainingWalls from "./pages/ConstructionCosts/RetainingWalls";
import BobcatCosts from "./pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "./pages/ConstructionCosts/CraneCosts";
import PoolIndividualCosts from "./pages/ConstructionCosts/PoolIndividualCosts";
import ExtraPaving from "./pages/ConstructionCosts/ExtraPaving";
import WaterFeature from "./pages/ConstructionCosts/WaterFeature";

// Import third party costs sub-pages
import Electrical from "./pages/ThirdPartyCosts/Electrical";
import Fencing from "./pages/ThirdPartyCosts/Fencing";

function App() {
  console.log("App component rendering");
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-builder" element={<PoolBuilder />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/pool-specifications" element={<PoolSpecifications />} />
        <Route path="/construction-costs" element={<ConstructionCosts />} />
        <Route path="/third-party-costs" element={<ThirdPartyCosts />} />
        <Route path="/filtration-systems" element={<FiltrationSystems />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/pool-worksheet" element={<PoolWorksheet />} />
        <Route path="/pool-creation-wizard" element={<PoolCreationWizard />} />
        
        {/* Construction Costs Sub-routes */}
        <Route path="/construction-costs/excavation" element={<Excavation />} />
        <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
        <Route path="/construction-costs/retaining-walls" element={<RetainingWalls />} />
        <Route path="/construction-costs/bobcat" element={<BobcatCosts />} />
        <Route path="/construction-costs/crane" element={<CraneCosts />} />
        <Route path="/construction-costs/pool-individual-costs" element={<PoolIndividualCosts />} />
        <Route path="/construction-costs/extra-paving" element={<ExtraPaving />} />
        <Route path="/construction-costs/water-feature" element={<WaterFeature />} />
        
        {/* Third Party Costs Sub-routes */}
        <Route path="/third-party-costs/electrical" element={<Electrical />} />
        <Route path="/third-party-costs/fencing" element={<Fencing />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
