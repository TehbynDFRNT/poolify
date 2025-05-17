import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type ExtraConcretingType = {
    id: string;
    type: string;
    price: number;
    margin: number;
    display_order: number;
};

export const useExtraConcreting = () => {
    const { data: concretingTypes, isLoading, error } = useQuery({
        queryKey: ["extra-concreting-types"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("extra_concreting")
                .select("id, type, price, margin, display_order")
                .order("display_order", { ascending: true });

            if (error) {
                console.error("Error fetching extra concreting types:", error);
                throw error;
            }

            return data as ExtraConcretingType[];
        },
    });

    return {
        concretingTypes: concretingTypes || [],
        isLoading,
        error,
    };
}; 