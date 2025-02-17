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
      excavation_dig_types: {
        Row: {
          created_at: string
          excavation_hourly_rate: number
          excavation_hours: number
          id: string
          name: string
          truck_count: number
          truck_hourly_rate: number
          truck_hours: number
        }
        Insert: {
          created_at?: string
          excavation_hourly_rate: number
          excavation_hours: number
          id?: string
          name: string
          truck_count: number
          truck_hourly_rate: number
          truck_hours: number
        }
        Update: {
          created_at?: string
          excavation_hourly_rate?: number
          excavation_hours?: number
          id?: string
          name?: string
          truck_count?: number
          truck_hourly_rate?: number
          truck_hours?: number
        }
        Relationships: []
      }
      filtration_systems: {
        Row: {
          created_at: string
          description: string | null
          flow_rate: number | null
          id: string
          name: string
          power_consumption: number | null
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_rate?: number | null
          id?: string
          name: string
          power_consumption?: number | null
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_rate?: number | null
          id?: string
          name?: string
          power_consumption?: number | null
          price?: number
        }
        Relationships: []
      }
      paving_additional_costs: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      paving_prices: {
        Row: {
          category_1_price: number
          category_2_price: number
          category_3_price: number
          category_4_price: number
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category_1_price: number
          category_2_price: number
          category_3_price: number
          category_4_price: number
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category_1_price?: number
          category_2_price?: number
          category_3_price?: number
          category_4_price?: number
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      pool_excavation_types: {
        Row: {
          created_at: string
          dig_type_id: string
          id: string
          name: string
          range: string
        }
        Insert: {
          created_at?: string
          dig_type_id: string
          id?: string
          name: string
          range: string
        }
        Update: {
          created_at?: string
          dig_type_id?: string
          id?: string
          name?: string
          range?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_excavation_types_dig_type_id_fkey"
            columns: ["dig_type_id"]
            isOneToOne: false
            referencedRelation: "excavation_dig_types"
            referencedColumns: ["id"]
          },
        ]
      }
      pool_specifications: {
        Row: {
          buy_price_ex_gst: number | null
          buy_price_inc_gst: number | null
          created_at: string
          depth_deep: number
          depth_shallow: number
          dig_level: string | null
          id: string
          length: number
          minerals_kg_initial: number | null
          minerals_kg_topup: number | null
          name: string
          pool_type_id: string | null
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
          depth_deep: number
          depth_shallow: number
          dig_level?: string | null
          id?: string
          length: number
          minerals_kg_initial?: number | null
          minerals_kg_topup?: number | null
          name?: string
          pool_type_id?: string | null
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
          depth_deep?: number
          depth_shallow?: number
          dig_level?: string | null
          id?: string
          length?: number
          minerals_kg_initial?: number | null
          minerals_kg_topup?: number | null
          name?: string
          pool_type_id?: string | null
          salt_volume_bags?: number | null
          salt_volume_bags_fixed?: number | null
          volume_liters?: number | null
          waterline_l_m?: number | null
          weight_kg?: number | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "pool_specifications_pool_type_id_fkey"
            columns: ["pool_type_id"]
            isOneToOne: false
            referencedRelation: "pool_types"
            referencedColumns: ["id"]
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
      water_features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          power_requirement: number | null
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          power_requirement?: number | null
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          power_requirement?: number | null
          price?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
