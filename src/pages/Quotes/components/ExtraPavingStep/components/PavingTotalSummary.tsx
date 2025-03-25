
interface PavingTotalSummaryProps {
  totalMargin: number;
  totalCost: number;
}

export const PavingTotalSummary = ({
  totalMargin,
  totalCost
}: PavingTotalSummaryProps) => {
  return (
    <div className="text-right">
      <div className="text-sm text-green-600 font-medium">
        Total Margin: ${totalMargin.toFixed(2)}
      </div>
      <div className="text-xl font-semibold">
        Total: ${totalCost.toFixed(2)}
      </div>
    </div>
  );
};
