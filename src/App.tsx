
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import ConstructionCosts from "@/pages/ConstructionCosts";
import PoolSpecifications from "@/pages/PoolSpecifications";
import Excavation from "@/pages/ConstructionCosts/Excavation";
import PavingRetaining from "@/pages/ConstructionCosts/PavingRetaining";
import BobcatCosts from "@/pages/ConstructionCosts/BobcatCosts";
import NotFound from "@/pages/NotFound";
import "@/App.css";

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
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
