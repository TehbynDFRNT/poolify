
export interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface CustomSiteRequirement {
  id: string;
  description: string;
  price: number;
  margin: number;
}
