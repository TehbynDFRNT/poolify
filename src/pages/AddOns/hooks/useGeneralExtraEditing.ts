import { useGeneralExtras } from "@/hooks/useGeneralExtras";
import { useState } from "react";

export const useGeneralExtraEditing = () => {
    const { updateGeneralExtra } = useGeneralExtras();
    const [editingCells, setEditingCells] = useState<Record<string, Record<string, boolean>>>({});
    const [editValues, setEditValues] = useState<Record<string, Record<string, any>>>({});

    const handleEditStart = (id: string, field: string, value: any) => {
        setEditingCells(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: true }
        }));
        setEditValues(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleEditCancel = (id: string, field: string) => {
        setEditingCells(prev => {
            const newState = { ...prev };
            if (newState[id]) {
                delete newState[id][field];
                if (Object.keys(newState[id]).length === 0) {
                    delete newState[id];
                }
            }
            return newState;
        });
    };

    const handleEditSave = (id: string, field: string) => {
        if (!editValues[id] || editValues[id][field] === undefined) {
            handleEditCancel(id, field);
            return;
        }

        // Update the field in the database
        updateGeneralExtra({
            id,
            updates: { [field]: editValues[id][field] }
        });

        // Clear the editing state for this cell
        handleEditCancel(id, field);
    };

    const handleEditChange = (id: string, field: string, value: any) => {
        setEditValues(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleEditKeyDown = (e: React.KeyboardEvent, id: string, field: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleEditSave(id, field);
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleEditCancel(id, field);
        }
    };

    return {
        editingCells,
        editValues,
        handleEditStart,
        handleEditCancel,
        handleEditSave,
        handleEditChange,
        handleEditKeyDown
    };
}; 