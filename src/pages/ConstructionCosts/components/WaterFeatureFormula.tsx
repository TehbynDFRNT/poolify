
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
              Total Cost = Water Feature (Size Price + Margin)
              + Back Cladding Price (if selected)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All prices in the system already include the margin, so no additional margin calculation is required.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">✅ Worked Example 1 – With Back Cladding</h3>
            <p className="text-sm font-medium">Water Feature Size: 1.6m x 0.8m</p>
            <ul className="text-sm list-disc pl-5 space-y-1 mt-1">
              <li>Base Price: $2,163</li>
              <li>Margin: $1,037</li>
              <li>Back Cladding: $1,000 (includes $300 margin)</li>
            </ul>
            <p className="text-sm font-medium mt-2">
              Total Cost: $3,200 + $1,000 = <span className="font-bold">$4,200</span>
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">✅ Worked Example 2 – Without Back Cladding</h3>
            <p className="text-sm font-medium">Water Feature Size: 2m x 1m</p>
            <ul className="text-sm list-disc pl-5 space-y-1 mt-1">
              <li>Base Price: $2,443</li>
              <li>Margin: $1,057</li>
              <li>Back Cladding: Not selected</li>
            </ul>
            <p className="text-sm font-medium mt-2">
              Total Cost: $2,443 + $1,057 = <span className="font-bold">$3,500</span>
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
