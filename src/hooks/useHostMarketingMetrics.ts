import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHostMarketingMetrics = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-marketing-metrics", hostEmail],
    queryFn: async () => {
      if (!hostEmail) {
        return {
          guestsCount: 0,
          ordersCount: 0,
          totalBonuses: 0,
          revenue: 0,
          topGuests: [],
          distribution: {},
        };
      }

      // First get host's rooms
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id")
        .ilike("host_email", hostEmail.trim());

      if (!rooms || rooms.length === 0) {
        return {
          guestsCount: 0,
          ordersCount: 0,
          totalBonuses: 0,
          revenue: 0,
          topGuests: [],
          distribution: {},
        };
      }

      const roomIds = rooms.map(r => r.id);

      // Get bookings for these rooms
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, guest_email")
        .in("room_id", roomIds);

      if (!bookings || bookings.length === 0) {
        return {
          guestsCount: 0,
          ordersCount: 0,
          totalBonuses: 0,
          revenue: 0,
          topGuests: [],
          distribution: {},
        };
      }

      // Get unique guest emails and booking IDs
      const guestEmails = [...new Set(bookings.map(b => b.guest_email))];
      const bookingIds = bookings.map(b => b.id);

      // Get guests
      const { data: uniqueGuests } = await supabase
        .from("guests")
        .select("*")
        .in("email", guestEmails);

      if (!uniqueGuests || uniqueGuests.length === 0) {
        return {
          guestsCount: 0,
          ordersCount: 0,
          totalBonuses: 0,
          revenue: 0,
          topGuests: [],
          distribution: {},
        };
      }

      const guestsCount = uniqueGuests.length;

      // Total bonuses from host's guests
      const totalBonuses = uniqueGuests.reduce(
        (sum, g) => sum + (g.loyalty_points || 0),
        0
      );

      // Orders from host's guests (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: shopOrdersCount } = await supabase
        .from("shop_orders")
        .select("*", { count: "exact", head: true })
        .in("booking_id_key", bookingIds)
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { count: travelOrdersCount } = await supabase
        .from("travel_service_orders")
        .select("*", { count: "exact", head: true })
        .in("booking_id_key", bookingIds)
        .gte("created_at", thirtyDaysAgo.toISOString());

      const ordersCount = (shopOrdersCount || 0) + (travelOrdersCount || 0);

      // Revenue from host's guests (last 30 days)
      const { data: shopOrders } = await supabase
        .from("shop_orders")
        .select("total_amount")
        .in("booking_id_key", bookingIds)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .neq("order_status", "cancelled");

      const { data: travelOrders } = await supabase
        .from("travel_service_orders")
        .select("total_amount")
        .in("booking_id_key", bookingIds)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .neq("order_status", "cancelled");

      const revenue =
        (shopOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0) +
        (travelOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0);

      // Top 3 guests by total_spent
      const topGuests = [...uniqueGuests]
        .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
        .slice(0, 3);

      // Loyalty tier distribution
      const distribution = uniqueGuests.reduce((acc, g) => {
        const tier = g.loyalty_tier || "Стандарт";
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        guestsCount,
        ordersCount,
        totalBonuses,
        revenue,
        topGuests,
        distribution,
      };
    },
    enabled: !!hostEmail,
  });
};
