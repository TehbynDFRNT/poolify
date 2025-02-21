export interface RetainingWall {
  needed: string;
  wall_type: string;
  cladding_style: string;
  paint_color: string;
  height_1: number;
  height_2: number;
  length: number;
  square_meters: number;
  total: number;
}

export interface QuoteFormData {
  // Core Customer Information
  customer_name: string;
  phone_number: string;
  email: string;
  site_address: string;
  pool_model: string;
  pool_color: string;
  coping_type: string;
  base_installation_cost: number;

  // Retaining Walls
  retaining_walls: {
    wall_1: RetainingWall;
    wall_2: RetainingWall;
    wall_3: RetainingWall;
    wall_4: RetainingWall;
    concrete_pump_needed: string;
    concrete_pump_price: number;
  };

  // Site Costs
  bobcat_runout: string;
  number_of_trucks: number;
  excavation_type: string;
  crane_hire: string;
  traffic_control: string;

  // Extra Paving
  paving_type: string;
  total_square_meters: number;
  laying_cost: number;

  // Extra Paving on Existing Concrete
  modification_type: string;
  additional_concrete_work: string;

  // Retaining Walls
  wall_type: string;
  wall_length: number;
  wall_installation_cost: number;

  // Add-ons
  equipment_upgrades: string[];
  drainage_upgrades: string;

  // Water Features
  feature_type: string;
  feature_installation_cost: number;

  // Third-Party Costs
  council_approvals: string;
  form_15_lodgement: string;
  engineering_reports: string;

  // Fencing
  temporary_pool_fence: string;
  permanent_fencing: string;

  // Electrical
  electrical_wiring: string;
  additional_power_requirements: string;
}
