import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHostGuests = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-guests", hostEmail],
    queryFn: async () => {
      if (!hostEmail) return [];

      // Get host's guests through bookings and rooms
      const { data: hostGuests } = await supabase
        .from("guests")
        .select(`
          *,
          bookings!inner(
            id,
            rooms!inner(
              host_email
            )
          )
        `)
        .eq("bookings.rooms.host_email", hostEmail)
        .order("last_visit_date", { ascending: false, nullsFirst: false });

      // Remove duplicates
      const uniqueGuests = hostGuests?.reduce((acc, guest) => {
        if (!acc.find((g: any) => g.id === guest.id)) {
          acc.push(guest);
        }
        return acc;
      }, [] as any[]) || [];

      return uniqueGuests;
    },
    enabled: !!hostEmail,
  });
};
