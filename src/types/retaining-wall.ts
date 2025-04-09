
export interface RetainingWall {
  id: string;
  type: string;
  rate: number;
  extra_rate: number;
  margin: number;
  total: number;
}

export const WALL_TYPES = [
  "Block Wall - Clad",
  "Block Wall - Finished Block Work",
  "Block Wall - Finished Block Work & Painted",
  "Block Wall - Rendered",
  "Block Wall - Rendered & Painted",
  "Drop Edge - Clad",
  "Drop Edge - Render",
  "Drop Edge - Render & Painted",
  "Drop Edge - Strip Finish",
  "Drop Edge - Strip Finish & Painted",
  "Timber"
] as const;
