
import React from "react";
import { ConcretePump } from "./ConcretePump";
import { ConcreteCuts } from "./ConcreteCuts";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";

interface ConcreteExtrasProps {
  onChanged?: () => void;
}

export const ConcreteExtras: React.FC<ConcreteExtrasProps> = ({ onChanged }) => {
  return (
    <div className="space-y-6">
      {/* Concrete Pump Section */}
      <ConcretePump onChanged={onChanged} />

      {/* Concrete Cuts Section */}
      <ConcreteCuts onChanged={onChanged} />

      {/* Under Fence Concrete Strips Section */}
      <UnderFenceConcreteStrips onChanged={onChanged} />
    </div>
  );
};
