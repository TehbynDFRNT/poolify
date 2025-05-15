import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface EditSectionLinkProps {
    section: string;
    customerId: string;
}

export const EditSectionLink: React.FC<EditSectionLinkProps> = ({ section, customerId }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/pool-builder?customerId=${customerId}`, { state: { defaultTab: section } });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={handleNavigation}
        >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
        </Button>
    );
}; 