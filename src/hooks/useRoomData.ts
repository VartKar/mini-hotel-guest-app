
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const fetchRoomData = async () => {
  console.log("Fetching room data from Supabase...");
  
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching room data:", error);
    throw error;
  }
  
  console.log("Room data fetched successfully:", data);
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
