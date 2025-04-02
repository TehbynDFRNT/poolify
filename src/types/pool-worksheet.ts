
export interface PoolWorksheet {
  id: string;
  name: string;
  pool_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoolWorksheetItem {
  id: string;
  worksheet_id: string;
  category: string;
  item_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
