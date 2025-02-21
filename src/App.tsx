
import Index from './pages/Index';
import PoolSpecifications from './pages/PoolSpecifications';
import ConstructionCosts from './pages/ConstructionCosts';
import FiltrationSystems from './pages/FiltrationSystems';
import PriceBuilder from './pages/PriceBuilder';
import NotFound from './pages/NotFound';
import { Routes, Route } from 'react-router-dom';
import SalesBuilder from './pages/SalesBuilder';
import QuoteGeneration from './pages/SalesBuilder/QuoteGeneration';
import BobcatCosts from './pages/ConstructionCosts/BobcatCosts';
import CraneCosts from './pages/ConstructionCosts/CraneCosts';
import Excavation from './pages/ConstructionCosts/Excavation';
import FixedCosts from './pages/ConstructionCosts/FixedCosts';
import PavingRetaining from './pages/ConstructionCosts/PavingRetaining';
import PoolIndividualCosts from './pages/ConstructionCosts/PoolIndividualCosts';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pool-specifications" element={<PoolSpecifications />} />
      <Route path="/construction-costs" element={<ConstructionCosts />} />
      <Route path="/construction-costs/excavation" element={<Excavation />} />
      <Route path="/construction-costs/paving-retaining" element={<PavingRetaining />} />
      <Route path="/construction-costs/bobcat-costs" element={<BobcatCosts />} />
      <Route path="/construction-costs/crane-costs" element={<CraneCosts />} />
      <Route path="/construction-costs/fixed-costs" element={<FixedCosts />} />
      <Route path="/construction-costs/pool-individual-costs" element={<PoolIndividualCosts />} />
      <Route path="/filtration-systems" element={<FiltrationSystems />} />
      <Route path="/price-builder/*" element={<PriceBuilder />} />
      <Route path="/sales-builder" element={<SalesBuilder />} />
      <Route path="/sales-builder/quotes" element={<QuoteGeneration />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
