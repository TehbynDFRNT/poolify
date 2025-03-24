
export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
  quantity: number;
}

export interface CustomRequirement {
  id: string;
  description: string;
  price: number;
}

export interface OptionalAddonsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}
