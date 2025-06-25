import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface FencingCost {
    id: string;
    item: string;
    type: string;
    unit_price: string;
    display_order: number;
    created_at: string;
    category: string;
}

interface FencingCostMap {
    framelessGlassFencePerMeter: number;
    flatTopMetalFencePerMeter: number;
    framelessGlassGate: number;
    flatTopMetalGate: number;
    earthingFG: number;
    earthingFTM: number;
    retainingFGSimple: number;
    retainingFGComplex: number;
    retainingFTMSimple: number;
    retainingFTMComplex: number;
}

export const useFencingCosts = () => {
    return useQuery({
        queryKey: ['fencing-costs'],
        queryFn: async (): Promise<FencingCostMap> => {
            const { data, error } = await supabase
                .from('fencing_costs')
                .select('*');

            if (error) {
                throw error;
            }

            // Map the data to a more convenient structure
            const costMap: FencingCostMap = {
                framelessGlassFencePerMeter: 396, // defaults in case of error
                flatTopMetalFencePerMeter: 165,
                framelessGlassGate: 495,
                flatTopMetalGate: 297,
                earthingFG: 40,
                earthingFTM: 150,
                retainingFGSimple: 220,
                retainingFGComplex: 660,
                retainingFTMSimple: 220,
                retainingFTMComplex: 385,
            };

            // Parse the costs from the database
            data?.forEach((cost: FencingCost) => {
                const price = parseFloat(cost.unit_price);
                
                switch (cost.item) {
                    case 'Frameless Glass':
                        if (cost.type === 'Fence (per meter)') {
                            costMap.framelessGlassFencePerMeter = price;
                        }
                        break;
                    case 'Flat Top Metal':
                        if (cost.type === 'Fence (per meter)') {
                            costMap.flatTopMetalFencePerMeter = price;
                        }
                        break;
                    case 'Frameless Glass Gate':
                        costMap.framelessGlassGate = price;
                        break;
                    case 'Flat Top Metal Gate':
                        costMap.flatTopMetalGate = price;
                        break;
                    case 'Earthing (FG)':
                        costMap.earthingFG = price;
                        break;
                    case 'Earthing (FTM)':
                        costMap.earthingFTM = price;
                        break;
                    case 'Retaining (FG Simple)':
                        costMap.retainingFGSimple = price;
                        break;
                    case 'Retaining (FG Complex)':
                        costMap.retainingFGComplex = price;
                        break;
                    case 'Retaining (FTM Simple)':
                        costMap.retainingFTMSimple = price;
                        break;
                    case 'Retaining (FTM Complex)':
                        costMap.retainingFTMComplex = price;
                        break;
                }
            });

            return costMap;
        },
        staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
        gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    });
};