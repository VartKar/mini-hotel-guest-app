
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Table: rooms (columns: id, image, stay_duration, wifi_network, wifi_password, checkout_time, air_conditioner, coffee_machine, smart_tv, safe, parking, extra_bed, pets)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchRoomData = async () => {
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
