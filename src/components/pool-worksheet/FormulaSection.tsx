
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { columnLabels } from "./column-config";

export function FormulaSection() {
  return (
    <div className="mt-8 border rounded-md p-4 bg-slate-50">
      <h2 className="text-xl font-bold mb-4">Formulas</h2>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="true-cost">
        <AccordionItem value="true-cost">
          <AccordionTrigger className="text-md font-medium">
            True Cost Calculation
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-2">
              <p className="mb-2">
                The True Cost is calculated as the sum of the following six values:
              </p>
              
              <div className="bg-white p-3 rounded-md border mb-3">
                <code className="text-sm font-bold">
                  Buy Price (inc GST) + 
                  Fixed Costs Total + 
                  Filtration Costs + 
                  Crane Costs + 
                  Excavation Costs + 
                  Individual Costs
                </code>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">In other words, True Cost equals:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{columnLabels["buy_price_inc_gst"]}</li>
                  <li>{columnLabels["fixed_costs_total"]}</li>
                  <li>{columnLabels["filtration_costs"]}</li>
                  <li>{columnLabels["crane_cost"]}</li>
                  <li>{columnLabels["excavation"]}</li>
                  <li>{columnLabels["individual_costs"]}</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="margin">
          <AccordionTrigger className="text-md font-medium">
            Margin and Web Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-2">
              <p className="mb-2">
                The Margin % is editable and determines the markup on the True Cost.
              </p>
              
              <div className="bg-white p-3 rounded-md border mb-3">
                <code className="text-sm font-bold">
                  Web Price = True Cost * (1 + Margin % / 100)
                </code>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">For example:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>If True Cost is $30,000 and Margin is 25%, then Web Price is $37,500</li>
                  <li>If True Cost is $30,000 and Margin is 30%, then Web Price is $39,000</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
