import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pool } from '@/types/pool';
import { ReactNode } from 'react';

interface PlaceholderSummaryProps {
    pool: Pool;
    customerId: string;
    title: string;
    sectionId: string;
    icon: ReactNode;
    data: any;
}

export const PlaceholderSummary: React.FC<PlaceholderSummaryProps> = ({
    pool,
    customerId,
    title,
    sectionId,
    icon,
    data
}) => {
    return (
        <Card className="shadow-md">
            <CardContent className="py-6">
                <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        No {title.toLowerCase()} have been added to this project yet.
                    </p>

                    <Button asChild variant="outline" size="sm">
                        <a href={`/pool-builder/${customerId}/${sectionId}`}>
                            Add {title}
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}; 