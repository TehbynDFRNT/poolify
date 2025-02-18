
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import PoolSpecifications from "@/pages/PoolSpecifications";
import ConstructionCosts from "@/pages/ConstructionCosts";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import FiltrationSystems from "@/pages/FiltrationSystems";

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
          <Route path="/filtration-systems" element={<FiltrationSystems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
