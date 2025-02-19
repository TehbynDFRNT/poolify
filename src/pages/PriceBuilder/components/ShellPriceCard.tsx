
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface ShellPriceCardProps {
  buyPriceExGst: number | null;
  buyPriceIncGst: number | null;
}

export const ShellPriceCard = ({ buyPriceExGst, buyPriceIncGst }: ShellPriceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Shell Price
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Price (ex GST)</dt>
            <dd className="text-lg font-medium">
              {buyPriceExGst ? formatCurrency(buyPriceExGst) : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Price (inc GST)</dt>
            <dd className="text-2xl font-semibold text-primary">
              {buyPriceIncGst ? formatCurrency(buyPriceIncGst) : '-'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
