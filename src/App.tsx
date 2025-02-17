
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PoolSpecifications from "./pages/PoolSpecifications";
import ConstructionCosts from "./pages/ConstructionCosts";
import Excavation from "./pages/ConstructionCosts/Excavation";
import PavingRetaining from "./pages/ConstructionCosts/PavingRetaining";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pool-specifications" element={<PoolSpecifications />} />
          <Route path="/construction-costs" element={<ConstructionCosts />} />
          <Route path="/excavation" element={<Excavation />} />
          <Route path="/paving-retaining" element={<PavingRetaining />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
