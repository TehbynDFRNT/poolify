import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const GeneralExtrasTableHeader = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[15%]">Name</TableHead>
                <TableHead className="w-[10%]">SKU</TableHead>
                <TableHead className="w-[10%]">Type</TableHead>
                <TableHead className="w-[20%]">Description</TableHead>
                <TableHead className="w-[10%] text-right">Cost ($)</TableHead>
                <TableHead className="w-[10%] text-right">Margin ($)</TableHead>
                <TableHead className="w-[10%] text-right">RRP ($)</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
    );
}; 