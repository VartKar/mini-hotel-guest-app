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
        .eq("bookings.rooms.host_email", hostEmail);

      // Remove duplicates and flatten
      const uniqueGuests = hostGuests?.reduce((acc, guest) => {
        if (!acc.find((g: any) => g.id === guest.id)) {
          acc.push(guest);
        }
        return acc;
      }, [] as any[]) || [];

      const guestsCount = uniqueGuests.length;

      // Total bonuses from host's guests
      const totalBonuses = uniqueGuests.reduce(
        (sum, g) => sum + (g.loyalty_points || 0),
        0
      );

      // Orders from host's guests (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const guestIds = uniqueGuests.map((g) => g.id);

      const { count: shopOrdersCount } = await supabase
        .from("shop_orders")
        .select("*", { count: "exact", head: true })
        .in("booking_id_key", 
          (await supabase
            .from("bookings")
            .select("id")
            .in("guest_email", uniqueGuests.map(g => g.email))
            .then(res => res.data?.map(b => b.id) || []))
        )
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { count: travelOrdersCount } = await supabase
        .from("travel_service_orders")
        .select("*", { count: "exact", head: true })
        .in("booking_id_key",
          (await supabase
            .from("bookings")
            .select("id")
            .in("guest_email", uniqueGuests.map(g => g.email))
            .then(res => res.data?.map(b => b.id) || []))
        )
        .gte("created_at", thirtyDaysAgo.toISOString());

      const ordersCount = (shopOrdersCount || 0) + (travelOrdersCount || 0);

      // Revenue from host's guests (last 30 days)
      const bookingIds = (await supabase
        .from("bookings")
        .select("id")
        .in("guest_email", uniqueGuests.map(g => g.email))
        .then(res => res.data?.map(b => b.id) || []));

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
