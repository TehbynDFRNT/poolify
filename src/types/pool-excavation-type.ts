
export interface PoolExcavationType {
  id: string;
  range: string;
  name: string;
  dig_type_id: string;
  dig_type?: {
    name: string;
  };
}
