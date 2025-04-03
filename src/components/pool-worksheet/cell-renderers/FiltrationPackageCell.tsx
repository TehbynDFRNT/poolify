
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
    return <>{package_info ? formatCurrency(calculatePackagePrice(package_info)) : '-'}</>;
  }
  
  return null;
};
