import { supabase } from "@/integrations/supabase/client";

/**
 * Calculate margin for extra paving
 */
export async function calculateExtraPavingMargin(
  categoryId: string | null | undefined,
  squareMeters: number
): Promise<number> {
  if (!categoryId || squareMeters <= 0) return 0;

  const { data } = await supabase
    .from('extra_paving_costs')
    .select('margin_cost')
    .eq('id', categoryId)
    .single();

  return data ? data.margin_cost * squareMeters : 0;
}

/**
 * Calculate margin for extra concreting
 */
export async function calculateExtraConcretingMargin(
  concreteType: string | null | undefined,
  squareMeters: number
): Promise<number> {
  if (!concreteType || squareMeters <= 0) return 0;

  try {
    // The concrete type value is the string type, not an ID
    const { data } = await supabase
      .from('extra_concreting')
      .select('margin')
      .eq('type', concreteType)
      .maybeSingle();

    // If no data is found, try converting dash to space
    if (!data) {
      // Try replacing dashes with spaces in case that's the issue
      const formattedType = concreteType.replace(/-/g, ' ');
      const { data: altData } = await supabase
        .from('extra_concreting')
        .select('margin')
        .ilike('type', formattedType)
        .maybeSingle();

      return altData ? altData.margin * squareMeters : 0;
    }

    return data ? data.margin * squareMeters : 0;
  } catch (err) {
    console.error("Error fetching extra concreting margin:", err);
    return 0;
  }
}

/**
 * Calculate margin for under fence concrete strips
 */
export async function calculateUnderFenceStripsMargin(
  stripsData: any
): Promise<number> {
  if (!stripsData || !Array.isArray(stripsData)) return 0;

  let totalMargin = 0;

  for (const strip of stripsData) {
    if (strip && typeof strip === 'object' && 'id' in strip) {
      // Fetch the margin for this strip type
      const { data: stripData } = await supabase
        .from('under_fence_concrete_strips')
        .select('margin')
        .eq('id', strip.id)
        .single();

      if (stripData && stripData.margin) {
        // If the strip has a quantity/length property, use it, otherwise assume 1
        const quantity = typeof strip.length === 'number' ? strip.length :
          typeof strip.quantity === 'number' ? strip.quantity : 1;

        totalMargin += stripData.margin * quantity;
      }
    }
  }

  return totalMargin;
}

/**
 * Calculate concrete pump margin using a fixed 10% rate
 */
export function calculateConcretePumpMargin(cost: number): number {
  return cost > 0 ? cost * 0.1 : 0;
}

/**
 * Calculate concrete cuts margin using a fixed 10% rate
 */
export function calculateConcreteCutsMargin(cost: number): number {
  return cost > 0 ? cost * 0.1 : 0;
}
