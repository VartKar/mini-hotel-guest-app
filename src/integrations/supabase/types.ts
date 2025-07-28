export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          access_token: string | null
          booking_id: string | null
          booking_status: string
          check_in_date: string | null
          check_out_date: string | null
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          is_archived: boolean
          last_updated_at: string | null
          last_updated_by: string | null
          notes_internal: string | null
          number_of_guests: number | null
          room_id: string
          stay_duration: string | null
          updated_at: string
          visible_to_admin: boolean
          visible_to_guests: boolean
          visible_to_hosts: boolean
        }
        Insert: {
          access_token?: string | null
          booking_id?: string | null
          booking_status?: string
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          is_archived?: boolean
          last_updated_at?: string | null
          last_updated_by?: string | null
          notes_internal?: string | null
          number_of_guests?: number | null
          room_id: string
          stay_duration?: string | null
          updated_at?: string
          visible_to_admin?: boolean
          visible_to_guests?: boolean
          visible_to_hosts?: boolean
        }
        Update: {
          access_token?: string | null
          booking_id?: string | null
          booking_status?: string
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          is_archived?: boolean
          last_updated_at?: string | null
          last_updated_by?: string | null
          notes_internal?: string | null
          number_of_guests?: number | null
          room_id?: string
          stay_duration?: string | null
          updated_at?: string
          visible_to_admin?: boolean
          visible_to_guests?: boolean
          visible_to_hosts?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      combined: {
        Row: {
          ac_instructions: string | null
          access_token: string | null
          apartment_name: string | null
          booking_id: string | null
          booking_status: string | null
          check_in_date: string | null
          check_out_date: string | null
          checkout_time: string | null
          city: string | null
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
          number_of_guests: number | null
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
          access_token?: string | null
          apartment_name?: string | null
          booking_id?: string | null
          booking_status?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          checkout_time?: string | null
          city?: string | null
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
          number_of_guests?: number | null
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
          access_token?: string | null
          apartment_name?: string | null
          booking_id?: string | null
          booking_status?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          checkout_time?: string | null
          city?: string | null
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
          number_of_guests?: number | null
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
      feedback: {
        Row: {
          booking_id_key: string | null
          created_at: string
          customer_name: string
          id: string
          message: string | null
          rating: number
          room_number: string | null
          updated_at: string
        }
        Insert: {
          booking_id_key?: string | null
          created_at?: string
          customer_name: string
          id?: string
          message?: string | null
          rating: number
          room_number?: string | null
          updated_at?: string
        }
        Update: {
          booking_id_key?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          message?: string | null
          rating?: number
          room_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_booking_id_key_fkey"
            columns: ["booking_id_key"]
            isOneToOne: false
            referencedRelation: "combined"
            referencedColumns: ["id_key"]
          },
        ]
      }
      guest_sessions: {
        Row: {
          booking_id: string | null
          created_at: string
          expires_at: string | null
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          is_active: boolean
          last_accessed_at: string | null
          room_id: string
          session_token: string
          session_type: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          room_id: string
          session_token: string
          session_type: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          room_id?: string
          session_token?: string
          session_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_sessions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_sessions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "combined_view"
            referencedColumns: ["id_key"]
          },
          {
            foreignKeyName: "guest_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
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
      hotel_services: {
        Row: {
          base_price: number | null
          category: string
          city: string
          created_at: string
          description: string
          details_content: string | null
          has_details: boolean | null
          icon_type: string | null
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category: string
          city?: string
          created_at?: string
          description: string
          details_content?: string | null
          has_details?: boolean | null
          icon_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string
          city?: string
          created_at?: string
          description?: string
          details_content?: string | null
          has_details?: boolean | null
          icon_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_item_pricing: {
        Row: {
          created_at: string
          id: string
          is_available: boolean
          price_override: number
          property_id: string
          shop_item_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean
          price_override: number
          property_id: string
          shop_item_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean
          price_override?: number
          property_id?: string
          shop_item_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_item_pricing_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      property_service_pricing: {
        Row: {
          created_at: string
          id: string
          is_available: boolean
          price_override: number
          property_id: string
          travel_service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean
          price_override: number
          property_id: string
          travel_service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean
          price_override?: number
          property_id?: string
          travel_service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_service_pricing_travel_service_id_fkey"
            columns: ["travel_service_id"]
            isOneToOne: false
            referencedRelation: "travel_services"
            referencedColumns: ["id"]
          },
        ]
      }
      room_access: {
        Row: {
          ac_instructions: string | null
          access_token: string
          apartment_name: string | null
          checkout_time: string | null
          city: string
          coffee_instructions: string | null
          created_at: string
          extra_bed_info: string | null
          host_email: string | null
          host_name: string | null
          host_phone: string | null
          id: string
          is_active: boolean
          main_image_url: string | null
          notes_for_guests: string | null
          parking_info: string | null
          property_id: string
          property_manager_email: string | null
          property_manager_name: string | null
          property_manager_phone: string | null
          room_id: string
          room_image_url: string | null
          room_number: string
          safe_instructions: string | null
          tv_instructions: string | null
          updated_at: string
          wifi_network: string | null
          wifi_password: string | null
        }
        Insert: {
          ac_instructions?: string | null
          access_token: string
          apartment_name?: string | null
          checkout_time?: string | null
          city?: string
          coffee_instructions?: string | null
          created_at?: string
          extra_bed_info?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          notes_for_guests?: string | null
          parking_info?: string | null
          property_id: string
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_id: string
          room_image_url?: string | null
          room_number: string
          safe_instructions?: string | null
          tv_instructions?: string | null
          updated_at?: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Update: {
          ac_instructions?: string | null
          access_token?: string
          apartment_name?: string | null
          checkout_time?: string | null
          city?: string
          coffee_instructions?: string | null
          created_at?: string
          extra_bed_info?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          notes_for_guests?: string | null
          parking_info?: string | null
          property_id?: string
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_id?: string
          room_image_url?: string | null
          room_number?: string
          safe_instructions?: string | null
          tv_instructions?: string | null
          updated_at?: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Relationships: []
      }
      room_guests: {
        Row: {
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          last_access_at: string | null
          registered_at: string
          room_access_id: string
        }
        Insert: {
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_access_at?: string | null
          registered_at?: string
          room_access_id: string
        }
        Update: {
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          last_access_at?: string | null
          registered_at?: string
          room_access_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_guests_room_access_id_fkey"
            columns: ["room_access_id"]
            isOneToOne: false
            referencedRelation: "room_access"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          ac_instructions: string | null
          apartment_name: string | null
          checkout_time: string | null
          city: string
          coffee_instructions: string | null
          created_at: string
          extra_bed_info: string | null
          host_email: string | null
          host_name: string | null
          host_phone: string | null
          id: string
          is_active: boolean
          main_image_url: string | null
          notes_for_guests: string | null
          parking_info: string | null
          property_id: string
          property_manager_email: string | null
          property_manager_name: string | null
          property_manager_phone: string | null
          room_image_url: string | null
          room_number: string
          safe_instructions: string | null
          tv_instructions: string | null
          updated_at: string
          wifi_network: string | null
          wifi_password: string | null
        }
        Insert: {
          ac_instructions?: string | null
          apartment_name?: string | null
          checkout_time?: string | null
          city?: string
          coffee_instructions?: string | null
          created_at?: string
          extra_bed_info?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          notes_for_guests?: string | null
          parking_info?: string | null
          property_id: string
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_image_url?: string | null
          room_number: string
          safe_instructions?: string | null
          tv_instructions?: string | null
          updated_at?: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Update: {
          ac_instructions?: string | null
          apartment_name?: string | null
          checkout_time?: string | null
          city?: string
          coffee_instructions?: string | null
          created_at?: string
          extra_bed_info?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          id?: string
          is_active?: boolean
          main_image_url?: string | null
          notes_for_guests?: string | null
          parking_info?: string | null
          property_id?: string
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          room_image_url?: string | null
          room_number?: string
          safe_instructions?: string | null
          tv_instructions?: string | null
          updated_at?: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          base_price: number
          category: string
          city: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price: number
          category: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_orders: {
        Row: {
          booking_id_key: string | null
          created_at: string
          customer_comment: string | null
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
          customer_comment?: string | null
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
          customer_comment?: string | null
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
          activity_category: string | null
          activity_description: string | null
          activity_title: string
          booking_id_key: string | null
          city: string | null
          created_at: string
          day_number: number
          difficulty_level: string | null
          duration_hours: number | null
          icon_type: string | null
          id: string
          is_service_available: boolean | null
          service_description: string | null
          service_price: number | null
          service_title: string | null
          updated_at: string
        }
        Insert: {
          activity_category?: string | null
          activity_description?: string | null
          activity_title: string
          booking_id_key?: string | null
          city?: string | null
          created_at?: string
          day_number: number
          difficulty_level?: string | null
          duration_hours?: number | null
          icon_type?: string | null
          id?: string
          is_service_available?: boolean | null
          service_description?: string | null
          service_price?: number | null
          service_title?: string | null
          updated_at?: string
        }
        Update: {
          activity_category?: string | null
          activity_description?: string | null
          activity_title?: string
          booking_id_key?: string | null
          city?: string | null
          created_at?: string
          day_number?: number
          difficulty_level?: string | null
          duration_hours?: number | null
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
      travel_services: {
        Row: {
          base_price: number
          category: string | null
          city: string
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          base_price: number
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      combined_view: {
        Row: {
          ac_instructions: string | null
          access_token: string | null
          apartment_name: string | null
          booking_id: string | null
          booking_status: string | null
          check_in_date: string | null
          check_out_date: string | null
          checkout_time: string | null
          city: string | null
          coffee_instructions: string | null
          extra_bed_info: string | null
          guest_email: string | null
          guest_name: string | null
          host_email: string | null
          host_name: string | null
          host_phone: string | null
          id_key: string | null
          is_archived: boolean | null
          last_updated_at: string | null
          last_updated_by: string | null
          main_image_url: string | null
          notes_for_guests: string | null
          notes_internal: string | null
          number_of_guests: number | null
          parking_info: string | null
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
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_type: "training" | "visit" | "promotion" | "research"
      session_status: "waiting" | "in_progress" | "completed"
      user_role: "player" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_type: ["training", "visit", "promotion", "research"],
      session_status: ["waiting", "in_progress", "completed"],
      user_role: ["player", "moderator", "admin"],
    },
  },
} as const
