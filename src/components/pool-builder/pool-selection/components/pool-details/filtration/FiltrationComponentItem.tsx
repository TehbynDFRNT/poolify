
import React from "react";
import { formatCurrency } from "@/utils/format";

interface FiltrationComponentItemProps {
  title: string;
  name: string | undefined;
  price: number | undefined;
}

export const FiltrationComponentItem: React.FC<FiltrationComponentItemProps> = ({ 
  title, 
  name, 
  price 
}) => {
  if (!name) return null;
  
  return (
    <div>
      <span className="text-muted-foreground text-sm">{title}:</span>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{formatCurrency(price || 0)}</p>
    </div>
  );
};
