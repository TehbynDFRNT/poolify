
import React from "react";
import { formatCurrency } from "@/utils/format";
import { PackageWithComponents } from "@/types/filtration";

interface HandoverKitSectionProps {
  handoverKit: NonNullable<PackageWithComponents['handover_kit']>;
}

export const HandoverKitSection: React.FC<HandoverKitSectionProps> = ({ handoverKit }) => {
  if (!handoverKit.components || handoverKit.components.length === 0) return null;
  
  return (
    <div className="mt-2">
      <span className="text-muted-foreground text-sm">Handover Kit:</span>
      <p className="font-medium">{handoverKit.name}</p>
      <div className="mt-1 pl-2 border-l-2 border-muted">
        {handoverKit.components.map((item) => (
          <div key={item.id} className="text-sm flex justify-between items-center">
            <span>{item.quantity}x {item.component?.name}</span>
            <span className="text-muted-foreground">
              {formatCurrency((item.component?.price || 0) * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
