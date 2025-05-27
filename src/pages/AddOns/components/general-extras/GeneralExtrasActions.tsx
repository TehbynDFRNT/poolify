import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GeneralExtrasActionsProps {
    onAddNew: () => void;
}

export const GeneralExtrasActions = ({ onAddNew }: GeneralExtrasActionsProps) => {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">General Extras</h2>
            <Button onClick={onAddNew} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Extra</span>
            </Button>
        </div>
    );
}; 