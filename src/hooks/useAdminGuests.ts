import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminGuests = () => {
  return useQuery({
    queryKey: ["admin-guests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("last_visit_date", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data || [];
    },
  });
};
