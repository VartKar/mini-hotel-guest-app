import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHostMarketingMetrics = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-marketing-metrics", hostEmail],
    queryFn: async () => {
      // 1) Get guests visible to the authenticated host (RLS enforces scoping)
      const { data: visibleGuests } = await supabase
        .from("guests")
        .select("*");

      const uniqueGuests = visibleGuests || [];

      if (!uniqueGuests.length) {
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

      // 2) Total bonuses from host's guests
      const totalBonuses = uniqueGuests.reduce(
        (sum, g) => sum + (g.loyalty_points || 0),
        0
      );

      // 3) Collect bookings for these guests (RLS ensures only host-related bookings)
      const guestEmails = uniqueGuests.map((g) => g.email);

      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, guest_email")
        .in("guest_email", guestEmails);

      const bookingIds = (bookings || []).map((b) => b.id);

      // 4) Orders from host's guests (last 30 days)
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

      // 5) Revenue from host's guests (last 30 days)
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

      // 6) Top 3 guests by total_spent
      const topGuests = [...uniqueGuests]
        .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
        .slice(0, 3);

      // 7) Loyalty tier distribution
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
    // Only run when we have a valid email
    enabled: !!hostEmail && hostEmail.length > 0,
  });
};
