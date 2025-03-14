
import React from 'react';
import { CostBreakdownItem } from './CostBreakdownItem';

interface CostItem {
  name: string;
  value: number;
}

interface CostBreakdownProps {
  costItems: CostItem[];
}

export const CostBreakdown = ({ costItems }: CostBreakdownProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {costItems.map((item, index) => (
        <CostBreakdownItem 
          key={index}
          name={item.name}
          value={item.value}
        />
      ))}
    </div>
  );
};
