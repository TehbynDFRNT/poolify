import { Toaster } from "@/components/ui/sonner";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import AddOns from "./pages/AddOns";
import ConstructionCosts from "./pages/ConstructionCosts";
import Customers from "./pages/Customers";
import FiltrationSystems from "./pages/FiltrationSystems";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PoolBuilder from "./pages/PoolBuilder";
import PoolCreationWizard from "./pages/PoolCreationWizard";
import PoolSpecifications from "./pages/PoolSpecifications";
import PoolWorksheet from "./pages/PoolWorksheet";
import ThirdPartyCosts from "./pages/ThirdPartyCosts";

// Import construction costs sub-pages
import BobcatCosts from "./pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "./pages/ConstructionCosts/CraneCosts";
import Excavation from "./pages/ConstructionCosts/Excavation";
import ExtraPaving from "./pages/ConstructionCosts/ExtraPaving";
import FixedCosts from "./pages/ConstructionCosts/FixedCosts";
import PoolIndividualCosts from "./pages/ConstructionCosts/PoolIndividualCosts";
import RetainingWalls from "./pages/ConstructionCosts/RetainingWalls";
import WaterFeature from "./pages/ConstructionCosts/WaterFeature";

// Import third party costs sub-pages
import Electrical from "./pages/ThirdPartyCosts/Electrical";
import Fencing from "./pages/ThirdPartyCosts/Fencing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-builder" element={<PoolBuilder />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/pool-specifications" element={<ProtectedRoute><PoolSpecifications /></ProtectedRoute>} />
        <Route path="/construction-costs" element={<ProtectedRoute><ConstructionCosts /></ProtectedRoute>} />
        <Route path="/third-party-costs" element={<ProtectedRoute><ThirdPartyCosts /></ProtectedRoute>} />
        <Route path="/filtration-systems" element={<ProtectedRoute><FiltrationSystems /></ProtectedRoute>} />
        <Route path="/add-ons" element={<ProtectedRoute><AddOns /></ProtectedRoute>} />
        <Route path="/pool-worksheet" element={<ProtectedRoute><PoolWorksheet /></ProtectedRoute>} />
        <Route path="/pool-creation-wizard" element={<ProtectedRoute><PoolCreationWizard /></ProtectedRoute>} />

        {/* Construction Costs Sub-routes */}
        <Route path="/construction-costs/excavation" element={<ProtectedRoute><Excavation /></ProtectedRoute>} />
        <Route path="/construction-costs/fixed-costs" element={<ProtectedRoute><FixedCosts /></ProtectedRoute>} />
        <Route path="/construction-costs/retaining-walls" element={<ProtectedRoute><RetainingWalls /></ProtectedRoute>} />
        <Route path="/construction-costs/bobcat" element={<ProtectedRoute><BobcatCosts /></ProtectedRoute>} />
        <Route path="/construction-costs/crane" element={<ProtectedRoute><CraneCosts /></ProtectedRoute>} />
        <Route path="/construction-costs/pool-individual-costs" element={<ProtectedRoute><PoolIndividualCosts /></ProtectedRoute>} />
        <Route path="/construction-costs/extra-paving" element={<ProtectedRoute><ExtraPaving /></ProtectedRoute>} />
        <Route path="/construction-costs/water-feature" element={<ProtectedRoute><WaterFeature /></ProtectedRoute>} />

        {/* Third Party Costs Sub-routes */}
        <Route path="/third-party-costs/electrical" element={<ProtectedRoute><Electrical /></ProtectedRoute>} />
        <Route path="/third-party-costs/fencing" element={<ProtectedRoute><Fencing /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
