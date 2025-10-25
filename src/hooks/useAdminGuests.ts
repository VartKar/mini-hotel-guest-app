import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminGuests = () => {
  return useQuery({
    queryKey: ["admin-guests"],
    queryFn: async () => {
      console.log("[useAdminGuests] Fetching guests...");
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("last_visit_date", { ascending: false, nullsFirst: false });

      if (error) {
        console.error("[useAdminGuests] Error fetching guests:", error);
        throw error;
      }
      console.log("[useAdminGuests] Fetched guests:", data?.length || 0);
      return data || [];
    },
  });
};
