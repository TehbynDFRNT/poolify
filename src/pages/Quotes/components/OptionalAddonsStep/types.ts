
export interface OptionalAddonsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
  quantity: number;
}
