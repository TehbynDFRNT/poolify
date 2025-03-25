
import { PoolSelectionForm } from "./components/PoolSelectionForm";

interface SelectPoolStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SelectPoolStep = ({ onNext, onPrevious }: SelectPoolStepProps) => {
  return (
    <PoolSelectionForm onNext={onNext} onPrevious={onPrevious} />
  );
};
