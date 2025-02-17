
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import ConstructionCosts from "@/pages/ConstructionCosts";
import PoolSpecifications from "@/pages/PoolSpecifications";
import FiltrationSystems from "@/pages/FiltrationSystems";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import PavingRetaining from "@/pages/ConstructionCosts/PavingRetaining";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import CraneCosts from "@/pages/ConstructionCosts/CraneCosts";
import NotFound from "@/pages/NotFound";
import "@/App.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/construction-costs",
    element: <ConstructionCosts />,
  },
  {
    path: "/pool-specifications",
    element: <PoolSpecifications />,
  },
  {
    path: "/filtration-systems",
    element: <FiltrationSystems />,
  },
  {
    path: "/excavation",
    element: <Excavation />,
  },
  {
    path: "/paving-retaining",
    element: <PavingRetaining />,
  },
  {
    path: "/bobcat-costs",
    element: <BobcatCosts />,
  },
  {
    path: "/crane-costs",
    element: <CraneCosts />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
