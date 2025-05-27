import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { useGeneralExtras } from "@/hooks/useGeneralExtras";
import { useState } from "react";
import { AddGeneralExtraForm } from "./AddGeneralExtraForm";
import { EmptyGeneralExtrasState } from "./EmptyGeneralExtrasState";
import { GeneralExtraRow } from "./GeneralExtraRow";
import { GeneralExtrasActions } from "./GeneralExtrasActions";
import { GeneralExtrasTableHeader } from "./GeneralExtrasTableHeader";

export const GeneralExtrasTable = () => {
    const { generalExtras, isLoading, deleteGeneralExtra } = useGeneralExtras();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDeleteExtra = (id: string) => {
        if (window.confirm("Are you sure you want to delete this extra item?")) {
            deleteGeneralExtra(id);
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading general extras...</div>;
    }

    return (
        <div className="space-y-4">
            <GeneralExtrasActions onAddNew={() => setIsDialogOpen(true)} />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <GeneralExtrasTableHeader />
                        <TableBody>
                            {!generalExtras || generalExtras.length === 0 ? (
                                <EmptyGeneralExtrasState />
                            ) : (
                                generalExtras?.map((extra) => (
                                    <GeneralExtraRow
                                        key={extra.id}
                                        extra={extra}
                                        onDelete={() => handleDeleteExtra(extra.id)}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddGeneralExtraForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}; 