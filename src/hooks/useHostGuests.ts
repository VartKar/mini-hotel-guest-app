import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHostGuests = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-guests", hostEmail],
    queryFn: async () => {
      // Rely on RLS to return only guests related to the authenticated host
      const { data: guests } = await supabase
        .from("guests")
        .select("*")
        .order("last_visit_date", { ascending: false, nullsFirst: false });

      return guests || [];
    },
    // Do not depend on hostEmail, RLS will scope results to the host
    enabled: true,
  });
};
