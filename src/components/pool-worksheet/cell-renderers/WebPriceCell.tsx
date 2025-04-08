
import { formatCurrency } from "@/utils/format";

interface WebPriceCellProps {
  poolId: string;
  trueCost: number;
  marginPercentage: number;
}

export const WebPriceCell = ({ poolId, trueCost, marginPercentage }: WebPriceCellProps) => {
  // Calculate web price based on true cost and margin percentage
  // With margin: Selling Price = Cost / (1 - Margin/100)
  const calculateWebPrice = () => {
    if (!trueCost || marginPercentage === undefined || marginPercentage === null) {
      console.log(`Web price calculation skipped for ${poolId}: Missing true cost or margin`);
      return 0;
    }
    
    // Calculate using margin: Cost / (1 - Margin/100)
    const marginDecimal = marginPercentage / 100;
    
    // Prevent division by zero or negative values
    if (marginDecimal >= 1) {
      console.log(`Web price calculation skipped for ${poolId}: Margin percentage too high (${marginPercentage}%)`);
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
