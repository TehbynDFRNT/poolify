
import { Button } from "@/components/ui/button";
import { UnderFenceConcreteStrip } from "@/types/under-fence-concrete-strip";

interface AvailableStripsListProps {
  strips: UnderFenceConcreteStrip[];
  onAddStrip: (strip: UnderFenceConcreteStrip) => void;
}

export const AvailableStripsList = ({ strips, onAddStrip }: AvailableStripsListProps) => {
  if (!strips || strips.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {strips.map(strip => (
        <Button 
          key={strip.id} 
          variant="outline" 
          className="justify-between"
          onClick={() => onAddStrip(strip)}
        >
          <span>{strip.type}</span>
          <span className="font-bold">${strip.cost.toFixed(2)}</span>
        </Button>
      ))}
    </div>
  );
};
