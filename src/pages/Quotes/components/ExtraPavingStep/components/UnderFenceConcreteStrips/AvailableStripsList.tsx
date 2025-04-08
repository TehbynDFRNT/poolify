
import { Button } from "@/components/ui/button";
import { UnderFenceConcreteStrip } from "@/types/under-fence-concrete-strip";

interface AvailableStripsListProps {
  strips: UnderFenceConcreteStrip[];
  onAddStrip: (strip: UnderFenceConcreteStrip) => void;
}

export const AvailableStripsList = ({ 
  strips, 
  onAddStrip 
}: AvailableStripsListProps) => {
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
          <span className="font-bold">${(strip.cost + strip.margin).toFixed(2)}</span>
        </Button>
      ))}
      
      {strips.length === 0 && (
        <div className="col-span-3 text-muted-foreground text-center py-4">
          No concrete strips defined in system
        </div>
      )}
    </div>
  );
};
