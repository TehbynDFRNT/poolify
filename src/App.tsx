
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import PoolSpecifications from "@/pages/PoolSpecifications";
import FiltrationSystems from "@/pages/FiltrationSystems";
import ConstructionCosts from "@/pages/ConstructionCosts";
import PriceBuilder from "@/pages/PriceBuilder";
import PoolPricing from "@/pages/PriceBuilder/PoolPricing";
import SalesBuilder from "@/pages/SalesBuilder";
import NotFound from "@/pages/NotFound";

import "./App.css";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pool-specifications" element={<PoolSpecifications />} />
        <Route path="/filtration-systems" element={<FiltrationSystems />} />
        <Route path="/construction-costs" element={<ConstructionCosts />} />
        <Route path="/price-builder" element={<PriceBuilder />} />
        <Route path="/price-builder/:poolId" element={<PoolPricing />} />
        <Route path="/sales-builder" element={<SalesBuilder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
