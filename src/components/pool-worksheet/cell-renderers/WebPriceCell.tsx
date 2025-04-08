
import { formatCurrency } from "@/utils/format";

interface WebPriceCellProps {
  poolId: string;
  trueCost: number;
  marginPercentage: number;
}

export const WebPriceCell = ({ poolId, trueCost, marginPercentage }: WebPriceCellProps) => {
  // Calculate web price based on true cost and margin percentage
  // Web Price = True Cost / (1 - Margin/100)
  const calculateWebPrice = () => {
    if (!trueCost || marginPercentage === undefined || marginPercentage === null) {
      return null;
    }
    
    // Ensure margin is a decimal for calculation (e.g., 20% becomes 0.2)
    const marginDecimal = marginPercentage / 100;
    
    // Prevent division by zero or invalid calculations
    if (marginDecimal >= 1) {
      return null;
    }
    
    return trueCost / (1 - marginDecimal);
  };
  
  const webPrice = calculateWebPrice();
  
  // Format the web price with currency formatting
  const formattedWebPrice = webPrice !== null 
    ? formatCurrency(webPrice) 
    : "-";
  
  return <>{formattedWebPrice}</>;
};
