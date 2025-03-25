import { PavingSelection } from "../types";

interface CostBreakdownProps {
  activeSelection: PavingSelection;
}

export const CostBreakdown = ({ activeSelection }: CostBreakdownProps) => {
  return (
    <div className="col-span-4">
      <div className="flex flex-col h-full">
        <div className="text-gray-700 font-medium">
          Paver Cost
        </div>
        <div className="mt-2 text-lg font-semibold">
          ${activeSelection.paverCost.toFixed(2)}
        </div>
        <div className="mt-1 font-medium">
          Wastage Cost
        </div>
        <div className="text-lg font-semibold">
          ${activeSelection.wastageCost.toFixed(2)}
        </div>
        <div className="mt-1 font-medium">
          Margin Cost
        </div>
        <div className="text-lg font-semibold">
          ${activeSelection.marginCost.toFixed(2)}
        </div>
        <div className="mt-1 font-medium">
          Labour Cost
        </div>
        <div className="text-lg font-semibold">
          $100.00
        </div>
        <div className="mt-1 font-medium">
          Labour Margin
        </div>
        <div className="text-lg font-semibold">
          $30.00
        </div>
      </div>
    </div>
  );
};
