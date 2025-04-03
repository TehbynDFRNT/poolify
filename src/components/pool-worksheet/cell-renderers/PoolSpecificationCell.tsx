
import { formatCurrency } from "@/utils/format";
import { Pool } from "@/types/pool";

interface PoolSpecificationCellProps {
  pool: Pool;
  column: string;
}

export const PoolSpecificationCell = ({ pool, column }: PoolSpecificationCellProps) => {
  const value = pool[column as keyof typeof pool];
  
  // Format the value based on column type
  let displayValue: string | number | null = value as string | number | null;
  
  if (column === "length" || column === "width" || 
      column === "depth_shallow" || column === "depth_deep" || 
      column === "waterline_l_m") {
    if (typeof value === 'number') {
      displayValue = `${value.toFixed(2)}m`;
    }
  } else if (column === "volume_liters") {
    if (typeof value === 'number') {
      displayValue = `${value.toLocaleString()}L`;
    }
  } else if (column === "weight_kg") {
    if (typeof value === 'number') {
      displayValue = `${value.toLocaleString()}kg`;
    }
  } else if (column === "buy_price_ex_gst" || column === "buy_price_inc_gst") {
    if (typeof value === 'number') {
      displayValue = formatCurrency(value);
    }
  }
  
  return <>{displayValue || '-'}</>;
};
