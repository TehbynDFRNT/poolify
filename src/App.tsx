import Index from './pages/Index';
import PoolSpecifications from './pages/PoolSpecifications';
import ConstructionCosts from './pages/ConstructionCosts';
import FiltrationSystems from './pages/FiltrationSystems';
import PriceBuilder from './pages/PriceBuilder';
import NotFound from './pages/NotFound';
import { Routes, Route } from 'react-router-dom';
import SalesBuilder from './pages/SalesBuilder';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pool-specifications" element={<PoolSpecifications />} />
      <Route path="/construction-costs/*" element={<ConstructionCosts />} />
      <Route path="/filtration-systems" element={<FiltrationSystems />} />
      <Route path="/price-builder/*" element={<PriceBuilder />} />
      <Route path="/sales-builder" element={<SalesBuilder />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
