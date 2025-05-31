
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "Present" : "Missing");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

// Table: rooms (columns: id, image, stay_duration, wifi_network, wifi_password, checkout_time, air_conditioner, coffee_machine, smart_tv, safe, parking, extra_bed, pets)
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const fetchRoomData = async () => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please check your environment variables.");
  }
  
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data;
};

export const useRoomData = () => {
  return useQuery({
    queryKey: ["roomData"],
    queryFn: fetchRoomData,
    enabled: !!supabase, // Only run query if supabase client is available
  });
};

export type RoomData = {
  id: number;
  image: string;
  stay_duration: string;
  wifi_network: string;
  wifi_password: string;
  checkout_time: string;
  air_conditioner: string;
  coffee_machine: string;
  smart_tv: string;
  safe: string;
  parking: string;
  extra_bed: string;
  pets: string;
};
