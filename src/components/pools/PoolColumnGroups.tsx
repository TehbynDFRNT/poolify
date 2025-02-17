
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const columnGroups = [
  {
    id: "basic-info",
    title: "Basic Information",
    columns: ["Actions", "Name", "Dig Level", "Pool Size"],
  },
  {
    id: "dimensions",
    title: "Dimensions",
    columns: ["Length", "Width", "Shallow End", "Deep End"],
  },
  {
    id: "volume-info",
    title: "Volume Information",
    columns: ["Waterline L/M", "Water Volume (L)", "Salt Volume Bags", "Salt Volume Fixed", "Weight (KG)", "Minerals Initial/Topup"],
  },
  {
    id: "pricing",
    title: "Pricing",
    columns: ["Buy Price (ex GST)", "Buy Price (inc GST)"],
  },
];

interface PoolColumnGroupsProps {
  expandedGroups: string[];
  setExpandedGroups: (groups: string[]) => void;
}

export function PoolColumnGroups({ expandedGroups, setExpandedGroups }: PoolColumnGroupsProps) {
  return (
    <Accordion
      type="multiple"
      value={expandedGroups}
      onValueChange={setExpandedGroups}
      className="w-full"
    >
      {columnGroups.map((group) => (
        <AccordionItem key={group.id} value={group.id}>
          <AccordionTrigger className="px-4">
            {group.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Showing {group.columns.length} columns
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
