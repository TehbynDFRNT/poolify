
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
      console.log(`Web price calculation skipped for ${poolId}: Missing true cost or margin`);
      return 0;
    }
    
    // Ensure margin is a decimal for calculation (e.g., 20% becomes 0.2)
    const marginDecimal = marginPercentage / 100;
    
    // Prevent division by zero or invalid calculations
    if (marginDecimal >= 1) {
      console.log(`Web price calculation invalid for ${poolId}: Margin is >= 100%`);
      return 0;
    }
    
    const webPrice = trueCost / (1 - marginDecimal);
    console.log(`Web price calculation for ${poolId}: ${trueCost} / (1 - ${marginPercentage/100}) = ${webPrice}`);
    return webPrice;
  };
  
  const webPrice = calculateWebPrice();
  
  // Format the web price with currency formatting
  const formattedWebPrice = formatCurrency(webPrice);
  
  return <>{formattedWebPrice}</>;
};
