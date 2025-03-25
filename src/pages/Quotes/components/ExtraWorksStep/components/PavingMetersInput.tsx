
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface PavingMetersInputProps {
  index: number;
  meters: number;
  onMetersChange: (value: number) => void;
}

export const PavingMetersInput = ({
  index,
  meters,
  onMetersChange
}: PavingMetersInputProps) => {
  const [metersValue, setMetersValue] = useState(meters.toString());

  // Update the input field when user types
  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetersValue(e.target.value);
  };

  // Only update the actual selection when input is committed (on blur)
  const handleMetersBlur = () => {
    const value = parseFloat(metersValue);
    if (!isNaN(value)) {
      onMetersChange(value);
    } else {
      // Reset to the current value if invalid input
      setMetersValue(meters.toString());
    }
  };

  // Also update on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur to commit the change
    }
  };

  // Synchronize the input value with selection when it changes from outside
  useEffect(() => {
    setMetersValue(meters.toString());
  }, [meters]);

  return (
    <div>
      <Label htmlFor={`paving-meters-${index}`}>Meters</Label>
      <Input
        id={`paving-meters-${index}`}
        type="number"
        min="0"
        step="0.5"
        value={metersValue}
        onChange={handleMetersChange}
        onBlur={handleMetersBlur}
        onKeyDown={handleKeyDown}
        className="mt-1"
      />
    </div>
  );
};
