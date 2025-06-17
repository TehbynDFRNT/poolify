export type GeneralExtraType = 'Spa Jets' | 'Deck Jets' | 'Misc' | 'Hand Grab Rail' | 'Automation' | 'Chemistry' | 'Bundle';

export interface GeneralExtra {
    id: string;
    name: string;
    description?: string;
    type: GeneralExtraType;
    sku: string;
    cost: number;
    margin: number;
    rrp: number;
    created_at?: string;
    updated_at?: string;
}

// Helper function to calculate margin value
export const calculateMarginValue = (rrp: number, cost: number): number => {
    return rrp - cost;
};

// Helper function to map database fields to our GeneralExtra interface
export const mapDbToGeneralExtra = (data: any): GeneralExtra => {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type || 'Misc',
        sku: data.sku,
        cost: data.cost || 0,
        margin: data.margin || 0,
        rrp: data.rrp || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
}; 