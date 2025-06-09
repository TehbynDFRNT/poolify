import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitleMap: Record<string, string> = {
  '/': 'Home',
  '/customers': 'Customers',
  '/pool-builder': 'Pool Builder',
  '/contract-builder': 'Contract Builder',
  '/pool-specifications': 'Pool Specifications',
  '/construction-costs': 'Construction Costs',
  '/construction-costs/excavation': 'Excavation Costs',
  '/construction-costs/fixed-costs': 'Fixed Costs',
  '/construction-costs/retaining-walls': 'Retaining Walls',
  '/construction-costs/bobcat': 'Bobcat Costs',
  '/construction-costs/crane': 'Crane Costs',
  '/construction-costs/pool-individual-costs': 'Pool Individual Costs',
  '/construction-costs/extra-paving': 'Extra Paving',
  '/construction-costs/water-feature': 'Water Feature',
  '/third-party-costs': 'Third Party Costs',
  '/third-party-costs/electrical': 'Electrical Costs',
  '/third-party-costs/fencing': 'Fencing Costs',
  '/filtration-systems': 'Filtration Systems',
  '/add-ons': 'Add-Ons',
  '/pool-worksheet': 'Pool Worksheet',
  '/pool-creation-wizard': 'Pool Creation Wizard',
  '/formula-references': 'Formula References',
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = routeTitleMap[location.pathname] || 'Page Not Found';
    document.title = `Poolify CPQ - ${pageTitle}`;
  }, [location.pathname]);
};