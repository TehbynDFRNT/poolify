import { GeneralExtraType } from "./general-extra";

export interface PoolGeneralExtra {
    id: string;
    pool_project_id: string;
    general_extra_id: string;
    name: string;
    sku: string;
    type: GeneralExtraType;
    description?: string;
    quantity: number;
    cost: number;
    margin: number;
    rrp: number;
    total_cost: number;
    total_margin: number;
    total_rrp: number;
    created_at: string;
    updated_at?: string;
}

export interface PoolGeneralExtraInsert {
    pool_project_id: string;
    general_extra_id: string;
    name: string;
    sku: string;
    type: GeneralExtraType;
    description?: string;
    quantity: number;
    cost: number;
    margin: number;
    rrp: number;
}

export interface PoolGeneralExtrasState {
    spaJets: {
        selected: boolean;
        extraId: string | null;
        quantity: number; // 4 or 6
    };
    deckJets: {
        selected: boolean;
        extraId: string | null;
    };
    miscItems: {
        items: Array<{
            extraId: string;
            quantity: number;
        }>;
    };
}

// Helper function to convert database row to PoolGeneralExtra type
export const mapDbToPoolGeneralExtra = (data: any): PoolGeneralExtra => {
    return {
        id: data.id,
        pool_project_id: data.pool_project_id,
        general_extra_id: data.general_extra_id,
        name: data.name,
        sku: data.sku,
        type: data.type,
        description: data.description,
        quantity: data.quantity || 1,
        cost: data.cost || 0,
        margin: data.margin || 0,
        rrp: data.rrp || 0,
        total_cost: data.total_cost || 0,
        total_margin: data.total_margin || 0,
        total_rrp: data.total_rrp || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
}; 