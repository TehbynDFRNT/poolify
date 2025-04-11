
export interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface CustomSiteRequirement {
  id: string;
  description: string;
  price: number;
}

export interface HeatPumpPoolCompatibility {
  id?: string;
  heat_pump_id: string;
  pool_range: string;
  pool_model: string;
  hp_sku: string;
  hp_description: string;
}
