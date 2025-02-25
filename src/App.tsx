import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ThirdPartyCosts from "@/pages/ThirdPartyCosts";
import Electrical from "@/pages/ThirdPartyCosts/Electrical";
import Fencing from "@/pages/ThirdPartyCosts/Fencing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/third-party-costs",
    element: <ThirdPartyCosts />,
  },
  {
    path: "/third-party-costs/electrical",
    element: <Electrical />,
  },
  {
    path: "/third-party-costs/fencing",
    element: <Fencing />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
