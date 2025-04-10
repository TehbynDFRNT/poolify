
import React from "react";

interface CostItemProps {
  label: string;
  amount: number;
  isDiscount?: boolean;
  isTotal?: boolean;
}

const CostItem: React.FC<CostItemProps> = ({ 
  label, 
  amount, 
  isDiscount = false,
  isTotal = false
}) => {
  const textColor = isDiscount ? "text-green-600" : isTotal ? "font-bold" : "";
  
  return (
    <div className={`flex justify-between ${textColor}`}>
      <span>{label}:</span>
      <span>${amount.toFixed(2)}</span>
    </div>
  );
};

export default CostItem;
