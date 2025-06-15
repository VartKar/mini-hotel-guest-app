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
      combined: {
        Row: {
          ac_instructions: string | null
          apartment_name: string | null
          booking_id: string | null
          booking_status: string | null
          check_in_date: string | null
          check_out_date: string | null
          checkout_time: string | null
          coffee_instructions: string | null
          extra_bed_info: string | null
          guest_email: string | null
          guest_name: string | null
          host_company: string | null
          host_email: string | null
          host_id: string | null
          host_name: string | null
          host_phone: string | null
          id_key: string
          is_archived: boolean | null
          last_updated_at: string | null
          last_updated_by: string | null
          main_image_url: string | null
          notes_for_guests: string | null
          notes_internal: string | null
          parking_info: string | null
          pets_info: string | null
          property_id: string | null
          property_manager_email: string | null
          property_manager_name: string | null
          property_manager_phone: string | null
          room_image_url: string | null
          room_number: string | null
          safe_instructions: string | null
          stay_duration: string | null
          tv_instructions: string | null
          visible_to_admin: boolean | null
          visible_to_guests: boolean | null
          visible_to_hosts: boolean | null
          wifi_network: string | null
          wifi_password: string | null
        }
        Insert: {
          ac_instructions?: string | null
          apartment_name?: string | null
          booking_id?: string | null
          booking_status?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          checkout_time?: string | null
          coffee_instructions?: string | null
          extra_bed_info?: string | null
          guest_email?: string | null
          guest_name?: string | null
          host_company?: string | null
          host_email?: string | null
          host_id?: string | null
          host_name?: string | null
          host_phone?: string | null
          id_key?: string
          is_archived?: boolean | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          main_image_url?: string | null
          notes_for_guests?: string | null
          notes_internal?: string | null
          parking_info?: string | null
          pets_info?: string | null
          property_id?: string | null
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_image_url?: string | null
          room_number?: string | null
          safe_instructions?: string | null
          stay_duration?: string | null
          tv_instructions?: string | null
          visible_to_admin?: boolean | null
          visible_to_guests?: boolean | null
          visible_to_hosts?: boolean | null
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Update: {
          ac_instructions?: string | null
          apartment_name?: string | null
          booking_id?: string | null
          booking_status?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          checkout_time?: string | null
          coffee_instructions?: string | null
          extra_bed_info?: string | null
          guest_email?: string | null
          guest_name?: string | null
          host_company?: string | null
          host_email?: string | null
          host_id?: string | null
          host_name?: string | null
          host_phone?: string | null
          id_key?: string
          is_archived?: boolean | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          main_image_url?: string | null
          notes_for_guests?: string | null
          notes_internal?: string | null
          parking_info?: string | null
          pets_info?: string | null
          property_id?: string | null
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_image_url?: string | null
          room_number?: string | null
          safe_instructions?: string | null
          stay_duration?: string | null
          tv_instructions?: string | null
          visible_to_admin?: boolean | null
          visible_to_guests?: boolean | null
          visible_to_hosts?: boolean | null
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Relationships: []
      }
      host_change_requests: {
        Row: {
          booking_id: string | null
          created_at: string | null
          host_email: string
          id: string
          property_id: string | null
          request_details: string
          request_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          host_email: string
          id?: string
          property_id?: string | null
          request_details: string
          request_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          host_email?: string
          id?: string
          property_id?: string | null
          request_details?: string
          request_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_orders: {
        Row: {
          booking_id_key: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          order_status: string
          ordered_items: Json
          room_number: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_id_key?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          order_status?: string
          ordered_items: Json
          room_number?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_id_key?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          order_status?: string
          ordered_items?: Json
          room_number?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_orders_booking_id_key_fkey"
            columns: ["booking_id_key"]
            isOneToOne: false
            referencedRelation: "combined"
            referencedColumns: ["id_key"]
          },
        ]
      }
      travel_itineraries: {
        Row: {
          activity_description: string | null
          activity_title: string
          booking_id_key: string | null
          city: string | null
          created_at: string
          day_number: number
          icon_type: string | null
          id: string
          is_service_available: boolean | null
          service_description: string | null
          service_price: number | null
          service_title: string | null
          updated_at: string
        }
        Insert: {
          activity_description?: string | null
          activity_title: string
          booking_id_key?: string | null
          city?: string | null
          created_at?: string
          day_number: number
          icon_type?: string | null
          id?: string
          is_service_available?: boolean | null
          service_description?: string | null
          service_price?: number | null
          service_title?: string | null
          updated_at?: string
        }
        Update: {
          activity_description?: string | null
          activity_title?: string
          booking_id_key?: string | null
          city?: string | null
          created_at?: string
          day_number?: number
          icon_type?: string | null
          id?: string
          is_service_available?: boolean | null
          service_description?: string | null
          service_price?: number | null
          service_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_itineraries_booking_id_key_fkey"
            columns: ["booking_id_key"]
            isOneToOne: false
            referencedRelation: "combined"
            referencedColumns: ["id_key"]
          },
        ]
      }
      travel_service_orders: {
        Row: {
          booking_id_key: string | null
          created_at: string
          customer_comment: string | null
          customer_name: string
          customer_phone: string
          id: string
          order_status: string
          selected_services: Json
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_id_key?: string | null
          created_at?: string
          customer_comment?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          order_status?: string
          selected_services: Json
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_id_key?: string | null
          created_at?: string
          customer_comment?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          order_status?: string
          selected_services?: Json
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_service_orders_booking_id_key_fkey"
            columns: ["booking_id_key"]
            isOneToOne: false
            referencedRelation: "combined"
            referencedColumns: ["id_key"]
          },
        ]
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
    Enums: {},
  },
} as const
