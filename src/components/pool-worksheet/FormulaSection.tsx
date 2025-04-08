
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { columnLabels } from "./column-config";

export function FormulaSection() {
  // Define the column numbers and their corresponding column keys
  const trueCostFormula = [
    { number: 15, key: "buy_price_inc_gst" },
    { number: 17, key: "package_price" },
    { number: 19, key: "crane_cost" },
    { number: 21, key: "dig_total" },
    { number: 29, key: "total_cost" },
    { number: 40, key: "fixed_costs_total" }
  ];

  return (
    <div className="mt-8 border rounded-md p-4 bg-slate-50">
      <h2 className="text-xl font-bold mb-4">Formulas</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="true-cost">
          <AccordionTrigger className="text-md font-medium">
            True Cost Calculation
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-2">
              <p className="mb-2">
                The True Cost is calculated as the sum of the following columns:
              </p>
              
              <div className="bg-white p-3 rounded-md border mb-3">
                <code className="text-sm">
                  Column 15 ({columnLabels["buy_price_inc_gst"]}) + 
                  Column 17 ({columnLabels["package_price"]}) + 
                  Column 19 ({columnLabels["crane_cost"]}) + 
                  Column 21 ({columnLabels["dig_total"]}) + 
                  Column 29 ({columnLabels["total_cost"]}) + 
                  Column 40 ({columnLabels["fixed_costs_total"]})
                </code>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">In other words, True Cost equals:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {trueCostFormula.map((column) => (
                    <li key={column.key}>
                      {columnLabels[column.key]} (Column {column.number})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
