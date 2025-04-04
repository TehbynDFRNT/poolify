
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface FiltrationPackageCellProps {
  package_info: any;
  column: string;
}

export const FiltrationPackageCell = ({ package_info, column }: FiltrationPackageCellProps) => {
  if (column === "default_package") {
    return <>{package_info ? `Option ${package_info.display_order}` : '-'}</>;
  } else if (column === "package_price") {
    const price = package_info ? calculatePackagePrice(package_info) : 0;
    console.log(`Rendering package price for ${package_info?.name || 'unknown package'}:`, price);
    return <>{package_info ? formatCurrency(price) : '-'}</>;
  }
  
  return null;
};
