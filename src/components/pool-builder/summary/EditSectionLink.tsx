import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import React from 'react';

interface EditSectionLinkProps {
    section: string;
    customerId: string;
}

export const EditSectionLink: React.FC<EditSectionLinkProps> = ({ section, customerId }) => {
    return (
        <Button variant="ghost" size="sm" asChild>
            <a href={`/pool-builder/${customerId}/${section}`} className="flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
            </a>
        </Button>
    );
};

export default EditSectionLink; 