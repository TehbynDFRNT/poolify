
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

function App() {
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
