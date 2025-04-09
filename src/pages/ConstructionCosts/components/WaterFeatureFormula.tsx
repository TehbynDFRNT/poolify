
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Droplets } from "lucide-react";

export const WaterFeatureFormula = () => {
  return (
    <AccordionItem value="water-feature-formula">
      <AccordionTrigger className="text-left font-medium">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          <span>Water Feature Formula</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-6 p-4 border border-dashed rounded-md">
          <div>
            <h3 className="text-md font-semibold mb-2">🧮 Formula:</h3>
            <p className="text-sm">
              Total Cost = Water Feature Size Total
              + Back Cladding Total (if selected)
              + Blade Total (if selected)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All prices include margin — do not apply additional markup.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">✅ Worked Example – Size + Cladding + 900mm Blade</h3>
            <p className="text-sm font-medium">Water Feature Size: 1.6m x 0.8m</p>
            <ul className="text-sm list-disc pl-5 space-y-1 mt-1">
              <li>Size: 1.6m x 0.8m = $3,200</li>
              <li>Back Cladding: $1,000</li>
              <li>Blade: 900mm = $300</li>
            </ul>
            <p className="text-sm font-medium mt-2">
              Total: <span className="font-bold">$4,500</span>
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">✅ Worked Example – Size + 1200mm Blade Only</h3>
            <p className="text-sm font-medium">Water Feature Size: 2m x 1m</p>
            <ul className="text-sm list-disc pl-5 space-y-1 mt-1">
              <li>Size: 2m x 1m = $3,500</li>
              <li>Blade: 1200mm = $400</li>
            </ul>
            <p className="text-sm font-medium mt-2">
              Total: <span className="font-bold">$3,900</span>
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
