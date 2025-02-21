
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
