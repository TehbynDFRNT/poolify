
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface FiltrationPackageCellProps {
  package_info: any;
  column: string;
}

export const FiltrationPackageCell = ({ package_info, column }: FiltrationPackageCellProps) => {
  if (column === "filtration_costs") {
    const price = package_info ? calculatePackagePrice(package_info) : 0;
    return <>{package_info ? formatCurrency(price) : '-'}</>;
  }
  
  return null;
};
