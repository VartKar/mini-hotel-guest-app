import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHostGuests = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-guests", hostEmail],
    queryFn: async () => {
      if (!hostEmail) return [];

      // First get host's rooms
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id")
        .ilike("host_email", hostEmail.trim());

      if (!rooms || rooms.length === 0) return [];

      const roomIds = rooms.map(r => r.id);

      // Get bookings for these rooms
      const { data: bookings } = await supabase
        .from("bookings")
        .select("guest_email")
        .in("room_id", roomIds);

      if (!bookings || bookings.length === 0) return [];

      // Get unique guest emails
      const guestEmails = [...new Set(bookings.map(b => b.guest_email))];

      // Get guests
      const { data: guests } = await supabase
        .from("guests")
        .select("*")
        .in("email", guestEmails)
        .order("last_visit_date", { ascending: false, nullsFirst: false });

      return guests || [];
    },
    enabled: !!hostEmail,
  });
};
