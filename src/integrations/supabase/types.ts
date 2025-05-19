export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "3d": {
        Row: {
          created_at: string | null
          id: string
          pool_project_id: string | null
          video_path: string | null
          video_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pool_project_id?: string | null
          video_path?: string | null
          video_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pool_project_id?: string | null
          video_path?: string | null
          video_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "3d_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "3d_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
        ]
      }
      blanket_rollers: {
        Row: {
          created_at: string
          description: string
          id: string
          margin: number
          pool_model: string
          pool_range: string
          rrp: number
          sku: string
          trade: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          margin: number
          pool_model: string
          pool_range: string
          rrp: number
          sku: string
          trade: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          margin?: number
          pool_model?: string
          pool_range?: string
          rrp?: number
          sku?: string
          trade?: number
        }
        Relationships: []
      }
      bobcat_costs: {
        Row: {
          created_at: string
          day_code: string
          display_order: number
          id: string
          price: number
          size_category: string
        }
        Insert: {
          created_at?: string
          day_code: string
          display_order: number
          id?: string
          price: number
          size_category: string
        }
        Update: {
          created_at?: string
          day_code?: string
          display_order?: number
          id?: string
          price?: number
          size_category?: string
        }
        Relationships: []
      }
      change_requests: {
        Row: {
          change_request_id: string
          change_request_json: Json
          created_at: string
          pool_proposal_status_id: string
        }
        Insert: {
          change_request_id?: string
          change_request_json: Json
          created_at?: string
          pool_proposal_status_id: string
        }
        Update: {
          change_request_id?: string
          change_request_json?: Json
          created_at?: string
          pool_proposal_status_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_pool_proposal_status_id_fkey"
            columns: ["pool_proposal_status_id"]
            isOneToOne: false
            referencedRelation: "pool_proposal_status"
            referencedColumns: ["pool_project_id"]
          },
        ]
      }
      concrete_costs: {
        Row: {
          concrete_cost: number
          created_at: string
          description: string
          display_order: number
          dust_cost: number
          id: string
          total_cost: number
          updated_at: string | null
        }
        Insert: {
          concrete_cost: number
          created_at?: string
          description: string
          display_order: number
          dust_cost: number
          id?: string
          total_cost: number
          updated_at?: string | null
        }
        Update: {
          concrete_cost?: number
          created_at?: string
          description?: string
          display_order?: number
          dust_cost?: number
          id?: string
          total_cost?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      concrete_cuts: {
        Row: {
          created_at: string
          cut_type: string
          display_order: number
          id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cut_type: string
          display_order: number
          id?: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cut_type?: string
          display_order?: number
          id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      concrete_labour: {
        Row: {
          created_at: string
          display_order: number
          id: string
          margin: number
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          margin: number
          price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          margin?: number
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      concrete_labour_costs: {
        Row: {
          cost: number
          created_at: string
          description: string
          display_order: number
          id: string
          margin: number
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string
          description: string
          display_order: number
          id?: string
          margin: number
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          margin?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      concrete_pump: {
        Row: {
          created_at: string
          id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      construction_materials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          price_per_unit: number
          unit: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price_per_unit: number
          unit: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price_per_unit?: number
          unit?: string
        }
        Relationships: []
      }
      crane_costs: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      deck_jets: {
        Row: {
          cost_price: number
          created_at: string
          description: string
          id: string
          margin: number
          model_number: string
          total: number
        }
        Insert: {
          cost_price: number
          created_at?: string
          description: string
          id?: string
          margin: number
          model_number: string
          total: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          description?: string
          id?: string
          margin?: number
          model_number?: string
          total?: number
        }
        Relationships: []
      }
      dig_types: {
        Row: {
          created_at: string
          excavation_hourly_rate: number
          excavation_hours: number
          id: string
          name: string
          truck_hourly_rate: number
          truck_hours: number
          truck_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          excavation_hourly_rate: number
          excavation_hours: number
          id?: string
          name: string
          truck_hourly_rate: number
          truck_hours: number
          truck_quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          excavation_hourly_rate?: number
          excavation_hours?: number
          id?: string
          name?: string
          truck_hourly_rate?: number
          truck_hours?: number
          truck_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      electrical_costs: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          rate?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      extra_concreting: {
        Row: {
          created_at: string
          display_order: number
          id: string
          margin: number
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          margin?: number
          price?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          margin?: number
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      extra_paving_costs: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          margin_cost: number
          paver_cost: number
          updated_at: string
          wastage_cost: number
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          id?: string
          margin_cost?: number
          paver_cost?: number
          updated_at?: string
          wastage_cost?: number
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          margin_cost?: number
          paver_cost?: number
          updated_at?: string
          wastage_cost?: number
        }
        Relationships: []
      }
      fencing_costs: {
        Row: {
          category: string | null
          created_at: string
          display_order: number | null
          id: string
          item: string
          type: string
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          item: string
          type: string
          unit_price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          item?: string
          type?: string
          unit_price?: number
        }
        Relationships: []
      }
      filtration_component_types: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      filtration_components: {
        Row: {
          created_at: string
          description: string | null
          id: string
          model_number: string
          name: string
          price_ex_gst: number | null
          price_inc_gst: number
          type_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          model_number: string
          name: string
          price_ex_gst?: number | null
          price_inc_gst: number
          type_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          model_number?: string
          name?: string
          price_ex_gst?: number | null
          price_inc_gst?: number
          type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filtration_components_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "filtration_component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      filtration_packages: {
        Row: {
          created_at: string
          display_order: number
          filter_id: string | null
          filter_type: string | null
          handover_kit_id: string | null
          id: string
          light_id: string | null
          name: string
          pump_id: string | null
          sanitiser_id: string | null
        }
        Insert: {
          created_at?: string
          display_order: number
          filter_id?: string | null
          filter_type?: string | null
          handover_kit_id?: string | null
          id?: string
          light_id?: string | null
          name: string
          pump_id?: string | null
          sanitiser_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          filter_id?: string | null
          filter_type?: string | null
          handover_kit_id?: string | null
          id?: string
          light_id?: string | null
          name?: string
          pump_id?: string | null
          sanitiser_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filtration_packages_filter_id_fkey"
            columns: ["filter_id"]
            isOneToOne: false
            referencedRelation: "filtration_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filtration_packages_handover_kit_id_fkey"
            columns: ["handover_kit_id"]
            isOneToOne: false
            referencedRelation: "handover_kit_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filtration_packages_light_id_fkey"
            columns: ["light_id"]
            isOneToOne: false
            referencedRelation: "filtration_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filtration_packages_pump_id_fkey"
            columns: ["pump_id"]
            isOneToOne: false
            referencedRelation: "filtration_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filtration_packages_sanitiser_id_fkey"
            columns: ["sanitiser_id"]
            isOneToOne: false
            referencedRelation: "filtration_components"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_costs: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      flat_top_metal_fencing: {
        Row: {
          complex_panels: number
          created_at: string
          customer_id: string
          earthing_required: boolean
          gates: number
          id: string
          linear_meters: number
          simple_panels: number
          total_cost: number
          updated_at: string
        }
        Insert: {
          complex_panels?: number
          created_at?: string
          customer_id: string
          earthing_required?: boolean
          gates?: number
          id?: string
          linear_meters?: number
          simple_panels?: number
          total_cost?: number
          updated_at?: string
        }
        Update: {
          complex_panels?: number
          created_at?: string
          customer_id?: string
          earthing_required?: boolean
          gates?: number
          id?: string
          linear_meters?: number
          simple_panels?: number
          total_cost?: number
          updated_at?: string
        }
        Relationships: []
      }
      frameless_glass_fencing: {
        Row: {
          complex_panels: number
          created_at: string
          customer_id: string
          earthing_required: boolean
          gates: number
          id: string
          linear_meters: number
          simple_panels: number
          total_cost: number
          updated_at: string
        }
        Insert: {
          complex_panels?: number
          created_at?: string
          customer_id: string
          earthing_required?: boolean
          gates?: number
          id?: string
          linear_meters?: number
          simple_panels?: number
          total_cost?: number
          updated_at?: string
        }
        Update: {
          complex_panels?: number
          created_at?: string
          customer_id?: string
          earthing_required?: boolean
          gates?: number
          id?: string
          linear_meters?: number
          simple_panels?: number
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "frameless_glass_fencing_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frameless_glass_fencing_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "frameless_glass_fencing_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      hand_grab_rails: {
        Row: {
          cost_price: number
          created_at: string
          description: string
          id: string
          margin: number
          model_number: string
          total: number
        }
        Insert: {
          cost_price: number
          created_at?: string
          description: string
          id?: string
          margin: number
          model_number: string
          total: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          description?: string
          id?: string
          margin?: number
          model_number?: string
          total?: number
        }
        Relationships: []
      }
      handover_kit_package_components: {
        Row: {
          component_id: string
          created_at: string
          id: string
          package_id: string
          quantity: number
        }
        Insert: {
          component_id: string
          created_at?: string
          id?: string
          package_id: string
          quantity?: number
        }
        Update: {
          component_id?: string
          created_at?: string
          id?: string
          package_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "handover_kit_package_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "filtration_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handover_kit_package_components_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "handover_kit_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      handover_kit_packages: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      hardware_upgrades: {
        Row: {
          category: string
          cost_price: number
          created_at: string
          description: string
          id: string
          margin: number
          model_number: string
          total: number
        }
        Insert: {
          category: string
          cost_price: number
          created_at?: string
          description: string
          id?: string
          margin: number
          model_number: string
          total: number
        }
        Update: {
          category?: string
          cost_price?: number
          created_at?: string
          description?: string
          id?: string
          margin?: number
          model_number?: string
          total?: number
        }
        Relationships: []
      }
      heat_pump_pool_compatibility: {
        Row: {
          created_at: string
          heat_pump_id: string
          hp_description: string
          hp_sku: string
          id: string
          pool_model: string
          pool_range: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          heat_pump_id: string
          hp_description: string
          hp_sku: string
          id?: string
          pool_model: string
          pool_range: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          heat_pump_id?: string
          hp_description?: string
          hp_sku?: string
          id?: string
          pool_model?: string
          pool_range?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "heat_pump_pool_compatibility_heat_pump_id_fkey"
            columns: ["heat_pump_id"]
            isOneToOne: false
            referencedRelation: "heat_pump_products"
            referencedColumns: ["id"]
          },
        ]
      }
      heat_pump_products: {
        Row: {
          cost: number
          created_at: string
          hp_description: string
          hp_sku: string
          id: string
          margin: number
          rrp: number
          updated_at: string
        }
        Insert: {
          cost: number
          created_at?: string
          hp_description: string
          hp_sku: string
          id?: string
          margin: number
          rrp: number
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          hp_description?: string
          hp_sku?: string
          id?: string
          margin?: number
          rrp?: number
          updated_at?: string
        }
        Relationships: []
      }
      heating_installations: {
        Row: {
          created_at: string
          id: string
          installation_cost: number
          installation_inclusions: string
          installation_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          installation_cost: number
          installation_inclusions: string
          installation_type: string
        }
        Update: {
          created_at?: string
          id?: string
          installation_cost?: number
          installation_inclusions?: string
          installation_type?: string
        }
        Relationships: []
      }
      lighting_options: {
        Row: {
          cost_price: number
          created_at: string
          description: string
          id: string
          margin: number
          model_number: string
          total: number
        }
        Insert: {
          cost_price: number
          created_at?: string
          description: string
          id?: string
          margin: number
          model_number: string
          total: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          description?: string
          id?: string
          margin?: number
          model_number?: string
          total?: number
        }
        Relationships: []
      }
      pool_blankets: {
        Row: {
          blanket_description: string
          blanket_margin: number
          blanket_rrp: number
          blanket_sku: string
          blanket_trade: number
          created_at: string
          heatpump_description: string
          heatpump_margin: number
          heatpump_rrp: number
          heatpump_sku: string
          heatpump_trade: number
          id: string
          pool_model: string
          pool_range: string
        }
        Insert: {
          blanket_description: string
          blanket_margin?: number
          blanket_rrp?: number
          blanket_sku: string
          blanket_trade?: number
          created_at?: string
          heatpump_description: string
          heatpump_margin?: number
          heatpump_rrp?: number
          heatpump_sku: string
          heatpump_trade?: number
          id?: string
          pool_model: string
          pool_range: string
        }
        Update: {
          blanket_description?: string
          blanket_margin?: number
          blanket_rrp?: number
          blanket_sku?: string
          blanket_trade?: number
          created_at?: string
          heatpump_description?: string
          heatpump_margin?: number
          heatpump_rrp?: number
          heatpump_sku?: string
          heatpump_trade?: number
          id?: string
          pool_model?: string
          pool_range?: string
        }
        Relationships: []
      }
      pool_cleaner_selections: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          include_cleaner: boolean
          pool_cleaner_id: string
          pool_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          include_cleaner?: boolean
          pool_cleaner_id: string
          pool_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          include_cleaner?: boolean
          pool_cleaner_id?: string
          pool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_cleaner_selections_pool_cleaner_id_fkey"
            columns: ["pool_cleaner_id"]
            isOneToOne: false
            referencedRelation: "pool_cleaners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_cleaner_selections_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_cleaners: {
        Row: {
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          margin: number
          model_number: string
          name: string
          price: number
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          margin: number
          model_number: string
          name: string
          price: number
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          margin?: number
          model_number?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      pool_costs: {
        Row: {
          beam: number
          coping_lay: number
          coping_supply: number
          created_at: string
          id: string
          install_fee: number
          misc: number
          pea_gravel: number
          pool_id: string
          salt_bags: number
          trucked_water: number
          updated_at: string
        }
        Insert: {
          beam?: number
          coping_lay?: number
          coping_supply?: number
          created_at?: string
          id?: string
          install_fee?: number
          misc?: number
          pea_gravel?: number
          pool_id: string
          salt_bags?: number
          trucked_water?: number
          updated_at?: string
        }
        Update: {
          beam?: number
          coping_lay?: number
          coping_supply?: number
          created_at?: string
          id?: string
          install_fee?: number
          misc?: number
          pea_gravel?: number
          pool_id?: string
          salt_bags?: number
          trucked_water?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_costs_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: true
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_crane_selections: {
        Row: {
          crane_id: string
          created_at: string
          id: string
          pool_id: string
          updated_at: string
        }
        Insert: {
          crane_id: string
          created_at?: string
          id?: string
          pool_id: string
          updated_at?: string
        }
        Update: {
          crane_id?: string
          created_at?: string
          id?: string
          pool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_crane_selections_crane_id_fkey"
            columns: ["crane_id"]
            isOneToOne: false
            referencedRelation: "crane_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_crane_selections_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: true
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_dig_type_matches: {
        Row: {
          created_at: string
          dig_type_id: string
          id: string
          pool_id: string
        }
        Insert: {
          created_at?: string
          dig_type_id: string
          id?: string
          pool_id: string
        }
        Update: {
          created_at?: string
          dig_type_id?: string
          id?: string
          pool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_dig_type_matches_dig_type_id_fkey"
            columns: ["dig_type_id"]
            isOneToOne: false
            referencedRelation: "dig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_dig_type_matches_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: true
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_electrical_requirements: {
        Row: {
          created_at: string
          customer_id: string
          fence_earthing: boolean
          heat_pump_circuit: boolean
          id: string
          pool_id: string
          standard_power: boolean
          total_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          fence_earthing?: boolean
          heat_pump_circuit?: boolean
          id?: string
          pool_id: string
          standard_power?: boolean
          total_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          fence_earthing?: boolean
          heat_pump_circuit?: boolean
          id?: string
          pool_id?: string
          standard_power?: boolean
          total_cost?: number
          updated_at?: string
        }
        Relationships: []
      }
      pool_heating_options: {
        Row: {
          blanket_roller_cost: number
          blanket_roller_id: string | null
          created_at: string
          customer_id: string
          heat_pump_cost: number
          heat_pump_id: string | null
          id: string
          include_blanket_roller: boolean
          include_heat_pump: boolean
          pool_id: string
          total_cost: number
          total_margin: number
          updated_at: string
        }
        Insert: {
          blanket_roller_cost?: number
          blanket_roller_id?: string | null
          created_at?: string
          customer_id: string
          heat_pump_cost?: number
          heat_pump_id?: string | null
          id?: string
          include_blanket_roller?: boolean
          include_heat_pump?: boolean
          pool_id: string
          total_cost?: number
          total_margin?: number
          updated_at?: string
        }
        Update: {
          blanket_roller_cost?: number
          blanket_roller_id?: string | null
          created_at?: string
          customer_id?: string
          heat_pump_cost?: number
          heat_pump_id?: string | null
          id?: string
          include_blanket_roller?: boolean
          include_heat_pump?: boolean
          pool_id?: string
          total_cost?: number
          total_margin?: number
          updated_at?: string
        }
        Relationships: []
      }
      pool_individual_costs: {
        Row: {
          cost_value: number
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          range: string
        }
        Insert: {
          cost_value?: number
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          range?: string
        }
        Update: {
          cost_value?: number
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          range?: string
        }
        Relationships: []
      }
      pool_margins: {
        Row: {
          created_at: string
          id: string
          margin_percentage: number
          pool_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          margin_percentage?: number
          pool_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          margin_percentage?: number
          pool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_margins_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: true
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_projects: {
        Row: {
          blanket_roller_cost: number
          blanket_roller_id: string | null
          bobcat_id: string | null
          concrete_cuts: string | null
          concrete_cuts_cost: number | null
          concrete_pump_needed: boolean | null
          concrete_pump_quantity: number | null
          concrete_pump_total_cost: number | null
          crane_id: string | null
          created_at: string
          email: string
          existing_concrete_paving_category: string | null
          existing_concrete_paving_square_meters: number | null
          existing_concrete_paving_total_cost: number | null
          extra_concreting_square_meters: number | null
          extra_concreting_total_cost: number | null
          extra_concreting_type: string | null
          extra_paving_category: string | null
          extra_paving_square_meters: number | null
          extra_paving_total_cost: number | null
          heat_pump_cost: number
          heat_pump_id: string | null
          heating_total_cost: number
          heating_total_margin: number
          home_address: string
          id: string
          include_blanket_roller: boolean
          include_heat_pump: boolean
          installation_area: string
          owner1: string
          owner2: string | null
          phone: string
          pool_color: string | null
          pool_specification_id: string | null
          proposal_name: string
          render_ready: boolean
          resident_homeowner: boolean
          retaining_wall1_height1: number | null
          retaining_wall1_height2: number | null
          retaining_wall1_length: number | null
          retaining_wall1_total_cost: number | null
          retaining_wall1_type: string | null
          retaining_wall2_height1: number | null
          retaining_wall2_height2: number | null
          retaining_wall2_length: number | null
          retaining_wall2_total_cost: number | null
          retaining_wall2_type: string | null
          retaining_wall3_height1: number | null
          retaining_wall3_height2: number | null
          retaining_wall3_length: number | null
          retaining_wall3_total_cost: number | null
          retaining_wall3_type: string | null
          retaining_wall4_height1: number | null
          retaining_wall4_height2: number | null
          retaining_wall4_length: number | null
          retaining_wall4_total_cost: number | null
          retaining_wall4_type: string | null
          site_address: string | null
          site_requirements_data: Json | null
          site_requirements_notes: string | null
          traffic_control_id: string | null
          under_fence_concrete_strips_cost: number | null
          under_fence_concrete_strips_data: Json | null
          updated_at: string
        }
        Insert: {
          blanket_roller_cost?: number
          blanket_roller_id?: string | null
          bobcat_id?: string | null
          concrete_cuts?: string | null
          concrete_cuts_cost?: number | null
          concrete_pump_needed?: boolean | null
          concrete_pump_quantity?: number | null
          concrete_pump_total_cost?: number | null
          crane_id?: string | null
          created_at?: string
          email: string
          existing_concrete_paving_category?: string | null
          existing_concrete_paving_square_meters?: number | null
          existing_concrete_paving_total_cost?: number | null
          extra_concreting_square_meters?: number | null
          extra_concreting_total_cost?: number | null
          extra_concreting_type?: string | null
          extra_paving_category?: string | null
          extra_paving_square_meters?: number | null
          extra_paving_total_cost?: number | null
          heat_pump_cost?: number
          heat_pump_id?: string | null
          heating_total_cost?: number
          heating_total_margin?: number
          home_address: string
          id?: string
          include_blanket_roller?: boolean
          include_heat_pump?: boolean
          installation_area: string
          owner1: string
          owner2?: string | null
          phone: string
          pool_color?: string | null
          pool_specification_id?: string | null
          proposal_name: string
          render_ready?: boolean
          resident_homeowner?: boolean
          retaining_wall1_height1?: number | null
          retaining_wall1_height2?: number | null
          retaining_wall1_length?: number | null
          retaining_wall1_total_cost?: number | null
          retaining_wall1_type?: string | null
          retaining_wall2_height1?: number | null
          retaining_wall2_height2?: number | null
          retaining_wall2_length?: number | null
          retaining_wall2_total_cost?: number | null
          retaining_wall2_type?: string | null
          retaining_wall3_height1?: number | null
          retaining_wall3_height2?: number | null
          retaining_wall3_length?: number | null
          retaining_wall3_total_cost?: number | null
          retaining_wall3_type?: string | null
          retaining_wall4_height1?: number | null
          retaining_wall4_height2?: number | null
          retaining_wall4_length?: number | null
          retaining_wall4_total_cost?: number | null
          retaining_wall4_type?: string | null
          site_address?: string | null
          site_requirements_data?: Json | null
          site_requirements_notes?: string | null
          traffic_control_id?: string | null
          under_fence_concrete_strips_cost?: number | null
          under_fence_concrete_strips_data?: Json | null
          updated_at?: string
        }
        Update: {
          blanket_roller_cost?: number
          blanket_roller_id?: string | null
          bobcat_id?: string | null
          concrete_cuts?: string | null
          concrete_cuts_cost?: number | null
          concrete_pump_needed?: boolean | null
          concrete_pump_quantity?: number | null
          concrete_pump_total_cost?: number | null
          crane_id?: string | null
          created_at?: string
          email?: string
          existing_concrete_paving_category?: string | null
          existing_concrete_paving_square_meters?: number | null
          existing_concrete_paving_total_cost?: number | null
          extra_concreting_square_meters?: number | null
          extra_concreting_total_cost?: number | null
          extra_concreting_type?: string | null
          extra_paving_category?: string | null
          extra_paving_square_meters?: number | null
          extra_paving_total_cost?: number | null
          heat_pump_cost?: number
          heat_pump_id?: string | null
          heating_total_cost?: number
          heating_total_margin?: number
          home_address?: string
          id?: string
          include_blanket_roller?: boolean
          include_heat_pump?: boolean
          installation_area?: string
          owner1?: string
          owner2?: string | null
          phone?: string
          pool_color?: string | null
          pool_specification_id?: string | null
          proposal_name?: string
          render_ready?: boolean
          resident_homeowner?: boolean
          retaining_wall1_height1?: number | null
          retaining_wall1_height2?: number | null
          retaining_wall1_length?: number | null
          retaining_wall1_total_cost?: number | null
          retaining_wall1_type?: string | null
          retaining_wall2_height1?: number | null
          retaining_wall2_height2?: number | null
          retaining_wall2_length?: number | null
          retaining_wall2_total_cost?: number | null
          retaining_wall2_type?: string | null
          retaining_wall3_height1?: number | null
          retaining_wall3_height2?: number | null
          retaining_wall3_length?: number | null
          retaining_wall3_total_cost?: number | null
          retaining_wall3_type?: string | null
          retaining_wall4_height1?: number | null
          retaining_wall4_height2?: number | null
          retaining_wall4_length?: number | null
          retaining_wall4_total_cost?: number | null
          retaining_wall4_type?: string | null
          site_address?: string | null
          site_requirements_data?: Json | null
          site_requirements_notes?: string | null
          traffic_control_id?: string | null
          under_fence_concrete_strips_cost?: number | null
          under_fence_concrete_strips_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_extra_paving_category"
            columns: ["extra_paving_category"]
            isOneToOne: false
            referencedRelation: "extra_paving_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_projects_bobcat_id_fkey"
            columns: ["bobcat_id"]
            isOneToOne: false
            referencedRelation: "bobcat_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_projects_crane_id_fkey"
            columns: ["crane_id"]
            isOneToOne: false
            referencedRelation: "crane_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_projects_pool_specification_id_fkey"
            columns: ["pool_specification_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_projects_traffic_control_id_fkey"
            columns: ["traffic_control_id"]
            isOneToOne: false
            referencedRelation: "traffic_control_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_proposal_status: {
        Row: {
          accepted_datetime: string | null
          accepted_ip: string | null
          last_change_requested: string | null
          last_viewed: string | null
          pin: string
          pool_project_id: string
          render_ready: boolean
          status: string
          version: number
        }
        Insert: {
          accepted_datetime?: string | null
          accepted_ip?: string | null
          last_change_requested?: string | null
          last_viewed?: string | null
          pin: string
          pool_project_id: string
          render_ready?: boolean
          status?: string
          version?: number
        }
        Update: {
          accepted_datetime?: string | null
          accepted_ip?: string | null
          last_change_requested?: string | null
          last_viewed?: string | null
          pin?: string
          pool_project_id?: string
          render_ready?: boolean
          status?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pool_proposal_status_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: true
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_proposal_status_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: true
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
        ]
      }
      pool_ranges: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      pool_selections: {
        Row: {
          color: string | null
          created_at: string
          customer_id: string
          id: string
          pool_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          customer_id: string
          id?: string
          pool_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          pool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_selections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_selections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "pool_selections_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_specifications: {
        Row: {
          buy_price_ex_gst: number | null
          buy_price_inc_gst: number | null
          created_at: string
          default_filtration_package_id: string | null
          depth_deep: number
          depth_shallow: number
          dig_level: string | null
          dig_type_id: string | null
          id: string
          length: number
          minerals_kg_initial: number | null
          minerals_kg_topup: number | null
          name: string
          outline_image_url: string | null
          pool_type_id: string | null
          range: string
          salt_volume_bags: number | null
          salt_volume_bags_fixed: number | null
          volume_liters: number | null
          waterline_l_m: number | null
          weight_kg: number | null
          width: number
        }
        Insert: {
          buy_price_ex_gst?: number | null
          buy_price_inc_gst?: number | null
          created_at?: string
          default_filtration_package_id?: string | null
          depth_deep: number
          depth_shallow: number
          dig_level?: string | null
          dig_type_id?: string | null
          id?: string
          length: number
          minerals_kg_initial?: number | null
          minerals_kg_topup?: number | null
          name?: string
          outline_image_url?: string | null
          pool_type_id?: string | null
          range?: string
          salt_volume_bags?: number | null
          salt_volume_bags_fixed?: number | null
          volume_liters?: number | null
          waterline_l_m?: number | null
          weight_kg?: number | null
          width: number
        }
        Update: {
          buy_price_ex_gst?: number | null
          buy_price_inc_gst?: number | null
          created_at?: string
          default_filtration_package_id?: string | null
          depth_deep?: number
          depth_shallow?: number
          dig_level?: string | null
          dig_type_id?: string | null
          id?: string
          length?: number
          minerals_kg_initial?: number | null
          minerals_kg_topup?: number | null
          name?: string
          outline_image_url?: string | null
          pool_type_id?: string | null
          range?: string
          salt_volume_bags?: number | null
          salt_volume_bags_fixed?: number | null
          volume_liters?: number | null
          waterline_l_m?: number | null
          weight_kg?: number | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "pool_specifications_default_filtration_package_id_fkey"
            columns: ["default_filtration_package_id"]
            isOneToOne: false
            referencedRelation: "filtration_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_specifications_pool_type_id_fkey"
            columns: ["pool_type_id"]
            isOneToOne: false
            referencedRelation: "pool_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_specifications_range_fkey"
            columns: ["range"]
            isOneToOne: false
            referencedRelation: "pool_ranges"
            referencedColumns: ["name"]
          },
        ]
      }
      pool_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      pool_water_features: {
        Row: {
          back_cladding_needed: boolean
          created_at: string
          customer_id: string
          front_finish: string
          id: string
          led_blade: string
          pool_id: string
          sides_finish: string
          top_finish: string
          total_cost: number
          updated_at: string
          water_feature_size: string
        }
        Insert: {
          back_cladding_needed?: boolean
          created_at?: string
          customer_id: string
          front_finish?: string
          id?: string
          led_blade?: string
          pool_id: string
          sides_finish?: string
          top_finish?: string
          total_cost?: number
          updated_at?: string
          water_feature_size: string
        }
        Update: {
          back_cladding_needed?: boolean
          created_at?: string
          customer_id?: string
          front_finish?: string
          id?: string
          led_blade?: string
          pool_id?: string
          sides_finish?: string
          top_finish?: string
          total_cost?: number
          updated_at?: string
          water_feature_size?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_water_features_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_water_features_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "pool_water_features_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_worksheet_items: {
        Row: {
          category: string
          created_at: string
          id: string
          item_name: string
          notes: string | null
          quantity: number | null
          total_cost: number
          unit_cost: number
          updated_at: string
          worksheet_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          item_name: string
          notes?: string | null
          quantity?: number | null
          total_cost?: number
          unit_cost?: number
          updated_at?: string
          worksheet_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          notes?: string | null
          quantity?: number | null
          total_cost?: number
          unit_cost?: number
          updated_at?: string
          worksheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_worksheet_items_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "pool_worksheets"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_worksheets: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          pool_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          pool_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          pool_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_worksheets_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pool_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_models: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          id: string
          labor_cost_percentage: number | null
          materials_markup_percentage: number | null
          name: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          labor_cost_percentage?: number | null
          materials_markup_percentage?: number | null
          name: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          labor_cost_percentage?: number | null
          materials_markup_percentage?: number | null
          name?: string
        }
        Relationships: []
      }
      project_site_plan: {
        Row: {
          created_at: string
          id: string
          plan_path: string | null
          pool_project_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          plan_path?: string | null
          pool_project_id: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          plan_path?: string | null
          pool_project_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_site_plan_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_site_plan_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "proposal_snapshot_v"
            referencedColumns: ["project_id"]
          },
        ]
      }
      quote_extra_pavings: {
        Row: {
          created_at: string
          id: string
          meters: number
          paving_id: string
          quote_id: string
          total_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meters?: number
          paving_id: string
          quote_id: string
          total_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meters?: number
          paving_id?: string
          quote_id?: string
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_extra_pavings_paving_id_fkey"
            columns: ["paving_id"]
            isOneToOne: false
            referencedRelation: "extra_paving_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_extra_pavings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          bobcat_id: string | null
          concrete_cuts: string | null
          concrete_cuts_cost: number | null
          concrete_pump_price: number | null
          concrete_pump_required: boolean | null
          crane_id: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          excavation_type: string | null
          existing_concrete_paving: string | null
          existing_concrete_paving_cost: number | null
          extra_concreting: string | null
          extra_paving_cost: number | null
          home_address: string
          id: string
          micro_dig_notes: string | null
          micro_dig_price: number
          micro_dig_required: boolean
          optional_addons_cost: number | null
          owner2_email: string | null
          owner2_name: string | null
          owner2_phone: string | null
          pool_id: string | null
          resident_homeowner: boolean | null
          rrp: number | null
          site_address: string
          site_requirements_cost: number | null
          status: string
          total_cost: number | null
          traffic_control_id: string | null
          under_fence_strips_cost: number | null
          under_fence_strips_data: Json | null
          updated_at: string
          web_price: number | null
        }
        Insert: {
          bobcat_id?: string | null
          concrete_cuts?: string | null
          concrete_cuts_cost?: number | null
          concrete_pump_price?: number | null
          concrete_pump_required?: boolean | null
          crane_id?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          excavation_type?: string | null
          existing_concrete_paving?: string | null
          existing_concrete_paving_cost?: number | null
          extra_concreting?: string | null
          extra_paving_cost?: number | null
          home_address: string
          id?: string
          micro_dig_notes?: string | null
          micro_dig_price?: number
          micro_dig_required?: boolean
          optional_addons_cost?: number | null
          owner2_email?: string | null
          owner2_name?: string | null
          owner2_phone?: string | null
          pool_id?: string | null
          resident_homeowner?: boolean | null
          rrp?: number | null
          site_address: string
          site_requirements_cost?: number | null
          status: string
          total_cost?: number | null
          traffic_control_id?: string | null
          under_fence_strips_cost?: number | null
          under_fence_strips_data?: Json | null
          updated_at?: string
          web_price?: number | null
        }
        Update: {
          bobcat_id?: string | null
          concrete_cuts?: string | null
          concrete_cuts_cost?: number | null
          concrete_pump_price?: number | null
          concrete_pump_required?: boolean | null
          crane_id?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          excavation_type?: string | null
          existing_concrete_paving?: string | null
          existing_concrete_paving_cost?: number | null
          extra_concreting?: string | null
          extra_paving_cost?: number | null
          home_address?: string
          id?: string
          micro_dig_notes?: string | null
          micro_dig_price?: number
          micro_dig_required?: boolean
          optional_addons_cost?: number | null
          owner2_email?: string | null
          owner2_name?: string | null
          owner2_phone?: string | null
          pool_id?: string | null
          resident_homeowner?: boolean | null
          rrp?: number | null
          site_address?: string
          site_requirements_cost?: number | null
          status?: string
          total_cost?: number | null
          traffic_control_id?: string | null
          under_fence_strips_cost?: number | null
          under_fence_strips_data?: Json | null
          updated_at?: string
          web_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_bobcat_id_fkey"
            columns: ["bobcat_id"]
            isOneToOne: false
            referencedRelation: "bobcat_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_crane_id_fkey"
            columns: ["crane_id"]
            isOneToOne: false
            referencedRelation: "crane_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_traffic_control_id_fkey"
            columns: ["traffic_control_id"]
            isOneToOne: false
            referencedRelation: "traffic_control_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      retaining_walls: {
        Row: {
          created_at: string
          extra_rate: number
          id: string
          margin: number
          rate: number
          total: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          extra_rate?: number
          id?: string
          margin?: number
          rate?: number
          total?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          extra_rate?: number
          id?: string
          margin?: number
          rate?: number
          total?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      spa_jets: {
        Row: {
          cost_price: number
          created_at: string
          description: string
          id: string
          margin: number
          model_number: string
          total: number
        }
        Insert: {
          cost_price: number
          created_at?: string
          description: string
          id?: string
          margin: number
          model_number: string
          total: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          description?: string
          id?: string
          margin?: number
          model_number?: string
          total?: number
        }
        Relationships: []
      }
      traffic_control_costs: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      under_fence_concrete_strips: {
        Row: {
          cost: number
          created_at: string
          display_order: number
          id: string
          margin: number
          type: string
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string
          display_order: number
          id?: string
          margin: number
          type: string
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string
          display_order?: number
          id?: string
          margin?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      water_features: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          margin: number
          name: string
          power_requirement: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          margin?: number
          name: string
          power_requirement?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          margin?: number
          name?: string
          power_requirement?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      pool_retaining_walls: {
        Row: {
          id: string
          pool_project_id: string
          wall_type: string | null
          height1: number
          height2: number
          length: number
          total_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          wall_type?: string | null
          height1?: number
          height2?: number
          length?: number
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          wall_type?: string | null
          height1?: number
          height2?: number
          length?: number
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_retaining_walls_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_concrete_selections: {
        Row: {
          id: string
          pool_project_id: string
          concrete_pump_needed: boolean
          concrete_pump_quantity: number | null
          concrete_pump_total_cost: number
          concrete_cuts: string | null
          concrete_cuts_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          concrete_pump_needed?: boolean
          concrete_pump_quantity?: number | null
          concrete_pump_total_cost?: number
          concrete_cuts?: string | null
          concrete_cuts_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          concrete_pump_needed?: boolean
          concrete_pump_quantity?: number | null
          concrete_pump_total_cost?: number
          concrete_cuts?: string | null
          concrete_cuts_cost?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_concrete_selections_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_paving_selections: {
        Row: {
          id: string
          pool_project_id: string
          extra_paving_category: string | null
          extra_paving_square_meters: number
          extra_paving_total_cost: number
          existing_concrete_paving_category: string | null
          existing_concrete_paving_square_meters: number
          existing_concrete_paving_total_cost: number
          extra_concreting_type: string | null
          extra_concreting_square_meters: number
          extra_concreting_total_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          extra_paving_category?: string | null
          extra_paving_square_meters?: number
          extra_paving_total_cost?: number
          existing_concrete_paving_category?: string | null
          existing_concrete_paving_square_meters?: number
          existing_concrete_paving_total_cost?: number
          extra_concreting_type?: string | null
          extra_concreting_square_meters?: number
          extra_concreting_total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          extra_paving_category?: string | null
          extra_paving_square_meters?: number
          extra_paving_total_cost?: number
          existing_concrete_paving_category?: string | null
          existing_concrete_paving_square_meters?: number
          existing_concrete_paving_total_cost?: number
          extra_concreting_type?: string | null
          extra_concreting_square_meters?: number
          extra_concreting_total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_paving_selections_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_paving_selections_extra_paving_category_fkey"
            columns: ["extra_paving_category"]
            isOneToOne: false
            referencedRelation: "extra_paving_costs"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_fence_concrete_strips: {
        Row: {
          id: string
          pool_project_id: string
          strip_data: any
          total_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          strip_data?: any
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          strip_data?: any
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_fence_concrete_strips_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_equipment_selections: {
        Row: {
          id: string
          pool_project_id: string
          crane_id: string | null
          traffic_control_id: string | null
          bobcat_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          crane_id?: string | null
          traffic_control_id?: string | null
          bobcat_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          crane_id?: string | null
          traffic_control_id?: string | null
          bobcat_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_equipment_selections_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_equipment_selections_crane_id_fkey"
            columns: ["crane_id"]
            isOneToOne: false
            referencedRelation: "crane_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_equipment_selections_traffic_control_id_fkey"
            columns: ["traffic_control_id"]
            isOneToOne: false
            referencedRelation: "traffic_control_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_equipment_selections_bobcat_id_fkey"
            columns: ["bobcat_id"]
            isOneToOne: false
            referencedRelation: "bobcat_costs"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_project_blanket_rollers: {
        Row: {
          id: string
          pool_project_id: string
          blanket_roller_id: string
          include_blanket_roller: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          blanket_roller_id: string
          include_blanket_roller?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          blanket_roller_id?: string
          include_blanket_roller?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_project_blanket_rollers_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_project_blanket_rollers_blanket_roller_id_fkey"
            columns: ["blanket_roller_id"]
            isOneToOne: false
            referencedRelation: "blanket_rollers"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_project_filtration_packages: {
        Row: {
          id: string
          pool_project_id: string
          filtration_package_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_project_id: string
          filtration_package_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_project_id?: string
          filtration_package_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_project_filtration_packages_pool_project_id_fkey"
            columns: ["pool_project_id"]
            isOneToOne: false
            referencedRelation: "pool_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_project_filtration_packages_filtration_package_id_fkey"
            columns: ["filtration_package_id"]
            isOneToOne: false
            referencedRelation: "filtration_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      pool_project_heat_pumps: {
        Row: {
          created_at: string
          heat_pump_id: string
          hp_description: string
          hp_sku: string
          id: string
          pool_model: string
          pool_range: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          heat_pump_id: string
          hp_description: string
          hp_sku: string
          id?: string
          pool_model: string
          pool_range: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          heat_pump_id?: string
          hp_description?: string
          hp_sku?: string
          id?: string
          pool_model?: string
          pool_range?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_project_heat_pumps_heat_pump_id_fkey"
            columns: ["heat_pump_id"]
            isOneToOne: false
            referencedRelation: "heat_pump_products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      proposal_snapshot_v: {
        Row: {
          accepted_datetime: string | null
          accepted_ip: string | null
          blanket_roller_cost: number | null
          blanket_roller_description: string | null
          blanket_roller_margin: number | null
          blanket_roller_rrp: number | null
          blanket_roller_sku: string | null
          bob_size_category: string | null
          bobcat_cost: number | null
          br_install_cost: number | null
          br_install_inclusions: string | null
          change_request_json: Json | null
          cleaner_cost_price: number | null
          cleaner_included: boolean | null
          cleaner_margin: number | null
          cleaner_name: string | null
          cleaner_unit_price: number | null
          concrete_cuts_cost: number | null
          concrete_cuts_json: Json | null
          concrete_pump_needed: boolean | null
          concrete_pump_quantity: number | null
          concrete_pump_total_cost: number | null
          crane_cost: number | null
          crn_name: string | null
          dig_excavation_hours: number | null
          dig_excavation_rate: number | null
          dig_name: string | null
          dig_truck_hours: number | null
          dig_truck_qty: number | null
          dig_truck_rate: number | null
          elec_fence_earthing_flag: boolean | null
          elec_fence_earthing_rate: number | null
          elec_heat_pump_circuit_flag: boolean | null
          elec_heat_pump_circuit_rate: number | null
          elec_standard_power_flag: boolean | null
          elec_standard_power_rate: number | null
          elec_total_cost: number | null
          email: string | null
          epc_category: string | null
          epc_margin_cost: number | null
          epc_paver_cost: number | null
          epc_wastage_cost: number | null
          existing_paving_category: string | null
          existing_paving_cost: number | null
          existing_paving_sqm: number | null
          extra_concreting_base_price: number | null
          extra_concreting_calc_total: number | null
          extra_concreting_margin: number | null
          extra_concreting_saved_total: number | null
          extra_concreting_sqm: number | null
          extra_concreting_type: string | null
          extra_concreting_unit_price: number | null
          extra_paving_cost: number | null
          extra_paving_sqm: number | null
          fencing_total_cost: number | null
          fixed_costs_json: Json | null
          fp_filter_description: string | null
          fp_filter_model: string | null
          fp_filter_name: string | null
          fp_filter_price: number | null
          fp_handover_description: string | null
          fp_handover_kit_price: number | null
          fp_handover_model: string | null
          fp_handover_name: string | null
          fp_light_description: string | null
          fp_light_model: string | null
          fp_light_name: string | null
          fp_light_price: number | null
          fp_name: string | null
          fp_pump_description: string | null
          fp_pump_model: string | null
          fp_pump_name: string | null
          fp_pump_price: number | null
          fp_sanitiser_description: string | null
          fp_sanitiser_model: string | null
          fp_sanitiser_name: string | null
          fp_sanitiser_price: number | null
          glass_complex_panels: number | null
          glass_earthing_cost: number | null
          glass_earthing_required: boolean | null
          glass_fence_cost: number | null
          glass_fence_total_cost: number | null
          glass_gate_cost: number | null
          glass_gates: number | null
          glass_linear_meters: number | null
          glass_simple_panels: number | null
          heat_pump_cost: number | null
          heat_pump_description: string | null
          heat_pump_install_cost: number | null
          heat_pump_install_inclusions: string | null
          heat_pump_margin: number | null
          heat_pump_rrp: number | null
          heat_pump_sku: string | null
          heating_total_cost: number | null
          heating_total_margin: number | null
          home_address: string | null
          include_blanket_roller: boolean | null
          include_heat_pump: boolean | null
          installation_area: string | null
          last_change_requested: string | null
          last_viewed: string | null
          metal_complex_panels: number | null
          metal_earthing_cost: number | null
          metal_earthing_required: boolean | null
          metal_fence_cost: number | null
          metal_fence_total_cost: number | null
          metal_gate_cost: number | null
          metal_gates: number | null
          metal_linear_meters: number | null
          metal_simple_panels: number | null
          owner1: string | null
          owner2: string | null
          pc_beam: number | null
          pc_coping_lay: number | null
          pc_coping_supply: number | null
          pc_install_fee: number | null
          pc_misc: number | null
          pc_pea_gravel: number | null
          pc_salt_bags: number | null
          pc_trucked_water: number | null
          phone: string | null
          pin: string | null
          pool_margin_pct: number | null
          project_id: string | null
          proposal_name: string | null
          proposal_status: string | null
          render_ready: boolean | null
          resident_homeowner: boolean | null
          retaining_wall1_height1: number | null
          retaining_wall1_height2: number | null
          retaining_wall1_length: number | null
          retaining_wall1_total_cost: number | null
          retaining_wall1_type: string | null
          retaining_wall2_height1: number | null
          retaining_wall2_height2: number | null
          retaining_wall2_length: number | null
          retaining_wall2_total_cost: number | null
          retaining_wall2_type: string | null
          retaining_wall3_height1: number | null
          retaining_wall3_height2: number | null
          retaining_wall3_length: number | null
          retaining_wall3_total_cost: number | null
          retaining_wall3_type: string | null
          retaining_wall4_height1: number | null
          retaining_wall4_height2: number | null
          retaining_wall4_length: number | null
          retaining_wall4_total_cost: number | null
          retaining_wall4_type: string | null
          site_address: string | null
          spec_buy_ex_gst: number | null
          spec_buy_inc_gst: number | null
          spec_depth_deep_m: number | null
          spec_depth_shallow_m: number | null
          spec_length_m: number | null
          spec_name: string | null
          spec_range: string | null
          spec_width_m: number | null
          tc_name: string | null
          traffic_control_cost: number | null
          uf_strips_cost: number | null
          uf_strips_raw: Json | null
          version: number | null
          videos_json: Json | null
          water_feature_back_cladding_needed: boolean | null
          water_feature_front_finish: string | null
          water_feature_led_blade: string | null
          water_feature_sides_finish: string | null
          water_feature_size: string | null
          water_feature_top_finish: string | null
          water_feature_total_cost: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pool_specifications_range_fkey"
            columns: ["spec_range"]
            isOneToOne: false
            referencedRelation: "pool_ranges"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Functions: {
      get_proposal_snapshot: {
        Args: { p_project_id: string }
        Returns: Json
      }
    }
    Enums: {
      fence_item_type: "Fence (per meter)" | "Gate (per unit)" | "Per meter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      fence_item_type: ["Fence (per meter)", "Gate (per unit)", "Per meter"],
    },
  },
} as const

// Create new types for the junction tables
export type PoolRetainingWall = Database['public']['Tables']['pool_retaining_walls']['Row']
export type PoolConcreteSelection = Database['public']['Tables']['pool_concrete_selections']['Row']
export type PoolPavingSelection = Database['public']['Tables']['pool_paving_selections']['Row']
export type PoolFenceConcreteStrip = Database['public']['Tables']['pool_fence_concrete_strips']['Row']
export type PoolEquipmentSelection = Database['public']['Tables']['pool_equipment_selections']['Row']
export type PoolProjectFiltrationPackage = Database['public']['Tables']['pool_project_filtration_packages']['Row']
