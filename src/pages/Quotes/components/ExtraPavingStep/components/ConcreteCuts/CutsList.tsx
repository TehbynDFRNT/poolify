
import { Button } from "@/components/ui/button";
import { ConcreteCut } from "@/types/concrete-cut";
import { ConcreteCutSelection } from "../../types";

interface CutsListProps {
  cuts: ConcreteCut[];
  onAddCut: (cut: ConcreteCut) => void;
  groupLabel: string;
}

export const CutsList = ({ cuts, onAddCut, groupLabel }: CutsListProps) => {
  if (cuts.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">{groupLabel}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {cuts.map(cut => (
          <Button 
            key={cut.id} 
            variant="outline" 
            className="justify-between"
            onClick={() => onAddCut(cut)}
          >
            <span>{cut.cut_type}</span>
            <span className="font-bold">${cut.price.toFixed(2)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
